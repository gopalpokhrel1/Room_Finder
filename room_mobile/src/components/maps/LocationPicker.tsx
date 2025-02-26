import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const LocationPicker = ({onLocationSelect}: any) => {
  const [location, setLocation] = useState({
    latitude: 27.670593,
    longitude: 85.421726,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleMarkerDrag = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setLocation({...location, latitude, longitude});
  };

  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect(location.latitude, location.longitude);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={location}>
        <Marker
          draggable
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          onDragEnd={handleMarkerDrag}
        />
      </MapView>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400, 
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: '20%',
    right: '20%',
    backgroundColor: '#0077b6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
