import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterProveedor = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const navigation = useNavigation();

  // Función para manejar el registro del proveedor
  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.0.107:5055/api/Proveedor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreEmpresa: 'test',
          direccion: 'test',
          telefonoContacto: 'test',
          nombreContacto: 'test',
          apellidoM: 'test',
          apellidoP: 'test',
        }),
      });
  
      const text = await response.text();
      console.log('Response text:', text); // Para ver la respuesta exacta
  
      // Intenta parsear el JSON solo si la respuesta es JSON válida
      const data = JSON.parse(text);
      if (response.ok) {
        Alert.alert('Registro exitoso', 'El proveedor ha sido registrado exitosamente.');
      } else {
        Alert.alert('Error al registrar', data.message || 'Ocurrió un error al registrar el proveedor.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Algo salió mal. Por favor, intenta de nuevo.');
    }
  };
  

  return (
    <View style={styles.wrapper}>
      <Text style={styles.formTitle}>Registro de Proveedor</Text>

      <TextInput
        value={nombreEmpresa}
        onChangeText={setNombreEmpresa}
        placeholder="Nombre de la Empresa"
        style={styles.input}
      />
      <TextInput
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
        style={styles.input}
      />
      <TextInput
        value={telefonoContacto}
        onChangeText={setTelefonoContacto}
        placeholder="Teléfono de Contacto"
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        value={nombreContacto}
        onChangeText={setNombreContacto}
        placeholder="Nombre del Contacto"
        style={styles.input}
      />
      <TextInput
        value={apellidoP}
        onChangeText={setApellidoP}
        placeholder="Apellido Paterno"
        style={styles.input}
      />
      <TextInput
        value={apellidoM}
        onChangeText={setApellidoM}
        placeholder="Apellido Materno"
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterProveedor;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
