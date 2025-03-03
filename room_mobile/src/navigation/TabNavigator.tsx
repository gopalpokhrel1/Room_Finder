import {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeOwnerScreen from '../screens/HomeOwnerScreen';
import OwnerScreen from '../screens/OwnerScreen';
import BookingRequestScreen from '../screens/BookingRequestScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={styles.fabContainer}
    activeOpacity={0.8}
    onPress={onPress}>
    <View style={styles.fabButton}>{children}</View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add Loading State

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false); // ✅ Stop loading once the data is fetched
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      // ✅ Show loading indicator until user is fetched
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#578FCA" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 50,
          position: 'absolute',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 5},
        },
        tabBarLabel: '',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#578FCA',
        tabBarInactiveTintColor: 'gray',
      }}>
      {user?.user.role === 'homeOwner' && (
        <Tab.Screen
          name="Home"
          component={OwnerScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Icon name="home" size={30} color={color} />
            ),
          }}
        />
      )}

      {user?.user.role === 'renter' && (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({color}) => (
                <Icon name="home" size={30} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({color}) => (
                <Icon name="search" size={30} color={color} />
              ),
            }}
          />
        </>
      )}

      {/* {user?.user.role === 'homeOwner' && (
        <Tab.Screen
          name="Add"
          component={HomeOwnerScreen}
          options={{
            headerShown: false,
            tabBarButton: props => (
              <CustomTabBarButton {...props}>
                <Icon name="add" size={30} color="#ffffff" />
              </CustomTabBarButton>
            ),
          }}
        />
      )} */}
      {user?.user.role === 'homeOwner' && (
        <Tab.Screen
          name="Booking"
          component={BookingRequestScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => (
                <Icon name="arrow-circle-up" size={30} color={color} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Icon name="person" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#578FCA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 5},
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default TabNavigator;
