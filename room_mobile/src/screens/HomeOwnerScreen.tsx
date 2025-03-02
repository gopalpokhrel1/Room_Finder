import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Button,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import LocationPicker from '../components/maps/LocationPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

const HomeOwnerScreen = () => {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = React.useState([]);


  const getUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      return user;
    } catch (error) {}
  };
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await getUser();
      setUser(storedUser);
    };

    fetchUser();
  }, []);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    areaSize: '',
    no_of_room: 1,
    room_type: '',
    room_status: 'pending',
    facilities: {
      wifi: false,
      parking: false,
      disposal_charge: false,
      electricity: false,
      water: false,
    },
    files: [],
    location: {
      type: 'Point',
      coordinates: [27.716842, 85.321386],
    },
  });

  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);

  const validateBasicInfo = () => {
    let newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim())
      newErrors.description = 'Description is required';
    if (!form.price || isNaN(form.price) || form.price <= 0)
      newErrors.price = 'Valid price is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.areaSize.trim()) newErrors.areaSize = 'Area size is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImages = () => {
    let newErrors = {};
    if (form.files.length === 0)
      newErrors.files = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm({...form, [field]: value});
  };

  const toggleFacility = facility => {
    setForm({
      ...form,
      facilities: {...form.facilities, [facility]: !form.facilities[facility]},
    });
  };


  const handleImageSelect = () => {
    if (form.files.length < 5) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
        },
        response => {
          console.log(response)
          if (response.assets) {
            
            const newImage = response.assets[0].uri;
            setForm({
              ...form,
              files: [...form.files, newImage],
            });
          }
        },
      );
    } else {
      Alert.alert('Max Limit', 'You can only upload up to 5 images.');
    }
  };

  const handleLocationSelect = (latitude: any, longitude: any) => {
    setForm({
      ...form,
      location: {type: 'Point', coordinates: [latitude, longitude]},
    });
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    const accessToken = user?.accessToken;

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('room_type', form.room_type);
    formData.append('price', form.price);
    formData.append('latitude', form.location.coordinates[0]);
    formData.append('longitude', form.location.coordinates[1]);
    formData.append('address', form.address);
    formData.append('areaSize', form.areaSize);
    formData.append('room_status', 'available');
    formData.append('no_of_room', form.no_of_room);


    // Append files to FormData
    if (form.files.length > 0) {
      form.files.forEach((fileUri, index) => {
        formData.append('files', {
          uri:fileUri,
          name:`photo${index}.jpg`,
          type: 'image/jpg',
        }
        );
      });
    } else {
    }

    // Append facility boolean values
    Object.keys(form.facilities).forEach(key => {
      formData.append(key, form.facilities[key]);
    });

    console.log(formData);
    try {
      setLoading(true);

      const response = await fetch(
        'https://backend-roomfinder-api.onrender.com/rooms/createroom',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',

            Authorization: `Bearer ${accessToken}`,
          },
          body: formData, 
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Room listed successfully!');
        console.log('API Response:', data);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to list the room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, step === 1 && styles.activeTab]}
          onPress={() => setStep(1)}>
          <Text style={[styles.tabText, step === 1 && styles.activeTabText]}>
            Basic Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 2 && styles.activeTab]}
          onPress={() => setStep(2)}>
          <Text style={[styles.tabText, step === 2 && styles.activeTabText]}>
            Facilities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 3 && styles.activeTab]}
          onPress={() => setStep(3)}>
          <Text style={[styles.tabText, step === 3 && styles.activeTabText]}>
            Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, step === 4 && styles.activeTab]}
          onPress={() => setStep(4)}>
          <Text style={[styles.tabText, step === 4 && styles.activeTabText]}>
            Room Images
          </Text>
        </TouchableOpacity>
      </View>

      {step === 1 && (
        <>
          <Text style={styles.sectionTitle}>🏡 Basic Info</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={form.title}
            onChangeText={text => handleChange('title', text)}
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, {height: 80}]}
            placeholder="Enter description"
            multiline
            value={form.description}
            onChangeText={text => handleChange('description', text)}
          />
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            keyboardType="numeric"
            value={form.price}
            onChangeText={text => handleChange('price', text)}
          />
          {errors.price && <Text style={styles.error}>{errors.price}</Text>}

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={form.address}
            onChangeText={text => handleChange('address', text)}
          />
          {errors.address && <Text style={styles.error}>{errors.address}</Text>}

          <Text style={styles.label}>Area Size</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area size"
            value={form.areaSize}
            onChangeText={text => handleChange('areaSize', text)}
          />
          {errors.areaSize && (
            <Text style={styles.error}>{errors.areaSize}</Text>
          )}

          {/* Room Type Dropdown */}
          <Text style={styles.label}>Room Type</Text>
          <Picker
            selectedValue={form.room_type}
            style={styles.input}
            onValueChange={value => handleChange('room_type', value)}>
            <Picker.Item label="Select Room Type" value="" />
            <Picker.Item label="Room" value="room" />
            <Picker.Item label="Flat" value="flat" />
          </Picker>
          {errors.room_type && (
            <Text style={styles.error}>{errors.room_type}</Text>
          )}
          {errors.room_type && (
            <Text style={styles.error}>{errors.room_type}</Text>
          )}

          {/* Number of Rooms (Only visible if "Flat" is selected) */}

          <>
            <Text style={styles.label}>Number of Rooms</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of rooms"
              keyboardType="numeric"
              value={form.no_of_room.toString()}
              onChangeText={text => handleChange('no_of_room', Number(text))}
            />
            {errors.no_of_room && (
              <Text style={styles.error}>{errors.no_of_room}</Text>
            )}
          </>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => validateBasicInfo() && setStep(2)}>
            <Text style={styles.nextText}>Next ➡️</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.sectionTitle}>🏢 Facilities</Text>
          <View style={styles.switchContainer}>
            {Object.keys(form.facilities).map(key => (
              <View key={key} style={styles.switchItem}>
                <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Switch
                  value={form.facilities[key]}
                  onValueChange={() => toggleFacility(key)}
                />
              </View>
            ))}
          </View>

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(1)}>
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setStep(3)}>
              <Text style={styles.nextText}>Next ➡️</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.sectionTitle}>📍 Select Location</Text>
          <LocationPicker setShowMap={setShowMap} onLocationSelect={handleLocationSelect} />

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(2)}>
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setStep(4)}>
              <Text style={styles.nextText}>Next ➡️</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.sectionTitle}>🖼️ Room Images</Text>
          <View style={styles.imageContainer}>
            {form.files.map((img, index) => (
              <Image key={index} source={{uri: img}} style={styles.image} />
            ))}
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageSelect}>
            <Text style={styles.uploadText}>+ Upload Image</Text>
          </TouchableOpacity>
          {errors.files && <Text style={styles.error}>{errors.files}</Text>}

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(3)}>
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>
            <Button
              title={loading ? 'submitting..' : 'Submit'}
              onPress={handleSubmit}
              color="#007BFF"
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 16,paddingVertical:48, backgroundColor: '#F8F9FA', flex: 1},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {padding: 10, borderRadius: 5, backgroundColor: '#ddd'},
  activeTab: {backgroundColor: '#007BFF'},
  tabText: {fontWeight: 'bold'},
  activeTabText: {color: 'white'},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  label: {fontSize: 14, fontWeight: 'bold', marginBottom: 5},
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  error: {color: 'red', fontSize: 12, marginBottom: 10},
  switchContainer: {marginTop: 10},
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  imageContainer: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 10},
  image: {width: 80, height: 80, borderRadius: 8, marginRight: 5},
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  uploadText: {color: 'white', fontWeight: 'bold'},
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  nextText: {color: 'white', fontWeight: 'bold'},
  backButton: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  backText: {color: '#007BFF', fontWeight: 'bold'},
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default HomeOwnerScreen;
