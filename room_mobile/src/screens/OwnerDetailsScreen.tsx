import React from 'react';
import { 
  View, Text, Image, ScrollView, TouchableOpacity, 
  Alert, StyleSheet, Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OwnerDetailsScreen = ({ navigation }) => {
  // Sample test data
  const listing = {
    title: "Luxury Apartment with City View",
    description: "Fully furnished apartment with modern amenities.",
    price: 20000,
    room_type: "Apartment",
    latitude: 27.670593,
    longitude: 85.421726,
    address: "Lazimpat, Kathmandu",
    areaSize: "1200 sqft",
    no_of_room: 3,
    room_status: "available",
    room_image_url: [
      "https://rs-rooms-cdn.floorplanner.com/rooms/images/thumbs/480/j_PEp79B8tJse4Lm.jpg",
      "https://rs-rooms-cdn.floorplanner.com/rooms/images/thumbs/480/j_PEp79B8tJse4Lm.jpg"
    ],
    wifi: true,
    parking: true,
    water: true,
    disposal_charge: false,
    electricity: true,
    contact: "9800000000",
    admin_approval: true,
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => {
            Alert.alert("Deleted!", "Listing has been removed.");
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Images */}
      <ScrollView horizontal pagingEnabled>
        {listing.room_image_url.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>Rs. {listing.price}/month</Text>
        <Text style={styles.description}>{listing.description}</Text>

        <Text style={styles.info}><Icon name="location-on" size={18} /> {listing.address}</Text>
        <Text style={styles.info}><Icon name="category" size={18} /> {listing.room_type}</Text>
        <Text style={styles.info}><Icon name="aspect-ratio" size={18} /> {listing.areaSize}</Text>
        <Text style={styles.info}><Icon name="meeting-room" size={18} /> {listing.no_of_room} Room(s)</Text>
        <Text style={styles.info}><Icon name="wifi" size={18} /> WiFi: {listing.wifi ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="local-parking" size={18} /> Parking: {listing.parking ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="local-drink" size={18} /> Water: {listing.water ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="bolt" size={18} /> Electricity: {listing.electricity ? "Available" : "Not Available"}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal:20,
  },

  image: {
    width: 350,
    height: 250,
    borderRadius: 15,
    marginRight:8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  detailsContainer: {

    borderRadius: 12,
    marginVertical:12,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#578FCA',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#d9534f',
    borderRadius: 10,
    elevation: 3,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default OwnerDetailsScreen;