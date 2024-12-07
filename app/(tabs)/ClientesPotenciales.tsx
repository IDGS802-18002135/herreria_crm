import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface Cliente {
  clienteId: string | number;
  nombreCliente: string;
  nombreEmpresa: string;
  correo: string;
  telefono: string;
  direccion: string;
  estatus: number;
}

interface FormData {
  NombreCliente: string;
  DireccionCliente: string;
  TelefonoCliente: string;
  CorreoCliente: string;
  RedesSociales: string;
  Origen: string;
  PreferenciaComunicacion: string;
  UsuarioId: string;
  NombreEmpresa: string;
  DireccionEmpresa: string;
  TelefonoEmpresa: string;
  CorreoEmpresa: string;
  SitioWeb: string;
}

const ClientesPotenciales = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // ID del usuario logueado
  const [formData, setFormData] = useState<FormData>({
    NombreCliente: '',
    DireccionCliente: '',
    TelefonoCliente: '',
    CorreoCliente: '',
    RedesSociales: '',
    Origen: 'Encontrado por defecto',
    PreferenciaComunicacion: '',
    UsuarioId: '',
    NombreEmpresa: '',
    DireccionEmpresa: '',
    TelefonoEmpresa: '',
    CorreoEmpresa: '',
    SitioWeb: '',
  });

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista');
      if (!response.ok) throw new Error('Error al cargar los clientes.');
      const data = await response.json();
      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      Alert.alert('Error', `Error al cargar los clientes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text) {
      const filtered = clientes.filter(cliente =>
        cliente.nombreCliente.toLowerCase().includes(text.toLowerCase()) ||
        cliente.nombreEmpresa.toLowerCase().includes(text.toLowerCase()) ||
        cliente.clienteId.toString().includes(text)
      );
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes(clientes);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al registrar cliente.');
      const data = await response.text();
      Alert.alert('Éxito', data);

      const newCliente = { ...formData, clienteId: Date.now() };
      setClientes([newCliente, ...clientes]);
      setFilteredClientes([newCliente, ...filteredClientes]);

      setShowForm(false);
    } catch (error: any) {
      Alert.alert('Error', `Error al registrar: ${error.message || 'No se pudo registrar.'}`);
    }
  };

  const handleCancel = () => {
    setFormData({
      NombreCliente: '',
      DireccionCliente: '',
      TelefonoCliente: '',
      CorreoCliente: '',
      RedesSociales: '',
      Origen: 'Encontrado por defecto',
      PreferenciaComunicacion: '',
      UsuarioId: currentUserId ? currentUserId.toString() : '',
      NombreEmpresa: '',
      DireccionEmpresa: '',
      TelefonoEmpresa: '',
      CorreoEmpresa: '',
      SitioWeb: '',
    });
    setShowForm(false);
  };

  const handleUpdate = (clienteId: string | number) => {
    const clienteToUpdate = clientes.find(cliente => cliente.clienteId === clienteId);
    if (clienteToUpdate) {
      setFormData({
        NombreCliente: clienteToUpdate.nombreCliente || '',
        DireccionCliente: clienteToUpdate.direccion || '',
        TelefonoCliente: clienteToUpdate.telefono || '',
        CorreoCliente: clienteToUpdate.correo || '',
        RedesSociales: '',
        Origen: 'Encontrado por defecto',
        PreferenciaComunicacion: '',
        UsuarioId: currentUserId ? currentUserId.toString() : '',
        NombreEmpresa: clienteToUpdate.nombreEmpresa || '',
        DireccionEmpresa: clienteToUpdate.direccion || '',
        TelefonoEmpresa: clienteToUpdate.telefono || '',
        CorreoEmpresa: clienteToUpdate.correo || '',
        SitioWeb: '',
      });
      setShowForm(true);
    }
  };

  const handleChangeStatus = async (clienteId: string | number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 2 : 1;
      const response = await fetch(`http://http://192.168.0.108:5055/api/EmpresaCliente/change-status/${clienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatusCliente: newStatus }),
      });
      if (!response.ok) throw new Error('Error al cambiar el estatus.');
      Alert.alert('Éxito', 'Estatus actualizado');
      fetchClientes();
    } catch (error) {
      Alert.alert('Error', `Error al cambiar estatus: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchClientes();
    const userIdFromLogin = 123;
    setCurrentUserId(userIdFromLogin);

    if (userIdFromLogin && !formData.UsuarioId) {
      setFormData(prev => ({ ...prev, UsuarioId: userIdFromLogin.toString() }));
    }
  }, []);

  return (
    <View style={styles.container}>
      {!showForm ? (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente o empresa"
            value={searchTerm}
            onChangeText={handleSearch}
          />

          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.buttonText}>Registrar Cliente</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={filteredClientes}
              keyExtractor={item => item.clienteId.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.nombreCliente}</Text>
                  <Text style={styles.cardSubtitle}>{item.nombreEmpresa}</Text>
                  <Text>Correo: {item.correo}</Text>
                  <Text>Teléfono: {item.telefono}</Text>
                  <Text>Dirección: {item.direccion}</Text>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: item.estatus === 2 ? 'red' : '#007bff' }]}
                    onPress={() => handleChangeStatus(item.clienteId, item.estatus)}
                  >
                    <Text style={styles.buttonText}>
                      {item.estatus === 2 ? 'Activar' : 'Desactivar'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleUpdate(item.clienteId)}
                  >
                    <Text style={styles.buttonText}>Actualizar</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </>
      ) : (
        <ScrollView>
          <Text style={styles.formTitle}>Registro de Cliente y Empresa</Text>
          {Object.keys(formData).map(key => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.replace(/([A-Z])/g, ' $1')}
              value={(formData as any)[key] || ''}
              onChangeText={text => handleChange(key, text)}
            />
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
});

export default ClientesPotenciales;
