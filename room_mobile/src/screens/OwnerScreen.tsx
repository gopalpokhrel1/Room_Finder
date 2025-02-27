import React, {useState} from 'react';
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
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const OwnerScreen = ({navigation}) => {
  // Mock Data for Homeowner Listings
  const [listings, setListings] = useState([
    {
      r_id: '1',
      title: 'Cozy Apartment in Kathmandu',
      price: 12000,
      address: 'Thamel, Kathmandu',
      room_image_url: ['https://rs-rooms-cdn.floorplanner.com/rooms/images/thumbs/480/j_PEp79B8tJse4Lm.jpg'],
    },
    {
      r_id: '2',
      title: 'Spacious Flat with Balcony',
      price: 18000,
      address: 'Lalitpur, Nepal',
      room_image_url: ['https://rs-rooms-cdn.floorplanner.com/rooms/images/thumbs/480/j_PEp79B8tJse4Lm.jpg'],
    },
    {
      r_id: '3',
      title: 'Single Room for Rent',
      price: 8000,
      address: 'Bhaktapur, Nepal',
      room_image_url: ['https://rs-rooms-cdn.floorplanner.com/rooms/images/thumbs/480/j_PEp79B8tJse4Lm.jpg'],
    },
  ]);

  const handleDelete = id => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => setListings(listings.filter(item => item.r_id !== id)),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <StatusBar backgroundColor="#0077b6" barStyle="dark-content" />
      {/* <View style={styles.heroSection}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View> */}

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
        <Icon name="dashboard" size={30} color="#673ab7" />
        <Text style={styles.statTitle}>Total Listings</Text>
          <Text style={styles.statValue}>{listings.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="check-circle" size={30} color="#0077b6" />
          <Text style={styles.statTitle}>Booked</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="hourglass-empty" size={30} color="#ff9800" />
          <Text style={styles.statTitle}>Pending</Text>
          <Text style={styles.statValue}>2</Text>
        </View>
      </View>

      {/* Listings */}
      <Text style={styles.sectionTitle}>Your Listings</Text>
      {listings.length === 0 ? (
        <Text style={styles.emptyText}>No listings added yet.</Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.r_id.toString()}
          renderItem={({item}) => (
            <ListingCard
              item={item}
              navigation={navigation}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScrollView>
  );
};

/** Listing Card Component */
const ListingCard = ({item, navigation}) => (
  <TouchableOpacity onPress={()=> navigation.navigate("OwnerDetails")} style={styles.card}>
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
    paddingHorizontal: 16,
    paddingVertical:48,
    backgroundColor: '#f9f9f9',
  },
  heroSection: {
    backgroundColor: '#0077b6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
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
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
