import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = ({navigation}) => {
  const [user, setUser] = useState([]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');

      navigation &&
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert(
        'Logout Failed',
        'There was a problem logging out. Please try again.',
      );
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  console.log(user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FF5757" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCXtZCNJMCJq99TsMGpPE4jLvjrPcqsmLgpQ&s',
              }}
              style={styles?.profileImage}
            />
          </View>

          <Text style={styles.username}>{user?.user?.full_name}</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#555" />
            <Text style={styles.infoText}>{user?.user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#555" />
            <Text style={styles.infoText}>{user?.user?.address}</Text>
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
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#FF5757',
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A80F0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555555',
    marginLeft: 10,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
});
