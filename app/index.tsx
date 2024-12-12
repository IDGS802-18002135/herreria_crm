<<<<<<< HEAD:app/index.tsx
/*import { Text, View,StyleSheet } from "react-native";
import { Link } from "expo-router";
import {Image} from 'expo-image';
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";


const PlaceholderImage =require('@/assets/images/background-image.png')

export default function Index() {
=======
import ImageViewer from '@/components/ImageViewer';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
type Props = {
  userData: {
    params: {
      userData: {
        nombre: string;
        rol: string;
        estatus: number;
        direccion: string;
      };
    };
  };
};
const Login = () => {
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const PlaceholderImage = require('@/assets/images/image.png');
>>>>>>> 7dd9d2610d1d8831b20b05494c3465f2b70bca56:app/(tabs)/index.tsx
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const navigation = useNavigation();

  // Estado para almacenar los datos del usuario después del login
  const [userData, setUserData] = useState<any>(null);

  // Función de login usando fetch
  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.16.14.126:5055/api/Usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: username,
          contrasenia: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso, almacenamos los datos del usuario
        setUserData(data);
        Alert.alert('Login Successful', `Welcome ${data.nombre}`);
        //navigation.navigate('Welcome', { userData: data });
        navigation.navigate('dashboard',{
                                        userData:data.nombre,
                                        otherParam: 'anything you want here',
                                      });
      } else {
        // Manejar errores de autenticación
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Login Failed', 'Something went wrong, please try again.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.formLogin}>Login</Text>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        <View style={styles.inputBox}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Usuario"
            placeholderTextColor="#333"
            style={styles.input}
            keyboardType="default"
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor="#333"
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.rememberForgot}>
          <View style={styles.checkboxLabel}>
            <Switch
              value={isRememberMe}
              onValueChange={setIsRememberMe}
              thumbColor={isRememberMe ? '#fff' : '#ccc'}
            />
            <Text style={styles.checkboxText}>Remember Me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        {/* Mostrar datos del usuario después del login */}
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>Nombre: {userData.nombre}</Text>
            <Text style={styles.userInfoText}>Rol: {userData.rol}</Text>
            <Text style={styles.userInfoText}>Estatus: {userData.estatus === 1 ? 'Activo' : 'Inactivo'}</Text>
            <Text style={styles.userInfoText}>Dirección: {userData.direccion}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 40,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  formLogin: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputBox: {
    marginVertical: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#333',
    borderWidth: 2,
    borderRadius: 25,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  rememberForgot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkboxLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 10,
  },
  link: {
    color: '#333',
  },
  btn: {
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
});
}*/