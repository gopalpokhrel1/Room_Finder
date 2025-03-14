import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingRequestsScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const storedUser = userString ? JSON.parse(userString) : null;
      setUser(storedUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data. Please restart the app.');
    }
  };

  const fetchBookingRequests = async () => {
    if (!user?.accessToken) {
      setError('You need to be logged in to view booking requests');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://backend-roomfinder-api.onrender.com/bookings/get-booking-requests',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setRequests(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch booking requests');
      }
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      setError('Failed to load booking requests. Pull down to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const acceptBooking = async (id: any) => {
    try {
      const response = await fetch(
        `https://backend-roomfinder-api.onrender.com/bookings/accept-booking`,
        {
          method: 'POST',
          body: JSON.stringify({booking_id: id}),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
      if (response.ok) {
        Alert.alert('Accepted booking');
      }
    } catch (error: any) {
      Alert.alert('Failed to accept booking');
    }
  };

  const deleteRequest = id => {
    console.log(id);
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this booking request?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(
                `https://backend-roomfinder-api.onrender.com/bookings/delete-booking`,
                {
                  method: 'DELETE',
                  body: JSON.stringify({booking_id: id}),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.accessToken}`,
                  },
                },
              );

              setRequests(prevRequests =>
                prevRequests.filter(request => request.booking_id !== id),
              );

              Alert.alert('Success', 'Request deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the request');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const formatDate = dateString => {
    if (!dateString) return 'Unknown date';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeStyle = status => {
    switch (status) {
      case 'approved':
        return styles.approvedBadge;
      case 'rejected':
        return styles.rejectedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  const renderBookingItem = ({item}) => {
    const bookingStatus = item.bookingInfo?.booking_status || 'pending';
    const requesterName = item.requestedBy?.full_name || 'Unknown User';
    const requesterPhone = item.requestedBy?.phone || 'Unknown';
    const roomTitle = item.roomDetails?.title || 'Unknown Room';
    const roomImage = item.roomDetails?.room_image_url?.[0] || null;
    const price = item.bookingInfo?.total_price || 0;
    const createdDate = item.bookingInfo?.createdAt;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View
            style={[styles.statusBadge, getStatusBadgeStyle(bookingStatus)]}>
            <Text style={styles.statusText}>
              {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(createdDate)}</Text>
        </View>

        <View style={styles.cardContent}>
          {/* Room image */}
          <View style={styles.imageContainer}>
            {roomImage ? (
              <Image
                source={{uri: roomImage}}
                style={styles.roomImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="home-outline" size={24} color="#aaa" />
              </View>
            )}
          </View>

          {/* Room and requester info */}
          <View style={styles.infoContainer}>
            <Text style={styles.roomTitle} numberOfLines={1}>
              {roomTitle}
            </Text>
            <Text style={styles.userName}>
              <Icon name="person" size={14} color="#555" /> {requesterName}
            </Text>
            <Text style={styles.userName}>
              <Icon name="phone" size={14} color="#555" /> {requesterPhone}
            </Text>
            <Text style={styles.priceText}>Rs. {price.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => acceptBooking(item.bookingInfo.b_id)}>
            <Icon name="add" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteRequest(item.bookingInfo.b_id)}>
            <Icon name="restore-from-trash" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#578FCA" />
        <Text style={styles.loadingText}>Loading booking requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Booking Requests</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={40} color="#E63946" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchBookingRequests}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-blank" size={60} color="#CCC" />
          <Text style={styles.emptyMessage}>
            No booking requests available.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.booking_id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#777',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingBadge: {
    backgroundColor: '#FFF3CD',
  },
  approvedBadge: {
    backgroundColor: '#D4EDDA',
  },
  rejectedBadge: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#578FCA',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#578FCA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E63946',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default BookingRequestsScreen;
