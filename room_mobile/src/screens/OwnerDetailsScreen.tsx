import React, {useState, useEffect } from 'react';
import { 
  View, Text, Image, ScrollView, TouchableOpacity, 
  Alert, StyleSheet, Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OwnerDetailsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const {id} = route.params;

  console.log(id);

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

    fetchUser();
  }, []);

  useEffect(()=>{
        const fetchRoom = async()=>{
          try{
            const res = await fetch(`https://backend-roomfinder-api.onrender.com/rooms/get-room-details/${id}`,
              {
                method:"GET",
                headers:{
                  Authorization: `Bearer ${user?.accessToken}`
                }
              }
            )
            const data = await res.json();
            console.log(data);
            setRoom(data.data);
          }
          catch{}
          finally{}
        }

        fetchRoom()
  }, [user])


  // Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this room?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => {
            Alert.alert("Deleted!", "room has been removed.");
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Images */}
      <ScrollView horizontal pagingEnabled>
        {room?.room_image_url.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={{padding:12, backgroundColor:"green", alignSelf:"flex-start",}}>
        <Text>{room?.room_status === "available" ? "Available": "Booked"}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{room?.title}</Text>
        <Text style={styles.price}>Rs. {room?.price}/month</Text>
        <Text style={styles.description}>{room?.description}</Text>

        <Text style={styles.info}><Icon name="location-on" size={18} /> {room?.address}</Text>
        <Text style={styles.info}><Icon name="category" size={18} /> {room?.room_type}</Text>
        <Text style={styles.info}><Icon name="aspect-ratio" size={18} /> {room?.areaSize}</Text>
        <Text style={styles.info}><Icon name="meeting-room" size={18} /> {room?.no_of_room} Room(s)</Text>
        <Text style={styles.info}><Icon name="wifi" size={18} /> WiFi: {room?.wifi ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="local-parking" size={18} /> Parking: {room?.parking ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="local-drink" size={18} /> Water: {room?.water ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="bolt" size={18} /> Electricity: {room?.electricity ? "Available" : "Not Available"}</Text>
        <Text style={styles.info}><Icon name="restore-from-trash" size={18} /> Disposal Charge: {room?.disposal_charge
 ? "Available" : "Not Available"}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal:20,
  },

  image: {
    width: 350,
    height: 250,
    borderRadius: 15,
    marginRight:8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  detailsContainer: {

    borderRadius: 12,
    marginVertical:12,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#578FCA',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#d9534f',
    borderRadius: 10,
    elevation: 3,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default OwnerDetailsScreen;