import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Registros = () => {
  const [currentForm, setCurrentForm] = useState<'historial' | 'proyecto'>('historial');
  const navigation = useNavigation();

  // Historial Form Fields
  const [clienteId, setClienteId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaComunicacion, setFechaComunicacion] = useState('');
  const [tipoComunicacion, setTipoComunicacion] = useState('');
  const [detallesComunicado, setDetallesComunicado] = useState('');
  const [fechaProximaCita, setFechaProximaCita] = useState('');
  const [solicitud, setSolicitud] = useState('');

  // Proyecto Form Fields
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    // Función para cargar los ids desde AsyncStorage
    const loadIds = async () => {
      const storedNombre = await AsyncStorage.getItem('nombre');
      const storedUsuarioId = await AsyncStorage.getItem('userId');
      if (storedNombre) setNombre(storedNombre);
      if (storedUsuarioId) setUsuarioId(storedUsuarioId);
    };

    loadIds();
  }, []);
  console.log(setNombre);
  
  const handleHistorialSubmit = async () => {
    const payload = {
      clienteId: parseInt(clienteId),
      usuarioId: parseInt(usuarioId),
      fechaComunicacion: parseDateOnly(fechaComunicacion),
      tipoComunicacion: parseInt(tipoComunicacion),
      detallesComunicado,
      fechaProximaCita: fechaProximaCita ? parseDateOnly(fechaProximaCita) : null,
      solicitud,
    };

    try {
      const response = await axios.post(
        'http://192.168.57.70:5055/api/HistorialComunicacion/create',
        payload
      );
      
      Alert.alert('Éxito', 'Historial creado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el historial.');
    }
  };

  const handleProyectoSubmit = async () => {
    const payload = {
      clienteId: parseInt(clienteId),
      empresaId: empresaId ? parseInt(empresaId) : null,
      nombreProyecto,
      descripcion,
      monto: parseFloat(monto),
      fechaInicio: parseDateOnly(fechaInicio),
      fechaFin: fechaFin ? parseDateOnly(fechaFin) : null,
    };

    try {
      const response = await axios.post(
        'http://192.168.57.70:5055/api/Proyecto/create',
        payload
      );
      Alert.alert('Éxito', 'Proyecto creado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el proyecto.');
    }
  };

  const parseDateOnly = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day, dayOfWeek: new Date(dateString).getDay() };
  };

  const renderHistorialForm = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.label}>Cliente</Text>
      <TextInput style={styles.input} value={clienteId} onChangeText={setClienteId} keyboardType="numeric" />
      <Text style={styles.label}>Agente de Venta</Text>
      <TextInput style={[styles.input, { backgroundColor: '#f0f0f0' }]}  value={nombre} onChangeText={setUsuarioId} editable={false} />
      <Text style={styles.label}>Fecha Comunicación (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={fechaComunicacion} onChangeText={setFechaComunicacion} />
      <Text style={styles.label}>Tipo Comunicación</Text>
      <TextInput style={styles.input} value={tipoComunicacion} onChangeText={setTipoComunicacion} keyboardType="numeric" />
      <Text style={styles.label}>Detalles Comunicado</Text>
      <TextInput style={styles.input} value={detallesComunicado} onChangeText={setDetallesComunicado} />
      <Text style={styles.label}>Fecha Próxima Cita (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={fechaProximaCita} onChangeText={setFechaProximaCita} />
      <Text style={styles.label}>Solicitud</Text>
      <TextInput style={styles.input} value={solicitud} onChangeText={setSolicitud} />
      <Button title="Agregar Historial" onPress={handleHistorialSubmit} />
    </ScrollView>
  );

  const renderProyectoForm = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.label}>Cliente ID</Text>
      <TextInput style={styles.input} value={clienteId} onChangeText={setClienteId} keyboardType="numeric" />
      <Text style={styles.label}>Empresa ID</Text>
      <TextInput style={styles.input} value={empresaId} onChangeText={setEmpresaId} keyboardType="numeric" />
      <Text style={styles.label}>Nombre Proyecto</Text>
      <TextInput style={styles.input} value={nombreProyecto} onChangeText={setNombreProyecto} />
      <Text style={styles.label}>Descripción</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} />
      <Text style={styles.label}>Monto</Text>
      <TextInput style={styles.input} value={monto} onChangeText={setMonto} keyboardType="numeric" />
      <Text style={styles.label}>Fecha Inicio (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={fechaInicio} onChangeText={setFechaInicio} />
      <Text style={styles.label}>Fecha Fin (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={fechaFin} onChangeText={setFechaFin} />
      <Button title="Agregar Proyecto" onPress={handleProyectoSubmit} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Agregar Historial" onPress={() => setCurrentForm('historial')} />
        <Button title="Agregar Proyecto" onPress={() => setCurrentForm('proyecto')} />
      </View>
      {currentForm === 'historial' ? renderHistorialForm() : renderProyectoForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default Registros;
