import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '@/components/SideBar';

const ComentariosXClientes = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motivo, setMotivo] = useState('');
  const [selectedComentario, setSelectedComentario] = useState(null);
  const navigation = useNavigation();

  // Cargar datos desde la API
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/ComentariosCliente/getAll');
        const data = await response.json();

        // Transformar datos para adaptarlos al componente
        const comentariosTransformados = data.map((comentario) => ({
          id: comentario.id,
          cliente: `Cliente ${comentario.clienteId}`,
          email: 'N/A', // Dato no disponible en la API
          telefono: 'N/A', // Dato no disponible en la API
          tipo: comentario.tipo === 1 ? 'Comentario' : 'Otro',
          descripcion: comentario.descripcion,
          estatus: comentario.estatus === 0 ? 'Pendiente' : 'Resuelto',
          calificacion: comentario.calificacion,
          fecha: comentario.fecha,
          comentario_extendido: '', // Campo para motivo de cambio
        }));

        setComentarios(comentariosTransformados);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        Alert.alert('Error', 'No se pudo cargar la información.');
        setLoading(false);
      }
    };

    fetchComentarios();
  }, []);

  const cambiarEstatus = (id, nuevoEstatus) => {
    if (nuevoEstatus === 'Resuelto' && motivo.trim() === '') {
      Alert.alert('Error', 'Debe proporcionar un motivo para resolver el comentario');
      return;
    }

    Alert.alert(
      '¿Estás seguro?',
      `Cambiar el estatus a ${nuevoEstatus}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cambiar',
          onPress: () => {
            setComentarios((prevComentarios) =>
              prevComentarios.map((comentario) => {
                if (comentario.id === id) {
                  comentario.estatus = nuevoEstatus;
                  comentario.comentario_extendido = motivo;
                }
                return comentario;
              })
            );
            setMotivo('');
            setSelectedComentario(null);
            Alert.alert('Éxito', `El estatus se cambió a ${nuevoEstatus}`);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const calificarComentario = (id, calificacion) => {
    setComentarios((prevComentarios) =>
      prevComentarios.map((comentario) => {
        if (comentario.id === id) {
          comentario.calificacion = calificacion;
        }
        return comentario;
      })
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.comentarioContainer}>
      <Text style={styles.comentarioText}>Cliente: {item.cliente}</Text>
      <Text style={styles.comentarioText}>Email: {item.email}</Text>
      <Text style={styles.comentarioText}>Teléfono: {item.telefono}</Text>
      <Text style={styles.comentarioText}>Tipo: {item.tipo}</Text>
      <Text style={styles.comentarioText}>Descripción: {item.descripcion}</Text>
      <Text style={styles.comentarioText}>Fecha: {item.fecha}</Text>
      <Text style={styles.comentarioText}>Estatus: {item.estatus}</Text>

      {item.estatus === 'Pendiente' && (
        <View>
          <TextInput
            style={styles.input}
            placeholder={`Justificar cambio a ${item.estatus}`}
            value={motivo}
            onChangeText={setMotivo}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectedComentario({ id: item.id, estatus: 'Resuelto' });
              cambiarEstatus(item.id, 'Resuelto');
            }}
          >
            <Text style={styles.buttonText}>Guardar Cambio</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= item.calificacion ? 'star' : 'star-outline'}
            size={24}
            color="#FFD700"
            onPress={() => calificarComentario(item.id, star)}
          />
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Cargando comentarios...</Text>
      </View>
    );
  }

  return (
    <>
    
    <View style={styles.container}>
        
      <View style={styles.cardContainer}>
        <Text style={styles.header}>Comentarios por Cliente</Text>

        <FlatList
          data={comentarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
    </>
    
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  comentarioContainer: {
    marginBottom: 20,
  },
  comentarioText: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default ComentariosXClientes;
