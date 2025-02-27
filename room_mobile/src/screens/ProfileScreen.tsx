import React from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  Image, 
  StyleSheet 
} from 'react-native';

const UserProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwYm95fGVufDB8fDB8fHww',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        <Text style={styles.location}>Kathmandu, Nepal</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,  // Occupy full screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%', // Ensures it spans the whole screen
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: '#777',
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: '#777',
  },
});
