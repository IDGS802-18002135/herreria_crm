import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; 

interface Cliente {
  clienteId: number;
  nombreCliente: string;
  nombreEmpresa: string;
  correo: string;
  telefono: string;
  estatus: number;
}

interface Empresa {
  empresaId: string;
  nombre: string;
}

const ClientesPotenciales: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    redesSociales: "",
    origen: "",
    preferenciaComunicacion: "",
    usuarioId: 0,
    empresaId: "",
  });
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    // Obtención de datos del usuario desde AsyncStorage
    const getUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('userData');
      console.log(storedUserData); // Puedes quitar este console.log en producción
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData); // Asignamos los datos del usuario al estado
        setFormData((prevFormData) => ({
          ...prevFormData,
          usuarioId: parsedUserData.id, // Establecemos el usuarioId en el formulario
        }));
      }
    };

    // Llamamos la función para obtener los datos del usuario
    getUserData();

    // Llamada a fetchClientes y fetchEmpresas para obtener los clientes y empresas
    fetchClientes();
    fetchEmpresas();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
      );
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes", error);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/empresas"
      );
      setEmpresas(response.data);
    } catch (error) {
      console.error("Error fetching empresas", error);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchTerm(text);
    try {
      const response = await axios.get(
        `https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/buscar?searchTerm=${text}`
      );
      setClientes(response.data);
    } catch (error) {
      console.error("Error searching clientes", error);
    }
  };

  const handleStatusChange = async (clienteId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 2 : 1;

    Alert.alert(
      "Confirmar",
      "¿Seguro que deseas cambiar el estatus?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              const payload = { estatusCliente: newStatus };
              await axios.put(
                `https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/change-status/${clienteId}`,
                payload
              );
              fetchClientes();
              Alert.alert("¡Éxito!", "El estatus ha sido cambiado.");
            } catch (error) {
              console.error("Error al cambiar el estatus:", error);
              Alert.alert("Error", "No se pudo cambiar el estatus.");
            }
          },
        },
      ]
    );
  };

  const handleDetails = async (clienteId: number) => {
    try {
      const response = await axios.get(
        `https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/detalles/${clienteId}`
      );
      const { cliente, empresa } = response.data;
      Alert.alert(
        `Detalles de ${cliente.nombre}`,
        `Dirección: ${cliente.direccion}\nTeléfono: ${cliente.telefono}\nCorreo: ${cliente.correo}\nRedes Sociales: ${cliente.redesSociales}\nOrigen: ${cliente.origen}\nPreferencia de Comunicación: ${cliente.preferenciaComunicacion}\nEmpresa: ${empresa ? empresa.nombre : "Sin Empresa"}`
      );
    } catch (error) {
      console.error("Error fetching details", error);
      Alert.alert("Error", "No se pudieron obtener los detalles del cliente.");
    }
  };

  const handleRegister = async () => {
    if (!formData.nombre || !formData.telefono || !formData.correo) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios.");
      return;
    }

    // Verifica los datos antes de enviarlos
    console.log("Datos a registrar:", formData);

    try {
      const response = await axios.post(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/registercliente",
        formData,
        {
          headers: {
            'Content-Type': 'application/json', // Asegura que se envíe como JSON
          },
        }
      );

      // Verifica la respuesta de la API
      console.log("Respuesta de la API:", response.data);

      // Si la respuesta fue exitosa, actualizar la lista de clientes
      fetchClientes();

      // Muestra una alerta de éxito
      Alert.alert("¡Éxito!", "Cliente registrado correctamente.");

      // Cierra el formulario de registro
      setShowRegisterForm(false);
    } catch (error) {
      // Muestra errores específicos dependiendo del tipo de error
      if (error.response) {
        console.error("Error de respuesta del servidor:", error.response.data);
        Alert.alert("Error", "Error de servidor: " + error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        Alert.alert("Error", "No se pudo conectar al servidor.");
      } else {
        console.error("Error al configurar la solicitud:", error.message);
        Alert.alert("Error", "Error en la solicitud: " + error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!showRegisterForm ? (
        <>
          <Text style={styles.header}>Clientes Potenciales</Text>
          <TextInput
            style={styles.input}
            placeholder="Buscar..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <Button
            title="Registrar Cliente"
            onPress={() => setShowRegisterForm(true)}
          />

          <FlatList
            data={clientes}
            keyExtractor={(item) => item.clienteId.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  item.estatus === 1 ? styles.active : styles.inactive,
                ]}
              >
                <Text>{item.nombreCliente}</Text>
                <Text>Empresa: {item.nombreEmpresa || "Sin Empresa"}</Text>
                <Text>Correo: {item.correo}</Text>
                <Text>Teléfono: {item.telefono}</Text>
                <View style={styles.actions}>
                  <Button
                    title="Cambiar Estatus"
                    onPress={() => handleStatusChange(item.clienteId, item.estatus)}
                  />
                  <Button
                    title="Ver Detalles"
                    onPress={() => handleDetails(item.clienteId)}
                  />
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <View>
          <Text style={styles.header}>Registrar Cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={formData.direccion}
            onChangeText={(text) =>
              setFormData({ ...formData, direccion: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={(text) =>
              setFormData({ ...formData, telefono: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={formData.correo}
            onChangeText={(text) =>
              setFormData({ ...formData, correo: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Redes Sociales"
            value={formData.redesSociales}
            onChangeText={(text) =>
              setFormData({ ...formData, redesSociales: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Origen"
            value={formData.origen}
            onChangeText={(text) =>
              setFormData({ ...formData, origen: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Preferencia de Comunicación"
            value={formData.preferenciaComunicacion}
            onChangeText={(text) =>
              setFormData({ ...formData, preferenciaComunicacion: text })
            }
          />

          <Picker
            selectedValue={formData.empresaId}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, empresaId: itemValue })
            }
            style={styles.input}
          >
            <Picker.Item label="Seleccione una empresa" value="" />
            {empresas.map((empresa) => (
              <Picker.Item
                key={empresa.empresaId}
                label={empresa.nombre}
                value={empresa.empresaId}
              />
            ))}
          </Picker>

          <Button title="Registrar" onPress={handleRegister} />
          <Button
            title="Cancelar"
            onPress={() => setShowRegisterForm(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  active: {
    borderColor: "green",
  },
  inactive: {
    borderColor: "red",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default ClientesPotenciales;
