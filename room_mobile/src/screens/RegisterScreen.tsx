import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import LocationPicker from '../components/maps/LocationPicker';

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState({
    type: 'Point',
    coordinates: [27.716842, 85.321386],
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate.toISOString().split('T')[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!confirmPassword.trim())
      newErrors.confirmPassword = 'Confirm Password is required';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dob) newErrors.dob = 'Date of Birth is required';
    if (!address) newErrors.address = 'Address is required';
    if (!role) newErrors.role = 'Role is required';
    if (
      !location.coordinates[0] ||
      !location.coordinates[1] ||
      isNaN(location.coordinates[0]) ||
      isNaN(location.coordinates[1])
    )
      newErrors.location = 'Latitude and Longitude must be valid numbers';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const registrationData = {
        full_name: fullName,
        email,
        phone,
        password,
        gender,
        dob,
        address,
        role,
        location,
      };
      registrationData;

      try {
        setLoading(true);
        const response = await fetch(
          'api-end-point/users/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
          },
        );
        const result = await response.json();

        response;

        if (response.ok) {
          Alert.alert('Success', 'Registration Successful!');
          navigation.navigate('Login');
        } else {
          Alert.alert(
            'Error',
            result.message || 'Registration failed. Please try again.',
          );
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields correctly');
    }
  };

  const handleLocationSelect = (latitude, longitude) => {
    setLocation({
      type: 'Point',
      coordinates: [latitude, longitude],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {showMap ? (
        <LocationPicker
          setShowMap={setShowMap}
          onLocationSelect={handleLocationSelect}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Please fill in the details to register
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#888"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Phone */}
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#888"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* Gender Picker */}
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={itemValue => setGender(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}

            {/* Date of Birth */}
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Select your date of birth"
                  placeholderTextColor="#888"
                  editable={false}
                  value={dob}
                />
              </TouchableOpacity>
            </View>
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            {/* Address */}
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="home" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                placeholderTextColor="#888"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            {/* Role Picker */}
            <Text style={styles.label}>Role</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={itemValue => setRole(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Home Owner" value="homeOwner" />
                <Picker.Item label="User" value="renter" />
              </Picker>
            </View>
            {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

            {/* Location (Latitude and Longitude) */}
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
              style={styles.showMapButton}
              onPress={() => setShowMap(true)}>
              <Text style={styles.showMapText}>Pick location 🗺️</Text>
            </TouchableOpacity>

            {/* <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              keyboardType="numeric"
              placeholderTextColor="#888"
              value={location.coordinates[0]?.toString()}
              editable={false} 
            />

            <TextInput
              style={styles.input}
              placeholder="Longitude"
              keyboardType="numeric"
              placeholderTextColor="#888"
              value={location.coordinates[1]?.toString()}
              editable={false} 
            />
          </View> */}

            {errors.location && (
              <Text style={styles.errorText}>{errors.location}</Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}>
              <Text style={styles.registerButtonText}>
                {loading ? 'waiting..' : 'Register'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LoginButton}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.LoginButtonText}>Already have account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 18,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,

    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  LoginButton: {
    marginVertical: 4,
  },
  showMapButton: {},
  showMapText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  LoginButtonText: {
    color: '#578FCA',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
