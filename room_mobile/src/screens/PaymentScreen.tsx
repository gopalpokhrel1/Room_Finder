import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
import KhaltiSdk from 'react-native-khalti-sdk';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [productName, setProductName] = useState('Sample Product');
  const [productId, setProductId] = useState('12345');
  const [productUrl, setProductUrl] = useState('https://example.com/product-image.jpg');
  const [additionalData, setAdditionalData] = useState({});

  const handlePayment = async () => {
    try {
      const result = await KhaltiSdk.startKhaltiSdk(
        'your-merchant-key', 
        productName,
        productId,
        productUrl,
        amount,
        additionalData,
        'KhaltiPayExampleScheme'
      );
      console.log({ result });
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Make Payment</Text>
      </View>

      <View style={styles.productContainer}>
        <Image source={{ uri: productUrl }} style={styles.productImage} />
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productPrice}>Rs. {amount}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter Amount:</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter Amount"
        />
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure and Fast Payment via Khalti</Text>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
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
  productContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 15,
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    color: '#FF5733',
    fontWeight: '500',
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  amountInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#333',
  },
  paymentButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
});
