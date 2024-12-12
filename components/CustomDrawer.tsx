import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Para usar la navegación
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage


const CustomDrawer = ({  }) => {
    const navigation=useNavigation();
  const handleLogout = async () => {
    // Función para cerrar sesión
    await AsyncStorage.removeItem('userData'); // Elimina datos de AsyncStorage
    navigation.navigate("login"); // Navega a la pantalla de login
    alert('Sesión cerrada');
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Aquí puedes agregar otros elementos de tu drawer */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="sign-out" size={24} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#343a40',
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e74c3c',
    marginTop: 20,
    borderRadius: 10,
    width: '100%', // Asegura que ocupe el 100% de su contenedor
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CustomDrawer;
