import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreScreen = ({navigation}) => {
const [user, setUser] = useState();
const [data, setData] = useState();
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
  const fetchData = async () => {
    try {
      const res = await fetch("https://backend-roomfinder-api.onrender.com/rooms/getrooms", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      const data = await res.json();
      setData(data.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={item => item.r_id}
        columnWrapperStyle={styles.row}
        renderItem={({item}) => (
          <View  style={styles.propertyCard}>
            <Image source={{uri: item.room_image_url[0]}} style={styles.propertyImage} />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>{item.title}</Text>
              <Text style={styles.propertyPrice}>Rs. {item.price}/month</Text>
              <Text style={styles.propertyLocation}>{item.address}</Text>
              <TouchableOpacity onPress={()=> navigation.navigate("Details", {id: item.r_id})} style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical:36,
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  propertyCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  propertyImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  propertyInfo: {
    padding: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  propertyPrice: {
    fontSize: 14,
    color: '#578FCA',
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
