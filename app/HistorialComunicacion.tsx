import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';

type Cliente = {
  clienteId: number;
  nombreCliente: string;
};

type HistorialComunicacion = {
  historialId: number;
  clienteId: number;
  usuarioId: number;
  fechaComunicacion: string;
  estatus: number;
  tipoComunicacion: number;
  detallesComunicado: string;
  fechaProximaCita?: string;
  solicitud: string;
};

const HistorialComunicacion = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [historial, setHistorial] = useState<HistorialComunicacion[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false); 
  const [showForm, setShowForm] = useState(false);

  const [fechaComunicacion, setFechaComunicacion] = useState('');
  const [detalles, setDetalles] = useState('');
  const [solicitud, setSolicitud] = useState('');
  const [fechaProximaCita, setFechaProximaCita] = useState('');

  useEffect(() => {
    fetchClientes();
    setFechaProximaCita(getDefaultProximaCita());
    setFechaComunicacion(getTodayDate());
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista');
      if (!response.ok) throw new Error('Error al cargar los clientes');
      const clientesData = await response.json();
      setClientes(clientesData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los clientes.');
    }
  };

  const fetchHistorial = async (clienteId: number) => {
    setLoadingHistorial(true);
    setHistorial([]);

    try {
      const response = await fetch(`https://bazar20241109230927.azurewebsites.net/api/HistorialComunicacion/by-cliente/${clienteId}`);
      if (!response.ok) throw new Error('Error al cargar el historial de comunicación');
      const historialData = await response.json();
      setHistorial(historialData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el historial de comunicación.');
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find((c) => c.clienteId === Number(clienteId)) || null;
    setSelectedCliente(cliente);
    if (cliente) {
      fetchHistorial(cliente.clienteId);
    } else {
      setHistorial([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCliente) {
      Alert.alert('Error', 'Por favor selecciona un cliente.');
      return;
    }

    const payload: Omit<HistorialComunicacion, 'historialId' | 'estatus'> = {
      clienteId: selectedCliente.clienteId,
      usuarioId: 4,
      fechaComunicacion,
      tipoComunicacion: 1,
      detallesComunicado: detalles,
      fechaProximaCita,
      solicitud,
    };

    try {
      const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/HistorialComunicacion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Historial de comunicación registrado.');
        fetchHistorial(selectedCliente.clienteId);
        setShowForm(false);
      } else {
        Alert.alert('Error', 'No se pudo registrar el historial.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al registrar el historial.');
    }
  };

  const getDefaultProximaCita = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📞 Historial de Comunicación</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Fecha de Comunicación:</Text>
        <TextInput
          style={styles.input}
          value={fechaComunicacion}
          onChangeText={setFechaComunicacion}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Detalles:</Text>
        <TextInput
          style={styles.input}
          value={detalles}
          onChangeText={setDetalles}
          placeholder="Escribe los detalles..."
        />

        <Text style={styles.label}>Fecha Próxima Cita:</Text>
        <TextInput
          style={styles.input}
          value={fechaProximaCita}
          onChangeText={setFechaProximaCita}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HistorialComunicacion;