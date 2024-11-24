import ImageViewer from '@/components/ImageViewer';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Login = () => {
  const navigation = useNavigation();

  const cards = [
    { title: 'Dashboard', onPress: () => navigation.navigate('dashboard') },
    { title: 'Profile', onPress: () => navigation.navigate('planificacion') },
    { title: 'Settings', onPress: () => navigation.navigate('ClientesPotenciales') },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Existing Login content (Text, ImageViewer, etc.)  */}

      <View style={styles.cardContainer}>
        {cards.map((card) => (
          <Card key={card.title} title={card.title} onPress={card.onPress}>
            {/* Optional content for each card */}
          </Card>
        ))}
      </View>

      {/* Existing Login content (Input fields, buttons, etc.)  */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // Existing styles
  },
  // ... other styles
  cardContainer: {
    marginVertical: 20, // Add some margin for spacing
  },
});