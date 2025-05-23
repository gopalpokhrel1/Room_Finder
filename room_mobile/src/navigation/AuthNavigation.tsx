import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import NearestMapScreen from '../screens/NearestMapScreen';
import OwnerDetailsScreen from '../screens/OwnerDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import BookedScreen from '../screens/BookedScreen';
import PendingScreen from '../screens/PendingScreen';
import HomeOwnerScreen from '../screens/HomeOwnerScreen';
const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Add"
        component={HomeOwnerScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NearestMap"
        component={NearestMapScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OwnerDetails"
        component={OwnerDetailsScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Booked"
        component={BookedScreen}
      />
       <Stack.Screen
        name="Pending"
        component={PendingScreen}

      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
