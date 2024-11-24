import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const Menu = () => {
  const navigation = useNavigation();

  const cardsData = [
    {
      icon: 'user-alt',
      title: 'Dashboard',
      screen: 'dashboard',
    },
    {
      icon: 'user-alt',
      title: 'Planificación',
      screen: 'planificacion',
    },
    {
      icon: 'user-alt',
      title: 'Customer',
      screen: 'customer',
    },
    {
      icon: 'user-alt',
      title: 'Registrar Empresa',
      screen: 'RegistrarClienteEmpresa',
    },
    {
      icon: 'user-alt',
      title: 'Registro Cliente',
      screen: 'Registros',
    },
    {
        icon: 'user-alt',
        title: 'Lista de precios y ventas',
        screen: 'priceListScreen',
      },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {cardsData.map((card, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(card.screen)}>
            <View style={styles.cardContent}>
              <FontAwesome5 name={card.icon} size={24} color="#333" />
              <Text style={styles.cardText}>{card.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    width: '45%', // Adjust width as needed
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Menu;