import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(false);
  const [data, setData] = useState();

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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          isSearching
            ? `https://backend-roomfinder-api.onrender.com/rooms/search/${searchQuery}`
            : 'https://backend-roomfinder-api.onrender.com/rooms/getrooms',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        data;
        setData(data.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    if (user) {
      fetchRoom();
    }
  }, [user, isSearching]);

  const inputAnimValue = new Animated.Value(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    setTimeout(() => {
      if (query.length > 0) {
        const filtered = data?.filter(
          item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.address.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        );
        setFilteredData(filtered);
      } else {
        setFilteredData([]);
      }
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    const focusAnimation = () => {
      Animated.timing(inputAnimValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    focusAnimation();
  }, []);

  const inputBorderColor = inputAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#4a80f5'],
  });

  const renderRoomItem = ({item}) => (
    <TouchableOpacity
      style={styles.listingItem}
      onPress={() => navigation.navigate('Details', {id: item.r_id})}>
      <View style={styles.listingImageContainer}>
        <View style={styles.listingImagePlaceholder}>
          <Image
            source={{uri: item.room_image_url[0]}}
            style={{width: 100, height: 100}}
          />
        </View>
      </View>

      <View style={styles.listingDetails}>
        <Text style={styles.listingTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.listingLocation}>{item.address}</Text>

        <View style={styles.listingFooter}>
          <Text style={styles.listingPrice}>{item.price}</Text>
          <View
            style={[
              styles.availabilityBadge,
              {
                backgroundColor:
                  item.available === 'available' ? '#e6f7ee' : '#ffe6e6',
              },
            ]}>
            <Text
              style={[
                styles.availabilityText,
                {
                  color:
                    item.room_status === 'available' ? '#0c8a42' : '#db3030',
                },
              ]}>
              {item.room_status === 'available' ? 'Available' : 'Taken'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Place</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Animated.View
          style={[styles.inputWrapper, {borderColor: inputBorderColor}]}>
          <TextInput
            style={styles.input}
            placeholder="Search rooms,flats ...."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={Keyboard.dismiss}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      {isSearching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4a80f5" />
        </View>
      )}

      {/* Search Results */}
      <FlatList
        data={searchQuery?.length > 0 ? filteredData : data}
        keyExtractor={item => item.id}
        renderItem={renderRoomItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          searchQuery?.length > 0 ? (
            <Text style={styles.resultsHeader}>
              {filteredData?.length}{' '}
              {filteredData?.length === 1 ? 'result' : 'results'} found
            </Text>
          ) : (
            <Text style={styles.resultsHeader}>All Available Listings</Text>
          )
        }
        ListEmptyComponent={
          searchQuery?.length > 0 && !isSearching ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResults}>
                No rooms or flats found matching "{searchQuery}"
              </Text>
              <Text style={styles.noResultsSuggestion}>
                Try searching for room name, room address or different keywords
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f7fa',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultsHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  listingItem: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  listingImageContainer: {
    width: 100,
    height: 100,
  },
  listingImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#dde5f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingImagePlaceholderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a80f5',
  },
  listingDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a80f5',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  noResultsSuggestion: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default SearchScreen;
