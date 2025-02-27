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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPreferences from '../components/userPreferences/UserPrefernces';

const HomeScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [firstLogin, setFirstLogin] = useState<boolean | null>(null);

  const [featuredData, setFeaturedData] = useState([]);
  const [nearBy, setNearBy] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !user.accessToken || !firstLogin) {
        console.log("User not available or not first login, skipping fetch");
        return;
      }
  
      try {
        const response = await fetch(
          'https://backend-roomfinder-api.onrender.com/recommend/rooms',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setFeaturedData(data); 
      } catch (error) {
        console.error("Error fetching recommended rooms:", error);
      }
    };
  
    if (user && firstLogin) {
      fetchRecommendations();
    }
  }, [user, firstLogin]);

  useEffect(()=>{
    AsyncStorage.removeItem("fistLogin");
  }, [])

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

    const checkFirstLogin = async () => {
      try {
        const value = await AsyncStorage.getItem('firstLogin');
        setFirstLogin(value !== null);
      } catch (error) {
        console.error('Error checking first login:', error);
      }
    };

    fetchUser();
    checkFirstLogin();
  }, []);

  useEffect(() => {
    const fetchNear = async () => {
      if (!user || !user.accessToken) {
        console.log('User or token not available, skipping fetch');
        return;
      }

      try {
        const response = await fetch(
          'https://backend-roomfinder-api.onrender.com/rooms/nearby/1000',
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
        setNearBy(data.rooms); // Save the data in state
        console.log('Nearby rooms:', data);
      } catch (error) {
        console.error('Error fetching nearby rooms:', error);
      }
    };

    if (user) {
      fetchNear();
    }
  }, [user]); // Runs when user changes

  if (firstLogin === null || user === null) {
    return null;
  }

  if (!firstLogin && user?.user?.role !== "homeOwner") {
    return <UserPreferences />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={28} color="#444" />
            <Text style={styles.locationText}>Bhaktapur, Nepal</Text>
          </View>
          <Icon name="notifications-none" size={28} color="#444" />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Pressable
            onPress={() => navigation.navigate('Search')}
            style={styles.searchBox}>
            <Icon name="search" size={22} color="gray" />
            <Text style={styles.searchPlaceholder}>Search listings...</Text>
          </Pressable>
        </View>

        {/* Featured Listings */}
        <SectionTitle
          title="Recommendation"
          name="Explore"
          navigation={navigation}
        />
        <FlatList
          data={featuredData}
          keyExtractor={item => item.room_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <FeaturedCard item={item} navigation={navigation} />
          )}
          ItemSeparatorComponent={() => <View style={{width: 15}} />}
        />
        {/* Near You Listings */}
        <SectionTitle
          title="Near You"
          navigation={navigation}
          name="NearestMap"
        />
        <FlatList
          data={nearBy}
          keyExtractor={item => item.r_id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <NearYouCard  item={item} navigation={navigation}/>}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

/** Section Header Component */
const SectionTitle = ({title, name, navigation}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {
      title !== "Recommendation" &&(
        <TouchableOpacity onPress={() => navigation.navigate(name)}>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
      )
    }
  </View>
);

/** Featured Listing Card */
const FeaturedCard = ({item, navigation}) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Details', {id: item.room_id})}
    style={styles.featuredCard}>
    <Image source={{uri: item.room_details.room_image_url[0]}} style={styles.featuredImage} />
    <View style={styles.featuredDetails}>
      <Text style={styles.featuredTitle}>{item.room_details.name}</Text>
      <Text style={styles.featuredPrice}>Rs. {item.room_details.price}/month</Text>
      <View style={styles.iconRow}>
        <Icon name="location-on" size={16} color="gray" />
        <Text style={styles.featuredLocation}>{item.room_details.address}</Text>
      </View>
      {/* <View style={styles.iconRow}>
        <Icon name="bed" size={16} color="gray" />
        <Text style={styles.featuredInfo}>{item.available_rooms} Beds</Text>
        <Icon
          name="square-foot"
          size={16}
          color="gray"
          style={{marginLeft: 10}}
        />
        <Text style={styles.featuredInfo}>{item.area}</Text>
      </View> */}
    </View>
  </TouchableOpacity>
);

/** Near You Listing Card */
const NearYouCard = ({item,navigation}) => (
  
  <TouchableOpacity
  onPress={() => navigation.navigate('Details', {id:item.r_id})}
  style={styles.nearCard}>
    <Image source={{uri: item.room_image_url[0]}} style={styles.nearImage} />
    <View style={styles.nearDetails}>
      <Text style={styles.nearTitle}>{item.title}</Text>
      <Text style={styles.nearPrice}>Rs. {item.price}/month</Text>
      <View style={styles.iconRow}>
        <Icon name="location-on" size={16} color="gray" />
        <Text style={styles.nearLocation}>{item.address}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default HomeScreen;

/** Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ececec',
    borderRadius: 10,
    padding: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 8,
  },
  filterBox: {
    backgroundColor: '#0077b6',
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#0077b6',
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    width: 260,
    elevation: 4,
    marginRight: 10,
  },
  featuredImage: {
    width: '100%',
    height: 150,
  },
  featuredDetails: {
    padding: 10,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0077b6',
  },
  featuredLocation: {
    fontSize: 12,
    color: 'gray',
  },
  featuredInfo: {
    fontSize: 12,
    color: 'gray',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  nearCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  nearImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  nearDetails: {
    marginLeft: 12,
    flex: 1,
  },
  nearTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  nearPrice: {
    fontSize: 14,
    color: '#0077b6',
  },
  nearLocation: {
    fontSize: 12,
    color: 'gray',
  },
});
