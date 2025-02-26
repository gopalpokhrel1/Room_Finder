import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {recommendData} from '../constants/TestData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMaterail from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState} from 'react';

const DetailsScreen = ({route}) => {
  const {id} = route.params;
  const data = recommendData.find(item => item.id === id);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const toggleModal = imageUrl => {
    setSelectedImage(imageUrl);
    setModalVisible(!isModalVisible);
  };

  // Repeating the main image 5 times for extra images
  const extraImages = Array(5).fill(data?.photo);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Image source={{uri: data?.photo}} style={styles.image} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{width:"93%", marginHorizontal:'auto'}}>
          {extraImages.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => toggleModal(image)}>
              <Image source={{uri: image}} style={styles.extraImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.container}>
          <View style={styles.detailsTop}>
            <Text style={styles.name}>{data?.name}</Text>
            <Text style={styles.price}>Rs.{data?.price}</Text>
          </View>
          <View style={styles.location}>
            <Icon name="location-on" size={18} />
            <Text>{data?.location}</Text>
          </View>
          <View style={styles.available}>
            <View style={styles.cardLocation}>
              <Icon name="bed" size={15} color="gray" />
              <Text style={styles.availableName}>2 Bed Room</Text>
            </View>
            <View style={styles.cardLocation}>
              <Icon name="kitchen" size={15} color="gray" />
              <Text style={styles.availableName}>1 Kitchen</Text>
            </View>
            <View style={styles.cardLocation}>
              <Icon name="crop-square" size={15} color="gray" />
              <Text style={styles.availableName}>300 sq ft</Text>
            </View>
          </View>

          <Text style={styles.description}>{data?.description}</Text>
        </View>

        <View style={styles.facilityContainer}>
          <View style={styles.facility}>
            <Icon name="wifi" size={24} color="#4CAF50" />
            <Text style={styles.facilityText}>Wifi</Text>
          </View>
          <View style={styles.facility}>
            <IconMaterail name="cctv" size={24} color="#FFEB3B" />
            <Text style={styles.facilityText}>CCTV</Text>
          </View>
          <View style={styles.facility}>
            <Icon name="water-drop" size={24} color="#2196F3" />
            <Text style={styles.facilityText}>Water</Text>
          </View>
        </View>

        {/* Book Now Button */}
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Image Preview */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Image source={{uri: selectedImage}} style={styles.modalImage} />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 18,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    marginBottom: 18,
  },
  extraImagesHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  extraImage: {
    width: 100,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  detailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  price: {
    fontSize: 20,
    color: '#FF5733',
    fontWeight: '500',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  available: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  availableName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'justify',
    marginTop: 12,
    color: '#333',
  },
  facilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 24,
    paddingHorizontal: 18,
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f4f4f4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  facilityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  bookNowButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 14,
    marginHorizontal: 18,
    borderRadius: 10,
    marginBottom: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 350,
    height: 500,
    borderRadius: 10,
    resizeMode: 'contain',
  },
});
