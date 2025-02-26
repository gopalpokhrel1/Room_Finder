import React from 'react';
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

const NearestMapScreen = () => {
  // Custom data for markers and items to be displayed in horizontal scroll
  const markers = [
    {
      latitude: 27.670593,
      longitude: 85.421726,
      title: 'Room 1',
      description: 'Spacious room with great amenities',
      image: 'https://live.staticflickr.com/8165/7292387798_960bb72cbc_b.jpg',
      price: 50,
      location: 'Kathmandu, Nepal',
    },
    {
      latitude: 27.671593,
      longitude: 85.422726,
      title: 'Room 2',
      description: 'Cozy room in a quiet neighborhood',
      image: 'https://live.staticflickr.com/8165/7292387798_960bb72cbc_b.jpg',
      price: 40,
      location: 'Pokhara, Nepal',
    },
    {
      latitude: 27.672593,
      longitude: 85.423726,
      title: 'Room 3',
      description: 'Modern room with amazing city views',
      image: 'https://live.staticflickr.com/8165/7292387798_960bb72cbc_b.jpg',
      price: 60,
      location: 'Lalitpur, Nepal',
    },
    // More marker data as required
  ];

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: markers[0].latitude,
          longitude: markers[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {/* Render markers dynamically based on data */}
        {markers.map((marker, index) => (
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
          {markers.map((marker, index) => (
            <View key={index} style={styles.itemContainer}>
              <Image source={{uri: marker.image}} style={styles.image} />
              <Text style={styles.itemTitle}>{marker.title}</Text>
              <Text style={styles.itemPrice}>{`$${marker.price}`}</Text>
              <Text style={styles.itemLocation}>{marker.location}</Text>
            </View>
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
    bottom: 0,
    // left: 10,
    // right: 10,
    backgroundColor: '#578FCA',
    borderRadius: 10,
    padding: 10,
  },
  scrollView: {
    paddingHorizontal: 5,
  },
  itemContainer: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
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
