import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const OwnerScreen = ({navigation}) => {
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState();

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
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          'https://backend-roomfinder-api.onrender.com/rooms/homeowner/rooms',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        const data = await res.json();
        setRooms(data.data);
      } catch {
      } finally {
      }
    };
    fetchRoom();
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0077b6" barStyle="dark-content" />
      <ScrollView>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={()=> navigation.navigate("Home")} style={styles.statCard}>
            <Icon name="dashboard" size={30} color="#673ab7" />
            <Text style={styles.statTitle}>Total Listings</Text>
            <Text style={styles.statValue}>{rooms?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> navigation.navigate("Booked")}  style={styles.statCard}>
            <Icon name="check-circle" size={30} color="#0077b6" />
            <Text style={styles.statTitle}>Booked</Text>
            <Text style={styles.statValue}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate("Pending")}  style={styles.statCard}>
            <Icon name="hourglass-empty" size={30} color="#ff9800" />
            <Text style={styles.statTitle}>Pending</Text>
            <Text style={styles.statValue}>2</Text>
          </TouchableOpacity>
        </View>

        {/* Listings */}
        <Text style={styles.sectionTitle}>Your Listings</Text>
        {rooms?.length === 0 ? (
          <Text style={styles.emptyText}>No listings added yet.</Text>
        ) : (
          <FlatList
            data={rooms}
            keyExtractor={item => item.r_id.toString()}
            renderItem={({item}) => (
              <ListingCard item={item} navigation={navigation} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRoom')}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

/** Listing Card Component */
const ListingCard = ({item, navigation}) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('OwnerDetails', {id: item.r_id})}
    style={styles.card}>
    <Image source={{uri: item.room_image_url[0]}} style={styles.image} />
    <View style={styles.details}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Rs. {item.price}/month</Text>
      <Text style={styles.location}>
        <Icon name="location-on" size={14} color="gray" /> {item.address}
      </Text>
    </View>
  </TouchableOpacity>
);

export default OwnerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 48,
    backgroundColor: '#f9f9f9',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: screenWidth / 3 - 16,
    elevation: 3,
  },
  statTitle: {
    fontSize: 12,
    color: 'gray',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    marginBottom: 10,
    alignItems: 'center',
    width: screenWidth - 32,
    alignSelf: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0077b6',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: 'gray',
  },
  /** Floating Add Button **/
  addButton: {
    position: 'absolute',
    bottom: 60,
    right: 5,
    backgroundColor: '#0077b6',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
