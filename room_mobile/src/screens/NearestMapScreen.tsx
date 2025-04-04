import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const NearestMapScreen = ({navigation}) => {
  const [nearBy, setNearBy] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const mapRef = useRef(null);
  const detailsBottomSheet = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNear = async () => {
      if (!user || !user.accessToken) {
        console.log('User or token not available, skipping fetch');
        return;
      }

      try {
        const response = await fetch(
          'api-end-point/rooms/nearby/2',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNearBy(data.rooms);
      } catch (error) {
        console.error('Error fetching nearby rooms:', error);
      }
    };

    if (user) {
      fetchNear();
    }
  }, [user]);

  const showRoomDetails = room => {
    setSelectedRoom(room);
    // Animate the bottom sheet up
    Animated.timing(detailsBottomSheet, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Center the map on the selected marker
    mapRef.current?.animateToRegion(
      {
        latitude: room.latitude,
        longitude: room.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500,
    );
  };

  const hideRoomDetails = () => {
    // Animate the bottom sheet down
    Animated.timing(detailsBottomSheet, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedRoom(null));
  };

  const translateY = detailsBottomSheet.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
    extrapolate: 'clamp',
  });

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: user?.user.location.latitude || 0,
          longitude: user?.user.location.longitude || 0,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        // showsUserLocation
        // showsMyLocationButton
        customMapStyle={mapStyle}>
        <Marker
          coordinate={{
            latitude: user?.user.location.latitude || 0,
            longitude: user?.user.location.longitude || 0,
          }}
          title="Your Location"
          description="This is your current location.">
          <View style={styles.myLocationMarker}>
            <View style={styles.myLocationDot} />
          </View>
        </Marker>

        {/* Room Markers */}
        {nearBy?.map((room, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: room.latitude,
              longitude: room.longitude,
            }}
            title={room.title}
            description={`$${room.price}`}
            onPress={() => showRoomDetails(room)}>
            <View
              style={[
                styles.roomMarker,
                selectedRoom?.r_id === room.r_id && styles.selectedRoomMarker,
              ]}>
              <Icon
                name="home"
                size={18}
                color={selectedRoom?.r_id === room.r_id ? '#fff' : '#4A80F0'}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Room List at bottom */}
      {!selectedRoom && (
        <View style={styles.scrollContainer}>
          <Text style={styles.nearbyTitle}>Nearby Properties</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}>
            {nearBy?.map((room, index) => (
              <TouchableOpacity
                onPress={() => showRoomDetails(room)}
                key={index}
                style={styles.itemContainer}
                activeOpacity={0.9}>
                <Image
                  source={{uri: room.room_image_url[0]}}
                  style={styles.image}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.imageGradient}
                />
                <View style={styles.roomInfoOverlay}>
                  <Text style={styles.itemPrice}>${room.price}</Text>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {room.title}
                  </Text>
                  <View style={styles.locationRow}>
                    <Icon name="place" size={12} color="#fff" />
                    <Text style={styles.itemLocation} numberOfLines={1}>
                      {room.address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedRoom && (
        <Animated.View
          style={[styles.roomDetailsContainer, {transform: [{translateY}]}]}>
          <View style={styles.bottomSheetHandle}>
            <View style={styles.handleBar} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Room Images */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.imageCarousel}>
              {selectedRoom.room_image_url.map((imageUrl, idx) => (
                <Image
                  key={idx}
                  source={{uri: imageUrl}}
                  style={styles.detailImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={hideRoomDetails}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Room Details */}
            <View style={styles.detailsContent}>
              <Text style={styles.detailTitle}>{selectedRoom.title}</Text>
              <Text style={styles.detailPrice}>
                ${selectedRoom.price}{' '}
                <Text style={styles.priceUnit}>/month</Text>
              </Text>

              <View style={styles.addressRow}>
                <Icon name="place" size={16} color="#4A80F0" />
                <Text style={styles.detailAddress}>{selectedRoom.address}</Text>
              </View>


              {/* Description */}
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>
                {selectedRoom.description ||
                  'Modern and spacious accommodation with all amenities needed for comfortable living. Conveniently located with easy access to public transportation, shopping centers, and restaurants.'}
              </Text>

              {/* Contact Button */}
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() =>
                  navigation.navigate('Details', {id: selectedRoom.r_id})
                }>
                <Text style={styles.contactButtonText}>View Full Details</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

export default NearestMapScreen;

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d6e2e6',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#cfd4d5',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7492a8',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dde2e3',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dde2e3',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#c5d2d4',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b9d3c2',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a3c7df',
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 18,
    color: '#4A80F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
  },
  map: {
    flex: 1,
  },
  myLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 128, 240, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A80F0',
    borderWidth: 2,
    borderColor: 'white',
  },
  roomMarker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A80F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedRoomMarker: {
    backgroundColor: '#4A80F0',
    borderColor: '#FFFFFF',
    transform: [{scale: 1.1}],
  },
  scrollContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 20,
    backgroundColor: 'transparent',
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 16,
    color: '#333',
  },
  scrollView: {
    paddingLeft: 16,
  },
  itemContainer: {
    width: 200,
    height: 180,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    borderRadius: 16,
  },
  roomInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  itemPrice: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  itemTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLocation: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 2,
    opacity: 0.9,
  },
  roomDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomSheetHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
  },
  imageCarousel: {
    height: 220,
  },
  detailImage: {
    width: width,
    height: 220,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContent: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A80F0',
    marginBottom: 12,
  },
  priceUnit: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'normal',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailAddress: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f7fb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
