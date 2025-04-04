import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const DetailsScreen = ({navigation, route}) => {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const scrollViewRef = useRef(null);
  const {id} = route.params;

  useEffect(() => {
    const fetchUserAndRoom = async () => {
      try {
        setLoading(true);
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);

        if (storedUser?.accessToken) {
          const response = await fetch(
            `api-end-point/rooms/get-room-details/${id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${storedUser.accessToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const roomData = await response.json();
          setRoom(roomData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load room details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRoom();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book this room.');
      return;
    }

    const val = {
      room_id: room?.r_id,
      user_id: user?.user?.id,
      owner_id: room?.u_id,
      price: room?.price,
    };

    try {
      setBookingLoading(true);
      const res = await fetch(
        'api-end-point/bookings/request-booking',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(val),
        },
      );

      const result = await res.json();

      if (res.ok) {
        Alert.alert(
          'Booking Successful',
          'Your booking request has been sent! We will notify you when the owner responds.',
          [{text: 'OK'}],
        );
      } else {
        Alert.alert(
          'Booking Failed',
          result.message || 'Failed to book the room.',
        );
      }
    } catch (error) {
      console.error('Error booking room:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setBookingLoading(false);
    }
  };

  const onImageChange = e => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const index = Math.floor(contentOffset.x / viewSize.width);
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#578FCA" />
        <Text style={styles.loadingText}>Loading room details...</Text>
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No room details found</Text>
      </View>
    );
  }

  console.log(room);


  return (
    <View style={styles.mainContainer}>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onImageChange}
            scrollEventThrottle={16}>
            {room?.room_image_url?.map((image, index) => (
              <Image key={index} source={{uri: image}} style={styles.image} />
            ))}
          </ScrollView>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {room?.room_image_url?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeImageIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* Status tag */}
          <View
            style={[
              styles.statusTag,
              room?.room_status === 'available'
                ? styles.availableTag
                : styles.bookedTag,
            ]}>
            <Text style={styles.statusText}>
              {room?.room_status === 'available' ? 'Available' : 'Booked'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Title and price section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{room?.title}</Text>
            <Text style={styles.price}>
              Rs. {room?.price}
              <Text style={styles.month}>/month</Text>
            </Text>
          </View>

          {/* Address with location icon */}
          <View style={styles.addressContainer}>
            <Icon name="location-on" size={20} color="#578FCA" />
            <Text style={styles.address} numberOfLines={2}>
              {room?.address}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{room?.description}</Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Icon name="category" size={22} color="#578FCA" />
                <Text style={styles.detailText}>{room?.room_type}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="aspect-ratio" size={22} color="#578FCA" />
                <Text style={styles.detailText}>{room?.areaSize}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="meeting-room" size={22} color="#578FCA" />
                <Text style={styles.detailText}>
                  {room?.no_of_room} Room(s)
                </Text>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              <View style={styles.amenityRow}>
                <View style={styles.amenityItem}>
                  <Icon
                    name="wifi"
                    size={22}
                    color={room?.wifi ? '#578FCA' : '#cccccc'}
                  />
                  <Text
                    style={[
                      styles.amenityText,
                      !room?.wifi && styles.unavailable,
                    ]}>
                    WiFi
                  </Text>
                </View>
                <View style={styles.amenityItem}>
                  <Icon
                    name="local-parking"
                    size={22}
                    color={room?.parking ? '#578FCA' : '#cccccc'}
                  />
                  <Text
                    style={[
                      styles.amenityText,
                      !room?.parking && styles.unavailable,
                    ]}>
                    Parking
                  </Text>
                </View>
              </View>

              <View style={styles.amenityRow}>
                <View style={styles.amenityItem}>
                  <Icon
                    name="local-drink"
                    size={22}
                    color={room?.water ? '#578FCA' : '#cccccc'}
                  />
                  <Text
                    style={[
                      styles.amenityText,
                      !room?.water && styles.unavailable,
                    ]}>
                    Water
                  </Text>
                </View>
                <View style={styles.amenityItem}>
                  <Icon
                    name="bolt"
                    size={22}
                    color={room?.electricity ? '#578FCA' : '#cccccc'}
                  />
                  <Text
                    style={[
                      styles.amenityText,
                      !room?.electricity && styles.unavailable,
                    ]}>
                    Electricity
                  </Text>
                </View>
              </View>

              <View style={styles.amenityRow}>
                <View style={styles.amenityItem}>
                  <Icon
                    name="restore-from-trash"
                    size={22}
                    color={room?.disposal_charge ? '#578FCA' : '#cccccc'}
                  />
                  <Text
                    style={[
                      styles.amenityText,
                      !room?.disposal_charge && styles.unavailable,
                    ]}>
                    Disposal
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {room?.room_status === 'available' && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBook}
            disabled={bookingLoading}>
            {bookingLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Icon name="bookmark" size={20} color="white" />
                <Text style={styles.buttonText}>Book Now</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#578FCA',
    marginTop: 12,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTag: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  availableTag: {
    backgroundColor: '#4CAF50',
  },
  bookedTag: {
    backgroundColor: '#FF5722',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 24,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#578FCA',
  },
  month: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 12,
  },
  address: {
    fontSize: 15,
    color: '#444',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#f5f7fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#444',
  },
  amenitiesContainer: {
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    padding: 16,
  },
  amenityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#444',
  },
  unavailable: {
    color: '#999',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    elevation: 2,
    flex: 1,
    marginRight: 8,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#578FCA',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    elevation: 2,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default DetailsScreen;
