import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExploreScreen = ({navigation}) => {
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Room type options
  const roomTypes = ['All', 'room', 'flat'];
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const storedUser = userString ? JSON.parse(userString) : null;
        setUser(storedUser);
      } catch (error) {
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://backend-roomfinder-api.onrender.com/rooms/getrooms", {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          }
        });
        const responseData = await res.json();
        setData(responseData.data);
        setFilteredData(responseData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchData();
    }
  }, [user]);

  // Apply filters
  useEffect(() => {
    let result = [...data];
    
    // Apply room type filter
    if (selectedRoomType !== 'All') {
      result = result.filter(item => item.room_type === selectedRoomType);
    }
    
    // Apply availability filter
    if (selectedAvailability !== 'All') {
      const isAvailable = selectedAvailability === 'Available';
      result = result.filter(item => item.is_available === isAvailable);
    }
    
    setFilteredData(result);
  }, [selectedRoomType, selectedAvailability, data]);

  // Filter option item component
  const FilterOption = ({title, selected, onPress}) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        selected === title && styles.filterOptionSelected,
      ]}
      onPress={() => onPress(title)}
    >
      <Text
        style={[
          styles.filterOptionText,
          selected === title && styles.filterOptionTextSelected,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  console.log(data);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Perfect Space</Text>
        <Text style={styles.headerSubtitle}>Explore rooms and flats nearby</Text>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Room Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
          {roomTypes.map(type => (
            <FilterOption
              key={`type-${type}`}
              title={type}
              selected={selectedRoomType}
              onPress={setSelectedRoomType}
            />
          ))}
        </ScrollView>
    
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#578FCA" />
          <Text style={styles.loadingText}>Loading properties...</Text>
        </View>
      ) : filteredData?.length > 0 ? (
        <FlatList
          data={filteredData}
          numColumns={2}
          keyExtractor={item => item.r_id}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.propertyCard}>
              <Image source={{uri: item.room_image_url[0]}} style={styles.propertyImage} />
              {item.room_status === "available"  ? (
                <View style={styles.availabilityTag}>
                  <Text style={styles.availabilityTagText}>Available</Text>
                </View>
              ) : (
                <View style={[styles.availabilityTag, styles.bookedTag]}>
                  <Text style={styles.availabilityTagText}>Booked</Text>
                </View>
              )}
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyType}>{item.room_type || 'Room'}</Text>
                <Text style={styles.propertyName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.propertyPrice}>Rs. {item.price}/month</Text>
                <Text style={styles.propertyLocation} numberOfLines={1}>{item.address}</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Details", {id: item.r_id})} 
                  style={styles.viewButton}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No properties found</Text>
          <Text style={styles.noResultsSubtext}>Try changing your filters</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom:35,
  },
  header: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  filterOptionSelected: {
    backgroundColor: '#e6f0fa',
    borderColor: '#578FCA',
  },
  filterOptionText: {
    color: '#555',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#578FCA',
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  propertyCard: {
    flex: 1,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  availabilityTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bookedTag: {
    backgroundColor: '#FF5722',
  },
  availabilityTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  propertyInfo: {
    padding: 12,
  },
  propertyType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#578FCA',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#578FCA',
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  viewButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
});
