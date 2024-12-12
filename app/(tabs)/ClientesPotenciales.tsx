import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';

// Datos iniciales de ejemplo de clientes
const initialData = [
  { id: '1', nombre: 'Juan', apellidos: 'Perez', correo: 'juan@example.com', telefono: '555-555-555', empresa: 'Empresa A', direccion: 'Dirección 1', estatus: 'Activo', fechaRegistro: '2023-11-06', historial: [] },
  { id: '2', nombre: 'Maria', apellidos: 'Gomez', correo: 'maria@example.com', telefono: '555-123-456', empresa: 'Empresa B', direccion: 'Dirección 2', estatus: 'Inactivo', fechaRegistro: '2023-11-06', historial: [] },
];

const ClientesPotenciales = () => {
  const [clientes, setClientes] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddClienteModalVisible, setAddClienteModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [newCliente, setNewCliente] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    empresa: '',
    direccion: '',
    estatus: 'Activo',  // Establecer estatus como "Activo" por defecto
  });
  const [newComunicacion, setNewComunicacion] = useState({
    tipoComunicacion: '',
    detalleComunicacion: '',
    estatus: '',
    necesidad: '',
  });

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para agregar un nuevo cliente
  const handleAddCliente = () => {
    if (newCliente.nombre && newCliente.apellidos && newCliente.correo) {
      const nuevoCliente = {
        ...newCliente,
        id: (clientes.length + 1).toString(),
        fechaRegistro: getCurrentDate(),
        historial: [],
      };
      setClientes([...clientes, nuevoCliente]);
      setNewCliente({
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        empresa: '',
        direccion: '',
        estatus: 'Activo',  // Reiniciar el estatus a "Activo"
      });
      setAddClienteModalVisible(false);
    } else {
      alert('Por favor, complete los campos obligatorios: Nombre, Apellidos y Correo.');
    }
  };

  // Función para cambiar el estatus de un cliente
  const toggleEstatus = (clienteId) => {
    const updatedClientes = clientes.map((cliente) => {
      if (cliente.id === clienteId) {
        return {
          ...cliente,
          estatus: cliente.estatus === 'Activo' ? 'Inactivo' : 'Activo', // Cambiar entre Activo/Inactivo
        };
      }
      return cliente;
    });
    setClientes(updatedClientes);
  };

  // Función para abrir el modal de historial del cliente
  const openHistorialModal = (cliente) => {
    setSelectedCliente(cliente);
    setModalVisible(true);
  };

  // Función para guardar un nuevo registro de comunicación en el historial del cliente seleccionado
  const handleSaveComunicacion = () => {
    if (newComunicacion.tipoComunicacion && newComunicacion.detalleComunicacion) {
      const updatedClientes = clientes.map((cliente) => {
        if (cliente.id === selectedCliente.id) {
          return {
            ...cliente,
            historial: [
              ...cliente.historial,
              {
                ...newComunicacion,
                fechaComunicacion: getCurrentDate(), // Fecha automática
              },
            ],
          };
        }
        return cliente;
      });
      setClientes(updatedClientes);
      setNewComunicacion({
        tipoComunicacion: '',
        detalleComunicacion: '',
        estatus: '',
        necesidad: '',
      });
      setModalVisible(false);
    } else {
      alert('Por favor, complete los campos de tipo de comunicación y detalle.');
    }
  };

  // Filtrar clientes según el texto de búsqueda
  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.apellidos.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.empresa.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Clientes Potenciales</Text>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      {/* Botón para agregar un nuevo cliente */}
      <Button title="Agregar Cliente" onPress={() => setAddClienteModalVisible(true)} />

      {/* Lista de clientes en tarjetas */}
      <FlatList
        data={filteredClientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, item.estatus === 'Inactivo' && styles.cardInactive]}>
            <Text style={styles.cardTitle}>{item.nombre} {item.apellidos}</Text>
            <Text style={styles.cardSubtitle}>{item.empresa}</Text>
            <Text>Correo: {item.correo}</Text>
            <Text>Teléfono: {item.telefono}</Text>
            <Text>Dirección: {item.direccion}</Text>
            <Text>Estatus: {item.estatus}</Text>
            <Text>Fecha de Registro: {item.fechaRegistro}</Text>
            <Button title={`Cambiar a ${item.estatus === 'Activo' ? 'Inactivo' : 'Activo'}`} onPress={() => toggleEstatus(item.id)} />
            <Button title="Ver Historial" onPress={() => openHistorialModal(item)} />
          </View>
        )}
      />

      {/* Modal para agregar un nuevo cliente */}
      <Modal visible={isAddClienteModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nuevo Cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newCliente.nombre}
              onChangeText={text => setNewCliente({ ...newCliente, nombre: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={newCliente.apellidos}
              onChangeText={text => setNewCliente({ ...newCliente, apellidos: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={newCliente.correo}
              onChangeText={text => setNewCliente({ ...newCliente, correo: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={newCliente.telefono}
              onChangeText={text => setNewCliente({ ...newCliente, telefono: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Empresa"
              value={newCliente.empresa}
              onChangeText={text => setNewCliente({ ...newCliente, empresa: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={newCliente.direccion}
              onChangeText={text => setNewCliente({ ...newCliente, direccion: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Estatus"
              value={newCliente.estatus}
              editable={false}
            />
            <View style={styles.modalButtons}>
              <Button title="Guardar Cliente" onPress={handleAddCliente} />
              <Button title="Cancelar" color="red" onPress={() => setAddClienteModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para ver y agregar al historial de comunicaciones */}
      {selectedCliente && (
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Historial de {selectedCliente.nombre} {selectedCliente.apellidos}</Text>

              <FlatList
                data={selectedCliente.historial}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historialItem}>
                    <Text>Fecha: {item.fechaComunicacion}</Text>
                    <Text>Tipo: {item.tipoComunicacion}</Text>
                    <Text>Detalle: {item.detalleComunicacion}</Text>
                    <Text>Estatus: {item.estatus}</Text>
                    <Text>Necesidad: {item.necesidad}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text>No hay registros de comunicación</Text>}
              />

              <TextInput
                style={styles.input}
                placeholder="Tipo de Comunicación"
                value={newComunicacion.tipoComunicacion}
                onChangeText={text => setNewComunicacion({ ...newComunicacion, tipoComunicacion: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Detalle de Comunicación"
                value={newComunicacion.detalleComunicacion}
                onChangeText={text => setNewComunicacion({ ...newComunicacion, detalleComunicacion: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Estatus"
                value={newComunicacion.estatus}
                onChangeText={text => setNewComunicacion({ ...newComunicacion, estatus: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Necesidad"
                value={newComunicacion.necesidad}
                onChangeText={text => setNewComunicacion({ ...newComunicacion, necesidad: text })}
              />
              <View style={styles.modalButtons}>
                <Button title="Guardar Comunicación" onPress={handleSaveComunicacion} />
                <Button title="Cerrar" color="red" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardInactive: {
    backgroundColor: 'red', // Cambiar el fondo a rojo si el estatus es Inactivo
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  historialItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ClientesPotenciales;
