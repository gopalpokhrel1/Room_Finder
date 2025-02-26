import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwYm95fGVufDB8fDB8fHww',
            }} // User profile image
            style={styles.profileImage}
          />
          <View style={styles.headerContent}>
            <Text style={styles.username}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
            <Text style={styles.location}>Kathmandu, Nepal</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Booking History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking History</Text>
          {/* Booking 1 */}
          <View style={styles.bookingItem}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
              }} // Room Image 1
              style={styles.roomImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.roomName}>Modern Family House</Text>
              <Text style={styles.roomDetails}>2 Bed, 1 Bath, 1 Kitchen</Text>
              <Text style={styles.roomPrice}>Rs. 15,000 / month</Text>
            </View>
          </View>

        
          <View style={styles.bookingItem}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
              }} 
              style={styles.roomImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.roomName}>Cozy Apartment</Text>
              <Text style={styles.roomDetails}>1 Bed, 1 Bath, 1 Kitchen</Text>
              <Text style={styles.roomPrice}>Rs. 12,000 / month</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  location: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: '#578FCA',
    borderRadius: 5,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bookingItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  roomImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  bookingDetails: {
    marginLeft: 12,
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
  },
  roomDetails: {
    fontSize: 14,
    color: '#777',
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#578FCA',
    marginTop: 4,
  },
});
