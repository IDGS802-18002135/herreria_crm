import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Snackbar } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";

const ComentariosXClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [mostrarVista, setMostrarVista] = useState('correo');
  const [mensaje, setMensaje] = useState('');
  const [visible, setVisible] = useState(false);

  // Cargar clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
        );
        setClientes(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron cargar los datos de los clientes.");
      }
    };

    fetchClientes();
  }, []);

  // Cargar comentarios desde la API
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/ComentariosCliente/getAll"
        );
        const formattedData = response.data.map((item) => {
          const parts = item.descripcion.split('|');
          return {
            id: item.id,
            nombre: parts[0] || 'Sin Nombre',
            empresa: parts[1] || 'Sin Empresa',
            contacto: parts[2] || 'Sin Contacto',
            descripcion: parts[3] || 'Sin Descripción',
            fecha: item.fecha,
            tipo: item.tipo === 1 ? 'Queja' : item.tipo === 2 ? 'Comentario' : 'Solicitud de devolución',
            estatus: item.estatus === 0 ? 'Solicitud' : item.estatus === 1 ? 'Procesando' : 'Finalizado',
            calificacion: item.calificacion,
          };
        });

        setComentarios(formattedData);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron cargar los comentarios.");
      }
    };

    fetchComentarios();
  }, []);

  // Enviar correos
  const enviarCorreo = async (cliente) => {
    const emailRequest = {
      to: cliente.correo,
      subject: `Encuesta para ${cliente.nombreCliente}`,
      surveyLink: "https://soft-lebkuchen-8711b6.netlify.app/",
      clientName: cliente.nombreCliente,
    };

    try {
      await axios.post(
        "https://bazar20241109230927.azurewebsites.net/api/Comentarios/sendSurvey",
        emailRequest
      );
      setMensaje('Correo enviado correctamente.');
      setVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo enviar el correo.");
    }
  };

  // Cambiar estatus
  const cambiarEstatus = (id, nuevoEstatus) => {
    setComentarios((prevComentarios) => {
      const updatedComentarios = prevComentarios.map((comentario) =>
        comentario.id === id
          ? { ...comentario, estatus: nuevoEstatus }
          : comentario
      );
      return updatedComentarios;
    });
    setMensaje('Estatus cambiado correctamente.');
    setVisible(true);
  };

  // Determinar color de la fila basado en el estatus
  const getRowStyle = (estatus) => {
    switch (estatus) {
      case 'Solicitud':
        return styles.rowRed;
      case 'Procesando':
        return styles.rowYellow;
      case 'Finalizado':
        return styles.rowGreen;
      default:
        return {};
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMostrarVista('correo')}
        >
          <Text style={styles.buttonText}>Mandar Correos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMostrarVista('seguimiento')}
        >
          <Text style={styles.buttonText}>Seguimiento</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginTop: 20 }}>
        {mostrarVista === 'correo' && (
          <ScrollView horizontal>
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Empresa</Text>
                <Text style={styles.headerCell}>Correo</Text>
                <Text style={styles.headerCell}>Acción</Text>
              </View>
              {clientes.map((item) => (
                <View style={styles.rowDefault} key={item.clienteId}>
                  <Text style={styles.cell}>{item.nombreCliente}</Text>
                  <Text style={styles.cell}>{item.nombreEmpresa || 'Sin Empresa'}</Text>
                  <Text style={styles.cell}>{item.correo}</Text>
                  <Button title="Mandar Correo" onPress={() => enviarCorreo(item)} />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
        {mostrarVista === 'seguimiento' && (
          <ScrollView horizontal>
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Empresa</Text>
                <Text style={styles.headerCell}>Contacto</Text>
                <Text style={styles.headerCell}>Descripción</Text>
                <Text style={styles.headerCell}>Fecha</Text>
                <Text style={styles.headerCell}>Tipo</Text>
                <Text style={styles.headerCell}>Estatus</Text>
                <Text style={styles.headerCell}>Calificación</Text>
              </View>
              {comentarios.map((item) => (
                <View style={[styles.rowDefault, getRowStyle(item.estatus)]} key={item.id}>
                  <Text style={styles.cell}>{item.nombre}</Text>
                  <Text style={styles.cell}>{item.empresa}</Text>
                  <Text style={styles.cell}>{item.contacto}</Text>
                  <Text style={styles.cell}>{item.descripcion}</Text>
                  <Text style={styles.cell}>{item.fecha}</Text>
                  <Text style={styles.cell}>{item.tipo}</Text>
                  <Picker
                    selectedValue={item.estatus}
                    style={styles.picker}
                    onValueChange={(value) => cambiarEstatus(item.id, value)}
                  >
                    <Picker.Item label="Solicitud" value="Solicitud" />
                    <Picker.Item label="Procesando" value="Procesando" />
                    <Picker.Item label="Finalizado" value="Finalizado" />
                  </Picker>
                  <Text style={styles.cell}>{'⭐'.repeat(item.calificacion)}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </ScrollView>
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {mensaje}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowDefault: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowRed: {
    backgroundColor: '#ffcccc',
  },
  rowYellow: {
    backgroundColor: '#fff5cc',
  },
  rowGreen: {
    backgroundColor: '#ccffcc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  picker: {
    flex: 1,
    height: 40,
  },
});

export default ComentariosXClientes;
