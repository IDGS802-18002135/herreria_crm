import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';

type Proveedor = {
  id: number;
  nombreEmpresa: string;
  direccion: string;
  telefonoContacto: string;
  nombreContacto: string;
  apellidoM: string;
  apellidoP: string;
  estatus: number;
};

const ProveedorList = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada al endpoint para obtener todos los proveedores
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://192.168.0.107:5055/api/Proveedor/all');
        if (!response.ok) {
          throw new Error('Error al obtener proveedores');
        }
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  const renderItem = ({ item }: { item: Proveedor }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nombreEmpresa}</Text>
      <Text>Dirección: {item.direccion}</Text>
      <Text>Teléfono: {item.telefonoContacto}</Text>
      <Text>Contacto: {item.nombreContacto} {item.apellidoP} {item.apellidoM}</Text>
      <Text>Estatus: {item.estatus === 1 ? 'Activo' : 'Inactivo'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={proveedores}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron proveedores.</Text>}
        />
      )}
    </View>
  );
};

export default ProveedorList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});
