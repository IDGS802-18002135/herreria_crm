import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  Modal,
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
interface Cliente {
  clienteId: string | number; // Puede ser string o number dependiendo de tu backend
  nombreCliente: string;
  nombreEmpresa: string;
  correo: string;
  telefono: string;
  direccion: string;
  estatus: number; // 1 para activo, 0 para inactivo
}

const ClientesPotenciales = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar los clientes desde la API
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.57.70:5055/api/EmpresaCliente/vista');
      setClientes(response.data);
      setFilteredClientes(response.data);
      console.log(response.data);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de clientes.');
    } finally {
      setLoading(false);
    }
  };

  const registercustomer = () => {
    navigation.navigate('RegistrarClienteEmpresa');
  }

  const changeClientStatus = async (clienteId: string | number) => {
    setLoading(true);
    try {
      // Enviamos un PUT con el ID del cliente en la URL y el nuevo estado en el cuerpo de la solicitud
      const response = await axios.put(`http://192.168.57.70:5055/api/EmpresaCliente/change-status/${clienteId}`, 
        { nuevoEstatus: 0 }, // Enviamos el nuevo estado (0) en el cuerpo de la solicitud
        {
          headers: {
            'Content-Type': 'application/json'  // Asegúrate de enviar el encabezado correcto
          }
        }
      );

      console.log(response.data);
  
      // Aquí puedes hacer algo con la respuesta, por ejemplo actualizar la lista de clientes
      Alert.alert('Éxito', 'Estado del cliente actualizado correctamente');
      fetchClientes(); // Recarga la lista de clientes después de cambiar el estado
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del cliente.');
    } finally {
      setLoading(false);
    }
};

  
  // Obtener detalles de un cliente por su ID
  const fetchClienteDetalles = async (id: number | string) => {
    if (!id) {
      Alert.alert('Error', 'El ID del cliente es inválido.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.57.70:5055/api/EmpresaCliente/detalles/${id}`);
      const { Cliente, Empresa } = response.data;

      const clienteDetalles = `
        Nombre: ${Cliente.Nombre}
        Dirección: ${Cliente.Direccion}
        Teléfono: ${Cliente.Telefono}
        Correo: ${Cliente.Correo}
        Redes Sociales: ${Cliente.RedesSociales || 'No especificadas'}
        Origen: ${Cliente.Origen || 'No especificado'}
        Preferencia de Comunicación: ${Cliente.PreferenciaComunicacion || 'No especificada'}
        Estatus: ${Cliente.Estatus === 1 ? 'Activo' : 'Inactivo'}
        Fecha de Registro: ${new Date(Cliente.FechaRegistro).toLocaleDateString()}
      `;

      const empresaDetalles = Empresa
        ? `
        Empresa: ${Empresa.Nombre}
        Dirección: ${Empresa.Direccion}
        Teléfono: ${Empresa.Telefono}
        Correo: ${Empresa.Correo}
        Sitio Web: ${Empresa.SitioWeb || 'No especificado'}
        Fecha de Registro: ${new Date(Empresa.FechaRegistro).toLocaleDateString()}
      `
        : 'No hay información de empresa asociada.';

      Alert.alert(
        'Detalles del Cliente',
        `${clienteDetalles}\n\n${empresaDetalles}`,
        [{ text: 'Cerrar', style: 'cancel' }]
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'Cliente no encontrado.');
      } else {
        Alert.alert('Error', 'Ocurrió un problema al obtener los detalles del cliente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar clientes por nombre o empresa
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text) {
      const filtered = clientes.filter(cliente =>
        cliente.nombreCliente.toLowerCase().includes(text.toLowerCase()) ||
        cliente.nombreEmpresa.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes(clientes);
    }
  };

  // Clave única para cada cliente
  const keyExtractor = (item: Cliente, index: number) =>
    item.clienteId ? item.clienteId.toString() : index.toString();

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f9f9f9' }}>
      {/* Input de búsqueda */}
      <View style={{ position: 'relative', marginBottom: 20 }}>
        <TextInput
          style={{
            height: 50,
            borderColor: '#007bff',
            borderWidth: 1,
            paddingHorizontal: 15,
            paddingLeft: 40,
            borderRadius: 25,
            fontSize: 16,
            backgroundColor: '#fff',
          }}
          placeholder="Buscar cliente o empresa"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <Text
          style={{
            position: 'absolute',
            top: 12,
            left: 15,
            fontSize: 20,
            color: '#007bff',
          }}
        >
          🔍
        </Text>
      </View>

      {/* Botón de registro */}
      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          marginBottom: 20,
          borderRadius: 10,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 2,
        }}
        onPress={() => registercustomer()}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Registrar Cliente</Text>
      </TouchableOpacity>

      {/* Lista de clientes */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={filteredClientes}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                marginBottom: 15,
                backgroundColor: '#fff',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 3,
                borderLeftWidth: 5,
                borderLeftColor: item.estatus === 1 ? 'blue' : 'red',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.nombreCliente}</Text>
              <Text style={{ fontSize: 16, marginVertical: 5, color: '#007bff' }}>
                {item.nombreEmpresa}
              </Text>
              <Text>Correo: {item.correo}</Text>
              <Text>Teléfono: {item.telefono}</Text>
              <Text>Dirección: {item.direccion}</Text>
              <Text style={{ fontSize: 14, color: '#888', marginTop: 5 }}>
                ID Cliente: {item.clienteId} {/* Mostrar ID */}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  color: item.estatus === 1 ? 'blue' : 'red',
                  fontWeight: 'bold',
                }}
              >
                Estatus: {item.estatus === 1 ? 'Activo' : 'Inactivo'}
              </Text>

              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <TouchableOpacity   onPress={() => changeClientStatus(item.clienteId)} 
                  style={{
                    backgroundColor: '#28a745',
                    padding: 10,
                    marginRight: 5,
                    borderRadius: 5,
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Desactivar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ffc107',
                    padding: 10,
                    marginRight: 5,
                    borderRadius: 5,
                    flex: 1,
                    alignItems: 'center',
                  }}
                  onPress={() => fetchClienteDetalles(item.clienteId)}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Detalles</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#17a2b8',
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Historial</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ClientesPotenciales;
