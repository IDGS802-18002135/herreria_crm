import Sidebar from '@/components/SideBar';

import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const getUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('userData');
      console.log(storedUserData)
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    };

    getUserData();
  }, []);

  return (
    <View style={styles.wrapper}>
      {userData ? (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Nombre: {userData.nombre}</Text>
          <Text style={styles.userInfoText}>Rol: {userData.rol}</Text>
          <Text style={styles.userInfoText}>Estatus: {userData.estatus === 1 ? 'Activo' : 'Inactivo'}</Text>
          <Text style={styles.userInfoText}>Dirección: {userData.direccion}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default WelcomeScreen;

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
  welcomeText: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
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
