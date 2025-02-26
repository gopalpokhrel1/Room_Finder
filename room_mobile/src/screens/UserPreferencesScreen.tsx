import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';

const UserPreferencesScreen = () => {
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('500');
  const [maxPrice, setMaxPrice] = useState('5000');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set Your Room Preferences</Text>

      {/* Description Input Box */}
      <Text style={styles.label}>Room/Flat Description:</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter room type or any specific preferences"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Min Price Input Box */}
      <Text style={styles.label}>Minimum Price (per month):</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.priceInput}
          placeholder="Enter minimum price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
      </View>

      {/* Max Price Input Box */}
      <Text style={styles.label}>Maximum Price (per month):</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.priceInput}
          placeholder="Enter maximum price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />
      </View>

      {/* Save Preferences Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Preferences Saved')}>
        <Text style={styles.buttonText}>Save Preferences</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserPreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  inputBox: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  input: {
    height: 80,
    borderColor: '#ddd',
    borderWidth: 0,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  priceInput: {
    height: 40,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
