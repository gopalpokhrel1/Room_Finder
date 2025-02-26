import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeOwnerListScreen = () => {
  // Sample data: Properties added by the owner
  const [properties, setProperties] = useState([
    {
      id: '1',
      name: 'Luxury Apartment',
      price: 15000,
      location: 'Kathmandu, Nepal',
      photo: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      booked: false, // Booking status
    },
    {
      id: '2',
      name: '2BHK Flat',
      price: 10000,
      location: 'Pokhara, Nepal',
      photo: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      booked: true, // Booking status
    },
    {
      id: '3',
      name: 'Cozy Studio',
      price: 8000,
      location: 'Lalitpur, Nepal',
      photo: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      booked: false, // Booking status
    },
  ]);

  const renderItem = ({item}) => (
    <View style={styles.propertyCard}>
      <Image source={{uri: item.photo}} style={styles.propertyImage} />
      <View style={styles.propertyDetails}>
        <Text style={styles.propertyName}>{item.name}</Text>
        <Text style={styles.propertyPrice}>Rs. {item.price}</Text>
        <View style={styles.location}>
          <Icon name="location-on" size={18} color="#aaa" />
          <Text style={styles.propertyLocation}>{item.location}</Text>
        </View>
        {/* Booking Status */}
        <Text
          style={[
            styles.bookingStatus,
            item.booked ? styles.booked : styles.available,
          ]}>
          {item.booked ? 'Booked' : 'Available'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Added Properties</Text>

      {/* Scrollable View for Property List */}
      <ScrollView contentContainerStyle={styles.propertyListContainer}>
        <FlatList
          data={properties}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/* Button to Add New Property */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Property</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeOwnerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  propertyListContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  propertyCard: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  propertyImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  propertyDetails: {
    flex: 1,
    padding: 16,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  propertyPrice: {
    fontSize: 18,
    color: '#FF5733',
    fontWeight: '500',
    marginVertical: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyLocation: {
    marginLeft: 6,
    fontSize: 14,
    color: '#777',
  },
  bookingStatus: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  booked: {
    color: '#FF5733', // Red for booked
  },
  available: {
    color: '#4CAF50', // Green for available
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    marginHorizontal: 18,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
