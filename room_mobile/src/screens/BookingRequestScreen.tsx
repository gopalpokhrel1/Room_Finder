import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, Alert, StyleSheet 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = "https://backend-roomfinder-api.onrender.com/bookings/get-booking-requests";



const BookingRequestsScreen = () => {


  const [user, setUser]= useState();
  const [requests, setRequests] = useState([]);

  useEffect(()=>{
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

  },[])

  useEffect(()=>{
    const fetchBookingRequests = async () => {
      try {
  
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
  
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setRequests(data);
        } else {
          throw new Error(data.message || "Failed to fetch requests");
        }
      } catch (error) {

      } finally {

      }
    };
    fetchBookingRequests()
  },[])

  

  const deleteRequest = (id: string) => {
    Alert.alert(
      "Delete Request",
      "Are you sure you want to delete this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setRequests((prevRequests) =>
              prevRequests.filter((request) => request.id !== id)
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Requests</Text>

      {requests.length === 0 ? (
        <Text style={styles.emptyMessage}>
          No booking requests available.
        </Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.userName}>{item.user}</Text>
              <Text style={styles.roomText}>Room: {item.room}</Text>
              <Text style={styles.dateText}>Requested on: {item.date}</Text>
              <TouchableOpacity
                onPress={() => deleteRequest(item.id)}
                style={styles.deleteButton}
              >
                <Icon name="trash-can-outline" size={20} color="#FFF" />
                <Text style={styles.deleteButtonText}>Delete Request</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical:48,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  roomText: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#E63946",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6, 
  },
});

export default BookingRequestsScreen;
