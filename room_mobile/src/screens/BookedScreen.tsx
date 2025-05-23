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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const BookedScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [bookedRooms, setBookedRooms] = useState([]);

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

    const fetchBookedRooms = async () => {
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
        const filteredRooms = data.data.filter(
          room => room.room_status === 'occupied',
        );

        setBookedRooms(filteredRooms);
      } catch (error) {
        console.error('Error fetching booked rooms:', error);
      }
    };

    fetchBookedRooms();
  }, [user]);



  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Booked Rooms</Text>
      {bookedRooms.length === 0 ? (
        <Text style={styles.emptyText}>No rooms have been booked yet.</Text>
      ) : (
        <FlatList
          data={bookedRooms}
          keyExtractor={item => item.r_id.toString()}
          renderItem={({item}) => (
            <BookedRoomCard item={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

/** Booked Room Card Component */
const BookedRoomCard = ({item, navigation}) => (
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

export default BookedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
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
});
