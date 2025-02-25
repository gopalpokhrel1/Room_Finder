import { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookMarkScreen from '../screens/BookMarkScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MapScreen from '../screens/MapScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeOwnerScreen from '../screens/HomeOwnerScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children,onPress}) => (
  <TouchableOpacity
    style={styles.fabContainer}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <View style={styles.fabButton}>{children}</View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        setRole("homeOwner");
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 45,
          position: 'absolute',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
        },
        tabBarLabel: '',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#578FCA',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="search" size={30} color={color} />
          ),
        }}
      />

      {role === 'homeOwner' && (
        <Tab.Screen
          name="Add"
          component={HomeOwnerScreen}
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <CustomTabBarButton {...props}>
                <Icon name="add" size={30} color="#ffffff" />
              </CustomTabBarButton>
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="map" size={30} color={color} />
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
    shadowOffset: { width: 0, height: 5 },
  },
});

export default TabNavigator;
