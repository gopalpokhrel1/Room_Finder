import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NearestMapScreen = ({navigation}) => {
  const [nearBy, setNearBy] = useState();
  const [user, setUser] = useState();

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
        console.log('Nearby rooms:', data);
        setNearBy(data.rooms);
      } catch (error) {
        console.error('Error fetching nearby rooms:', error);
      }
    };

    if (user) {
      fetchNear();
    }
  }, [user]);

  console.log(nearBy);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 27.670367,
          longitude: 85.421729,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {/* Render markers dynamically based on data */}
        {nearBy?.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>

      {/* Horizontal List of Items */}
      <View style={styles.scrollContainer}>
        <ScrollView horizontal={true} style={styles.scrollView}>
          {nearBy?.map((marker, index) => (
            <TouchableOpacity onPress={()=>navigation.navigate("Details", {id:marker.r_id})} key={index} style={styles.itemContainer}>
              <Image
                source={{uri: marker.room_image_url[0]}}
                style={styles.image}
              />
              <Text style={styles.itemTitle}>{marker.title}</Text>
              <Text style={styles.itemPrice}>{`$${marker.price}`}</Text>
              <Text style={styles.itemLocation}>{marker.address}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default NearestMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  scrollContainer: {
    position: 'absolute',
    width:"100%",
    bottom: 0,
    // left: 10,
    // right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    padding: 10,
  },
  scrollView: {
    paddingHorizontal: 5,
  },
  itemContainer: {
    width: 150,
    padding:12,
    marginRight: 10,
    borderWidth:1,
    borderColor:"gray",
    borderRadius:12,
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    color: '#007BFF',
    marginBottom: 5,
  },
  itemLocation: {
    fontSize: 12,
    color: 'gray',
  },
});
