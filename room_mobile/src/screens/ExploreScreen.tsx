import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

const ExplorePage = () => {
  const [search, setSearch] = useState('');

  const properties = {
    house: [
      {
        id: '1',
        name: 'Luxury 4-Bedroom Villa',
        price: 25000,
        location: 'Biratnagar',
        image:
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',

        description:
          'A luxurious 4-bedroom villa with premium amenities and a private pool.',
      },
      {
        id: '2',
        name: 'Modern 3-Bedroom House',
        price: 15000,
        location: 'Pokhara',
        image:
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        description:
          'A spacious and modern 3-bedroom house with a beautiful garden.',
      },
    ],
    flat: [
      {
        id: '3',
        name: '2-Bedroom Flat in Kathmandu',
        price: 10000,
        location: 'Kathmandu',
        image:
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        description: 'A modern 2-bedroom flat with great amenities.',
      },
      {
        id: '4',
        name: 'Spacious Flat in Lalitpur',
        price: 12000,
        location: 'Lalitpur',
        image:
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        description:
          'A spacious flat with 3 bedrooms and convenient transport links.',
      },
    ],
    room: [
      {
        id: '5',
        name: 'Single Room in Chitwan',
        price: 5000,
        location: 'Chitwan',
        image:
          'https://images.pexels.com/photos/5405185/pexels-photo-5405185.jpeg',
        description: 'A cozy single room with all the basic amenities.',
      },
      {
        id: '6',
        name: 'Shared Room in Pokhara',
        price: 3500,
        location: 'Pokhara',
        image:
          'https://images.pexels.com/photos/4393858/pexels-photo-4393858.jpeg',
        description:
          'A shared room ideal for students and young professionals.',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for properties..."
            placeholderTextColor="black"
            value={search}
            onChangeText={setSearch}
          />
        </View>

    

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Flats</Text>
          <FlatList
            data={properties.flat}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.propertyCard}>
                <Image
                  source={{uri: item.image}}
                  style={styles.propertyImage}
                />
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyName}>{item.name}</Text>
                  <Text style={styles.propertyPrice}>
                    Rs. {item.price}/month
                  </Text>
                  <Text style={styles.propertyLocation}>{item.location}</Text>
                  <Text style={styles.propertyDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Rooms</Text>
          <FlatList
            data={properties.room}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.propertyCard}>
                <Image
                  source={{uri: item.image}}
                  style={styles.propertyImage}
                />
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyName}>{item.name}</Text>
                  <Text style={styles.propertyPrice}>
                    Rs. {item.price}/month
                  </Text>
                  <Text style={styles.propertyLocation}>{item.location}</Text>
                  <Text style={styles.propertyDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExplorePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    height: "auto", 
    padding:1,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 12,
    fontSize: 16,
    backgroundColor: '#fff',  // Make sure the background is set correctly
    borderWidth: 1,           // Optional: If you want to add a border to the input box
    borderColor: '#ccc',      // Border color (light grey for visibility)
    borderRadius: 8,          // Rounded corners
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  propertyCard: {
    width: 250,
    marginLeft: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  propertyImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  propertyInfo: {
    padding: 12,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  propertyPrice: {
    fontSize: 16,
    color: '#578FCA',
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  propertyDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  viewButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
