import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPreferences from '../components/userPreferences/UserPrefernces';

const HomeScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [nearBy, setNearBy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !user.accessToken) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          'https://backend-roomfinder-api.onrender.com/recommend/rooms',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFeaturedData(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecommendations();
      if (user.user && user.user.name) {
        setUserName(user.user.name.split(' ')[0]); // Get first name
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNear = async () => {
      if (!user || !user.accessToken) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          'https://backend-roomfinder-api.onrender.com/rooms/nearby/2',
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
        console.log(response);
        setNearBy(data.rooms);
      } catch (error) {
        console.error('Error fetching nearby rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNear();
    }
  }, [user]);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user || !user.accessToken) return;

      try {
        const response = await fetch(
          'https://backend-roomfinder-api.onrender.com/recommend/get-preferences',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );

        const data = await response.json();
        setPreferences(data.data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    if (user) {
      fetchPreferences();
    }
  }, [user]);

  if (user?.user?.role !== 'homeOwner' && !preferences) {
    return <UserPreferences />;
  }

  console.log(featuredData);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      <View style={styles.homeContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>
                {user
                  ? `Hello, ${user?.user.full_name}! 👋`
                  : 'Welcome back! 👋'}
              </Text>
              <View style={styles.locationContainer}>
                <Icon name="location-on" size={18} color="#444" />
                <Text style={styles.locationText}>Bhaktapur, Nepal</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Pressable
              onPress={() => navigation.navigate('Search')}
              style={styles.searchBox}>
              <Icon name="search" size={22} color="#666" />
              <Text style={styles.searchPlaceholder}>Searching listing</Text>
            </Pressable>
          </View>

          {/* Featured Listings */}
          <SectionTitle
            title="Recommended for you"
            name="Explore"
            navigation={navigation}
          />

          {loading && featuredData.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0077b6" />
            </View>
          ) : (
            <FlatList
              data={featuredData}
              keyExtractor={item => item.room_id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <FeaturedCard item={item} navigation={navigation} />
              )}
              ItemSeparatorComponent={() => <View style={{width: 15}} />}
              contentContainerStyle={styles.featuredListContainer}
            />
          )}

          {/* Near You Listings */}
          <SectionTitle
            title="Near You"
            navigation={navigation}
            name="NearestMap"
          />

          {loading && nearBy?.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0077b6" />
            </View>
          ) : (
            <FlatList
              data={nearBy}
              keyExtractor={item => item.r_id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <NearYouCard item={item} navigation={navigation} />
              )}
              ItemSeparatorComponent={() => <View style={{height: 15}} />}
              contentContainerStyle={styles.nearListContainer}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const SectionTitle = ({title, name, navigation}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={() => navigation.navigate(name)}>
      {title !== 'Recommended for you' && (
        <Text style={styles.seeAllText}>See All</Text>
      )}
    </TouchableOpacity>
  </View>
);

const FeaturedCard = ({item, navigation}) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Details', {id: item.room_id})}
    style={styles.featuredCard}>
    <View style={styles.imageContainer}>
      <Image
        source={{uri: item.room_details.room_image_url[0]}}
        style={styles.featuredImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
        style={styles.imageFade}
      />
      <View style={styles.featuredPriceTag}>
        <Text style={styles.featuredPriceText}>
          Rs. {item.room_details.price}/mo
        </Text>
      </View>
    </View>
    <View style={styles.featuredDetails}>
      <Text style={styles.featuredTitle} numberOfLines={1}>
        {item.room_details.title}
      </Text>
      <View style={styles.iconRow}>
        <Icon name="location-on" size={14} color="#666" />
        <Text style={styles.featuredLocation} numberOfLines={1}>
          {item.room_details.address}
        </Text>
      </View>

      <View style={styles.featuredStats}>
        <View style={styles.statItem}>
          <Icon name="hotel" size={14} color="#666" />
          <Text style={styles.statText}>
            {item.room_details.beds || 1}{' '}
            {item.room_details.beds === 1 ? 'Bed' : 'Beds'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="aspect-ratio" size={14} color="#666" />
          <Text style={styles.statText}>
            {item.room_details.areaSize} sq ft
          </Text>
        </View>
        <View
          style={
            item.room_details.room_status === 'available'
              ? styles.availableContainer
              : styles.bookedContainer
          }>
          <Icon
            name={
              item.room_details.room_status === 'available'
                ? 'check-circle'
                : 'cancel'
            }
            size={14}
            color={
              item.room_details.room_status === 'available'
                ? '#28a745'
                : '#dc3545'
            }
          />
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.room_details.room_status === 'available'
                    ? '#28a745'
                    : '#dc3545',
              },
            ]}>
            {item.room_details.room_status === 'available'
              ? 'Available'
              : 'Booked'}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

/** Near You Listing Card */
const NearYouCard = ({item, navigation}) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Details', {id: item.r_id})}
    style={styles.nearCard}>
    <Image source={{uri: item.room_image_url[0]}} style={styles.nearImage} />
    <View style={styles.nearDetails}>
      <Text style={styles.nearTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={styles.iconRow}>
        <Icon name="location-on" size={14} color="#666" />
        <Text style={styles.nearLocation} numberOfLines={1}>
          {item.address}
        </Text>
      </View>

      <View style={styles.nearStats}>
        <View style={styles.statItem}>
          <Icon name="hotel" size={14} color="#666" />
          <Text style={styles.statText}>
            {item.beds || 1} {item.beds === 1 ? 'Bed' : 'Beds'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="aspect-ratio" size={14} color="#666" />
          <Text style={styles.statText}>{item.areaSize}sq ft</Text>
        </View>
      </View>

      <View style={styles.nearPriceRow}>
        <Text style={styles.nearPrice}>Rs. {item.price}/month</Text>
        <View
          style={
            item.room_status === 'available'
              ? styles.availableContainer
              : styles.bookedContainer
          }>
          <Icon
            name={item.room_status === 'available' ? 'check-circle' : 'cancel'}
            size={14}
            color={item.room_status === 'available' ? '#28a745' : '#dc3545'}
          />
          <Text
            style={[
              styles.statusText,
              {color: item.room_status === 'available' ? '#28a745' : '#dc3545'},
            ]}>
            {item.room_status === 'available' ? 'Available' : 'Booked'}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default HomeScreen;

/** Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  homeContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 70,
  },
  header: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4757',
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e9ecef',
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  profileImagePlaceholder: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#0077b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    padding: 14,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#adb5bd',
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: '#0077b6',
    marginLeft: 12,
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  categoriesContainer: {
    marginTop: 20,
  },
  categoriesContent: {
    paddingVertical: 8,
  },
  categoryButton: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0077b6',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredListContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    width: 260,
    borderWidth: 2,
    borderColor: '#e3e3e3',
  },
  imageContainer: {
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  featuredPriceTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 119, 182, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredPriceText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  featuredDetails: {
    padding: 14,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0077b6',
    marginBottom: 6,
  },
  featuredLocation: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 4,
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  nearStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 4,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  nearListContainer: {
    paddingBottom: 20,
  },
  nearCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e3e3e3',
    padding: 2,
  },
  nearImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  nearDetails: {
    flex: 1,
    padding: 12,
  },
  nearTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  nearLocation: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 4,
    flex: 1,
  },
  nearPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  nearPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0077b6',
  },
});
