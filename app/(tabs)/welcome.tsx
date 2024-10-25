import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
type Props = {
    route?: string ;
    
  };
const WelcomeScreen = ({ route,navigation }) => {
//    const { itemId, otherParam } = route.params; // Obtener los datos del usuario desde los parámetros de la navegación
    //console.log(userData);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.welcomeText}>Welcome, {}!</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>Rol: test</Text>
        <Text style={styles.userInfoText}>Estatus: test</Text>
        <Text style={styles.userInfoText}>Dirección: test</Text>
      </View>
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
