import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!phone.trim()) newErrors.phone = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // if (validateForm()) {
    //   try {
    //     const response = await fetch("https://backend-roomfinder-api.onrender.com/users/login", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         phone,
    //         password,
    //       }),
    //     });
  
    //     const data = await response.json();
    //     console.log(data);
  
    //     if (response.ok) {
    //       AsyncStorage.setItem("role", data.user.role);  // If you still need role in AsyncStorage, keep it
          
    //     } else {
    //       Alert.alert('Error', data.message || 'Invalid credentials');
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     Alert.alert('Error', 'Something went wrong. Please try again.');
    //   }
    // } else {
    //   Alert.alert('Error', 'Please fill all fields correctly.');
    // }

    navigation.navigate('Main');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#888"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon
                name={passwordVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color="#888"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.rememberForgotContainer}>
            <View style={styles.rememberMeContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                tintColors={{ true: '#578FCA', false: '#ccc' }}
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Not registered yet?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Go to Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 10,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#578FCA',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#578FCA',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLink: {
    fontSize: 16,
    color: '#578FCA',
    fontWeight: 'bold',
  },
});
