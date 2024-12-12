import Sidebar from '@/components/SideBar';


import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const TEST = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigation = useNavigation();

  const cardsData = [
    {
      icon: 'tachometer-alt',  // Dashboard
      title: 'Dashboard',
      screen: 'dashboard',
    },
    {
      icon: 'calendar-alt',  // Planificación
      title: 'Planificación',
      screen: 'planificacion',
    },
    {
      icon: 'address-book',  // Customer
      title: 'Customer',
      screen: 'customer',
    },
    {
      icon: 'industry',  // Registrar Empresa
      title: 'Registrar Empresa',
      screen: 'RegistrarClienteEmpresa',
    },
    {
      icon: 'user-plus',  // Registro Cliente
      title: 'Registro Cliente',
      screen: 'Registros',
    },
    {
      icon: 'tags',  // Lista de precios y ventas
      title: 'Lista de precios y ventas',
      screen: 'priceListScreen',
    },
  ];

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
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {cardsData.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(card.screen)}
            >
              <View style={styles.cardContent}>
                <FontAwesome5 name={card.icon} size={24} color="#333" />
                <Text style={styles.cardText}>{card.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default TEST;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 40,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Para que los items se alineen arriba
    width: '100%',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '48%', // El 48% asegura que los cards se distribuyan en dos columnas
    minHeight: 120, // Ajusta la altura para que todos los cards tengan una altura mínima consistente
    justifyContent: 'center', // Asegura que el contenido esté centrado
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Permite que el texto se ajuste bien dentro del card
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flexWrap: 'wrap', // Permite que el texto se ajuste a varias líneas si es necesario
    flex: 1, // Esto permite que el texto ocupe el espacio disponible en el card
  },
});
