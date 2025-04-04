import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const UserPreferences = () => {
  const [user, setUser] = useState();
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('4000');
  const [maxPrice, setMaxPrice] = useState('6000');
  const [wifi, setWifi] = useState(true);
  const [electricity, setElectricity] = useState(false);
  const [parking, setParking] = useState(true);
  const [water, setWater] = useState(true);
  const [disposalCharge, setDisposalCharge] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const checkFirstLogin = async () => {
      const firstLogin = await AsyncStorage.getItem('firstLogin');
      if (!firstLogin) {
        setIsFirstLogin(true);
      }
    };

    fetchUser();
    checkFirstLogin();
  }, []);

  const handleSubmit = async () => {
    const requestBody = {
      preference_text: description,
      min_price: Number(minPrice),
      max_price: Number(maxPrice),
      wifi,
      electricity,
      parking,
      water,
      disposal_charge: disposalCharge,
    };

    try {
      setLoading(true);
      const response = await fetch(
        'api-end-point/recommend/set-preferences',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      const result = await response.json();
      result;
      if (response.ok) {
        Alert.alert('Preferences saved successfully!');
        AsyncStorage.setItem('firstLogin', 'saved');
        navigation.replace('Main');
      } else {
        Alert.alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set Your Room Preferences</Text>

      <Text style={styles.label}>Room/Flat Description:</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter room type or specific preferences"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <Text style={styles.label}>Minimum Price (per month):</Text>
      <TextInput
        style={styles.priceInput}
        placeholder="Enter minimum price"
        value={minPrice}
        onChangeText={setMinPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Maximum Price (per month):</Text>
      <TextInput
        style={styles.priceInput}
        placeholder="Enter maximum price"
        value={maxPrice}
        onChangeText={setMaxPrice}
        keyboardType="numeric"
      />

      {/* Switches for Amenities */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>WiFi</Text>
        <Switch value={wifi} onValueChange={setWifi} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Electricity</Text>
        <Switch value={electricity} onValueChange={setElectricity} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Parking</Text>
        <Switch value={parking} onValueChange={setParking} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Water</Text>
        <Switch value={water} onValueChange={setWater} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Disposal Charge</Text>
        <Switch value={disposalCharge} onValueChange={setDisposalCharge} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>

      <Modal visible={isFirstLogin} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Welcome!</Text>
            <Text style={styles.modalText}>
              Set your room preferences to get the best matches.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsFirstLogin(false)}>
              <Text style={styles.modalButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserPreferences;

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
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#578FCA',
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
  /* Modal Styling */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  modalButton: {
    backgroundColor: '#578FCA',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
