import {StyleSheet} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './src/navigation/AuthNavigation';
const App = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
