import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const PendingScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [pendingRooms, setPendingRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!user) return;

    const fetchPendingRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'api-end-point/rooms/homeowner/rooms',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        const data = await res.json();

        // Filter rooms where admin_approval is false
        const filteredRooms = data.data.filter(room => !room.admin_approval);

        setPendingRooms(filteredRooms);
      } catch (error) {
        console.error('Error fetching pending rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRooms();
  }, [user]);

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="hourglass-empty" size={70} color="#ddd" />
      <Text style={styles.emptyTitle}>No Pending Rooms</Text>
      <Text style={styles.emptyText}>
        Rooms you've listed that are awaiting admin approval will appear here.
      </Text>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Pending Approval</Text>
        <Text style={styles.headerSubtitle}>
          {pendingRooms.length} {pendingRooms.length === 1 ? 'room' : 'rooms'}{' '}
          waiting for admin review
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon name="pending-actions" size={24} color="#578FCA" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#578FCA" />
          <Text style={styles.loadingText}>Loading your pending rooms...</Text>
        </View>
      ) : (
        <FlatList
          data={pendingRooms}
          keyExtractor={item => item.r_id.toString()}
          renderItem={({item}) => (
            <PendingRoomCard item={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyListComponent}
          ListHeaderComponent={
            pendingRooms.length > 0 ? ListHeaderComponent : null
          }
        />
      )}
    </SafeAreaView>
  );
};

/** Pending Room Card Component */
const PendingRoomCard = ({item, navigation}) => {
  // Extract amenities to display as features
  const features = [];
  if (item.wifi) features.push({name: 'WiFi', icon: 'wifi'});
  if (item.parking) features.push({name: 'Parking', icon: 'local-parking'});
  if (item.water) features.push({name: 'Water', icon: 'water-drop'});
  if (item.electricity) features.push({name: 'Electricity', icon: 'bolt'});

  // Limit to 3 features maximum
  const displayFeatures = features.slice(0, 3);
  const hasMoreFeatures = features.length > 3;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('OwnerDetails', {id: item.r_id})}
      style={styles.card}
      activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.room_image_url[0]}} style={styles.image} />
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
        {item.room_image_url.length > 1 && (
          <View style={styles.imageCountBadge}>
            <Icon name="collections" size={12} color="#FFF" />
            <Text style={styles.imageCountText}>
              {item.room_image_url.length}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.price}>
          Rs. {item.price.toLocaleString()}
          <Text style={styles.month}>/month</Text>
        </Text>

        <View style={styles.locationContainer}>
          <Icon name="location-on" size={14} color="#888" />
          <Text style={styles.location} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {displayFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name={feature.icon} size={14} color="#578FCA" />
              <Text style={styles.featureText}>{feature.name}</Text>
            </View>
          ))}

          {hasMoreFeatures && (
            <View style={styles.featureItem}>
              <Text style={styles.moreFeatures}>+{features.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.roomTypeContainer}>
            <Text style={styles.roomType}>{item.room_type}</Text>
          </View>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate('OwnerDetails', {id: item.r_id})
            }>
            <Text style={styles.viewButtonText}>View Details</Text>
            <Icon name="arrow-forward" size={14} color="#578FCA" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PendingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF3FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.15,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pendingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFA000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pendingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#578FCA',
    marginBottom: 8,
  },
  month: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'normal',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 4,
  },
  moreFeatures: {
    fontSize: 12,
    color: '#578FCA',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  roomTypeContainer: {
    backgroundColor: '#EBF3FA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  roomType: {
    fontSize: 12,
    color: '#578FCA',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#578FCA',
    fontWeight: '500',
    marginRight: 4,
  },
});
