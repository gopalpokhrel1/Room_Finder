import React, {useState} from 'react';
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

const HomeOwnerScreen = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    areaSize: '',
    availableFrom: '',
    room_status: 'available',
    facilities: {
      wifi: false,
      parking: false,
      airConditioning: false,
      gym: false,
    },
    room_image_url: [],
    location: {
      type: 'Point',
      coordinates: [27.716842, 85.321386],
    },
  });

  const [errors, setErrors] = useState({});

  const validateBasicInfo = () => {
    let newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim())
      newErrors.description = 'Description is required';
    if (!form.price || isNaN(form.price) || form.price <= 0)
      newErrors.price = 'Valid price is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.areaSize.trim()) newErrors.areaSize = 'Area size is required';
    if (!form.availableFrom.trim())
      newErrors.availableFrom = 'Available from date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImages = () => {
    let newErrors = {};
    if (form.room_image_url.length === 0)
      newErrors.room_image_url = 'At least one image is required';
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
    if (form.room_image_url.length < 5) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
        },
        response => {
          if (response.assets) {
            const newImage = response.assets[0].uri;
            setForm({
              ...form,
              room_image_url: [...form.room_image_url, newImage],
            });
          }
        },
      );
    } else {
      Alert.alert('Max Limit', 'You can only upload up to 5 images.');
    }
  };

  const handleLocationSelect = (latitude:any, longitude:any) => {
    setForm({...form, location:{type: 'Point', coordinates: [latitude, longitude]}});
    setStep(3); // Go to next step after location selection
  };

  const handleSubmit = () => {
    console.log(form);
    // if (validateImages()) {
    //   Alert.alert('Success', 'Room listed successfully!');
    //   console.log('Form Data:', form);
    // }
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

          <Text style={styles.label}>Available From</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter available from date"
            value={form.availableFrom}
            onChangeText={text => handleChange('availableFrom', text)}
          />
          {errors.availableFrom && (
            <Text style={styles.error}>{errors.availableFrom}</Text>
          )}

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
          <LocationPicker onLocationSelect={handleLocationSelect} />

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
            {form.room_image_url.map((img, index) => (
              <Image key={index} source={{uri: img}} style={styles.image} />
            ))}
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageSelect}>
            <Text style={styles.uploadText}>+ Upload Image</Text>
          </TouchableOpacity>
          {errors.room_image_url && (
            <Text style={styles.error}>{errors.room_image_url}</Text>
          )}

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(3)}>
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>
            <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#F8F9FA', flex: 1},
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
