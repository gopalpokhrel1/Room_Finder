import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Circle,
} from 'react-native-maps';

const CustomMarker = () => {
  return (
    <Image
      source={{uri: 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png'}}
      style={{width: 20, height: 20}}
    />
  );
};




const MapScreen = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires location access to function properly.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          ('Location permission granted');
          setPermissionGranted(true); // Update state
        } else {
          ('Location permission denied');
          setPermissionGranted(false);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    getLocationPermission();
  }, []);

  if (!permissionGranted) {
    return (
      <>
        <Text>Please give the location permission for the user</Text>
      </>
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 27.670593,
          longitude: 85.421726,
          latitudeDelta: 0.055,
          longitudeDelta: 0.055,
        }}>
        {/* {locations.map((item, index) => {
          return (
            <Marker
              draggable
              key={index}
              coordinate={item.coordinate}
              title={item.title}
              onDragEnd={(e)=> ({x: e.nativeEvent.coordinate })}
              ></Marker>
          );
        })} */}

        {/* <Circle
          center={{
            latitude: 27.670593,
            longitude: 85.421726,
          }}
          radius={500}
          strokeColor="gray"
          fillColor="yellow"
        /> */}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calloutText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});
