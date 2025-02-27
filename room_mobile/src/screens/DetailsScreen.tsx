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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({route}) => {
  const {id} = route.params;
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [index, setIndex]= useState(0);

  console.log(id)

  useEffect(() => {
    const fetchUserAndRoom = async () => {
      try {
        setLoading(true);
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);

        if (storedUser?.accessToken) {
          const response = await fetch(
            `https://backend-roomfinder-api.onrender.com/rooms/get-room-details/${id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${storedUser.accessToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const roomData = await response.json();
          console.log('Room details:', roomData);
          setData(roomData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRoom();
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#578FCA" />
          <Text>Loading room details...</Text>
        </View>
      ) : (
        <ScrollView>
          {data?.room_image_url && (
            <>
              <Image
                source={{uri: data?.room_image_url[index]}}
                style={styles.image}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{width: '93%', marginHorizontal: 'auto'}}>
                {data?.room_image_url?.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setIndex(index)}>
                    <Image source={{uri: image}} style={styles.extraImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <View style={styles.container}>
            <View style={styles.detailsTop}>
              <Text style={styles.name}>{data?.title}</Text>
              <Text style={styles.price}>Rs.{data?.price}</Text>
            </View>

            <View style={styles.address}>
              <Icon name="location-on" size={18} />
              <Text>{data?.address}</Text>
            </View>

            <View style={styles.available}>
              <View style={styles.cardLocation}>
                <Icon name="bed" size={15} color="gray" />
                <Text style={styles.availableName}>
                  Type: {data?.room_type}
                </Text>
              </View>
              <View style={styles.cardLocation}>
                <Icon name="kitchen" size={15} color="gray" />
                <Text style={styles.availableName}>
                  Status: {data?.room_status}
                </Text>
              </View>
              <View style={styles.cardLocation}>
                <Icon name="crop-square" size={15} color="gray" />
                <Text style={styles.availableName}>
                  Room: {data?.no_of_room}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{data?.description}</Text>
          </View>

          <ScrollView horizontal={true} style={styles.facilityContainer}>
            <View style={styles.facility}>
              <Icon name="wifi" size={24} color="#4CAF50" />
              <Text style={styles.facilityText}>
                {data?.wifi ? 'Available' : 'Not Available'}
              </Text>
            </View>
            <View style={styles.facility}>
              <IconMaterial
                name="lightbulb-on-outline"
                size={24}
                color="#FFEB3B"
              />
              <Text style={styles.facilityText}>
                {data?.electricity ? 'Available' : 'Not Available'}
              </Text>
            </View>
            <View style={styles.facility}>
              <Icon name="water-drop" size={24} color="#2196F3" />
              <Text style={styles.facilityText}>
                {data?.water ? 'Available' : 'Not Available'}
              </Text>
            </View>
            <View style={styles.facility}>
              <Icon name="directions-car" size={24} color="#2196F3" />
              <Text style={styles.facilityText}>
                {data?.parking ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </ScrollView>

          {/* Book Now Button */}
          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  address: {
    flexDirection: 'row',
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
    marginTop: 12,

    marginBottom: 24,
    paddingHorizontal: 18,
  },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginRight: 4,
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
