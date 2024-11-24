import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

interface Cliente {
    clienteId: string | number;
    nombreCliente: string;
    nombreEmpresa: string;
    correo: string;
    telefono: string;
    direccion: string;
    estatus: number;
  }

const RegistrarClienteEmpresa = () => {

  const [usuarioId, setUsuarioId] = useState('');
  const [nombre, setNombre] = useState('');
  const [errors, setErrors] = useState({});


  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();


  const [formData, setFormData] = useState({
    NombreCliente: "",
    DireccionCliente: "",
    TelefonoCliente: "",
    CorreoCliente: "",
    RedesSociales: "",
    Origen: "",
    PreferenciaComunicacion: "",
    UsuarioId: usuarioId, // Asegúrate de llenar este campo con el ID correspondiente
    NombreEmpresa: "",
    DireccionEmpresa: "",
    TelefonoEmpresa: "",
    CorreoEmpresa: "",
    SitioWeb: "",
  });

  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUsuarioId = await AsyncStorage.getItem('userId');
        if (storedUsuarioId) {
          // Actualiza el UsuarioId en formData solo si se encuentra el valor
          setFormData(prevFormData => ({
            ...prevFormData,
            UsuarioId: storedUsuarioId,  // Asigna el UsuarioId obtenido
          }));
        } else {
          console.log("No se encontró el UsuarioId en AsyncStorage.");
        }
      } catch (error) {
        console.error("Error al obtener el UsuarioId de AsyncStorage", error);
      }
    };
    // Función para cargar los ids desde AsyncStorage
    const loadIds = async () => {
      const storedNombre = await AsyncStorage.getItem('nombre');
      const storedUsuarioId = await AsyncStorage.getItem('userId');
      if (storedNombre) setNombre(storedNombre);
      if (storedUsuarioId) setUsuarioId(storedUsuarioId);
    };
    fetchUserId();
    loadIds();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
  };
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    console.log("Datos enviados:", formData);
    console.log('id', usuarioId);
    
    try {
      const response = await axios.post(
        "http://192.168.57.70:5055/api/EmpresaCliente/register",
        formData
      );
      navigation.navigate('ClientesPotenciales');
      
      console.log("prueba se hizo el registro con exito");
      
      Alert.alert("Éxito", response.data);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data || "No se pudo registrar.");
    }
  };

  const handleCancel = () => {
    setFormData({
      NombreCliente: "",
      DireccionCliente: "",
      TelefonoCliente: "",
      CorreoCliente: "",
      RedesSociales: "",
      Origen: "",
      PreferenciaComunicacion: "",
      UsuarioId: "",
      NombreEmpresa: "",
      DireccionEmpresa: "",
      TelefonoEmpresa: "",
      CorreoEmpresa: "",
      SitioWeb: "",
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registro de Cliente y Empresa</Text>
      {/* Campos del Cliente */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del Cliente"
        value={formData.NombreCliente}
        onChangeText={(text) => handleChange("NombreCliente", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección del Cliente"
        value={formData.DireccionCliente}
        onChangeText={(text) => handleChange("DireccionCliente", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono del Cliente"
        value={formData.TelefonoCliente}
        onChangeText={(text) => handleChange("TelefonoCliente", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo del Cliente"
        value={formData.CorreoCliente}
        onChangeText={(text) => handleChange("CorreoCliente", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Redes Sociales"
        value={formData.RedesSociales}
        onChangeText={(text) => handleChange("RedesSociales", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Origen"
        value={formData.Origen}
        onChangeText={(text) => handleChange("Origen", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Preferencia de Comunicación"
        value={formData.PreferenciaComunicacion}
        onChangeText={(text) => handleChange("PreferenciaComunicacion", text)}
      />
      <TextInput
        style={styles.input}
        placeholder={nombre}
        
        onChangeText={(text) => handleChange("UsuarioId", text)}
        editable={false} // Desactiva la entrada de texto
      />

      {/* Campos de la Empresa */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Empresa"
        value={formData.NombreEmpresa}
        onChangeText={(text) => handleChange("NombreEmpresa", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección de la Empresa"
        value={formData.DireccionEmpresa}
        onChangeText={(text) => handleChange("DireccionEmpresa", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono de la Empresa"
        value={formData.TelefonoEmpresa}
        onChangeText={(text) => handleChange("TelefonoEmpresa", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo de la Empresa"
        value={formData.CorreoEmpresa}
        onChangeText={(text) => handleChange("CorreoEmpresa", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Sitio Web"
        value={formData.SitioWeb}
        onChangeText={(text) => handleChange("SitioWeb", text)}
      />
      {/** Modal para mostrar los detalles */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Cliente</Text>
            {selectedCliente ? (
              <>
                <Text>Nombre: {selectedCliente.nombreCliente}</Text>
                <Text>Empresa: {selectedCliente.nombreEmpresa}</Text>
                <Text>Correo: {selectedCliente.correo}</Text>
                <Text>Teléfono: {selectedCliente.telefono}</Text>
                <Text>Dirección: {selectedCliente.direccion}</Text>
                <Text>
                  Estatus: {selectedCliente.estatus === 1 ? 'Activo' : 'Inactivo'}
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>Cargando...</Text>
            )}
          </View>
        </View>
      </Modal>
      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
      },
      modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
      closeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
      },
      closeButtonText: { color: '#fff', fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RegistrarClienteEmpresa;
