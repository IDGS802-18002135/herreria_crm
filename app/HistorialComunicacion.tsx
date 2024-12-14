import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  StyleSheet
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const HistorialComunicacion: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<any | null>(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Campos del formulario
  const [fechaComunicacion, setFechaComunicacion] = useState<string>("");
  const [tipoComunicacion, setTipoComunicacion] = useState<number>(1);
  const [detalles, setDetalles] = useState<string>("");
  const [solicitud, setSolicitud] = useState<string>("");
  const [fechaProximaCita, setFechaProximaCita] = useState<string>("");

  useEffect(() => {
    fetchClientes();
    setFechaProximaCita(getDefaultProximaCita());
    setFechaComunicacion(getTodayDate());
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(
        "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
      );
      if (!response.ok) throw new Error("Error al cargar los clientes");
      const clientesData = await response.json();
      setClientes(clientesData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los clientes.");
    }
  };

  const fetchHistorial = async (clienteId: number) => {
    setLoadingHistorial(true);
    setHistorial([]);
    try {
      const response = await fetch(
        `https://bazar20241109230927.azurewebsites.net/api/HistorialComunicacion/by-cliente/${clienteId}`
      );
      if (!response.ok)
        throw new Error("Error al cargar el historial de comunicación");
      const historialData = await response.json();
      setHistorial(historialData);
    } catch (error) {
      console.error(error);
      Alert.alert("Info", "No cuenta con historial de comunicación con este cliente.");
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleClienteChange = (clienteId: number) => {
    const cliente = clientes.find((c) => c.clienteId === clienteId) || null;
    setSelectedCliente(cliente);
    if (cliente) {
      fetchHistorial(clienteId);
    } else {
      setHistorial([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCliente) {
      Alert.alert("Error", "Por favor selecciona un cliente.");
      return;
    }

    const payload = {
      clienteId: selectedCliente.clienteId,
      usuarioId: 4,
      fechaComunicacion,
      tipoComunicacion,
      detallesComunicado: detalles,
      fechaProximaCita,
      solicitud,
    };

    try {
      const response = await fetch(
        "https://bazar20241109230927.azurewebsites.net/api/HistorialComunicacion/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Historial de comunicación registrado.");
        fetchHistorial(selectedCliente.clienteId);
        setShowForm(false);
      } else {
        Alert.alert("Error", "No se pudo registrar el historial.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error al registrar el historial.");
    }
  };

  const getDefaultProximaCita = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📞 Historial de Comunicación</Text>

      <Text>Seleccionar Cliente:</Text>
      <Picker
        selectedValue={selectedCliente?.clienteId || ""}
        onValueChange={(value) => handleClienteChange(Number(value))}
      >
        <Picker.Item label="Seleccionar cliente" value="" />
        {clientes.map((cliente) => (
          <Picker.Item
            key={cliente.clienteId}
            label={cliente.nombreCliente}
            value={cliente.clienteId}
          />
        ))}
      </Picker>

      {selectedCliente ? (
        loadingHistorial ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : historial.length > 0 ? (
          <FlatList
            data={historial}
            keyExtractor={(item) => item.historialId.toString()}
            renderItem={({ item }) => (
              <View style={styles.historialCard}>
                <Text>📅 {item.fechaComunicacion}</Text>
                <Text>Tipo: {[
                  "Correo",
                  "Videollamada",
                  "Llamada",
                  "Red Social",
                  "Presencial",
                ][item.tipoComunicacion - 1]}</Text>
                <Text>Detalles: {item.detallesComunicado}</Text>
                <Text>Solicitud: {item.solicitud}</Text>
                <Text>Próxima Cita: {item.fechaProximaCita}</Text>
                <Text>
                  Estatus: {item.estatus === 1 ? "Activo" : "Inactivo"}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text>Este cliente no tiene historial de comunicación.</Text>
        )
      ) : (
        <Text>Selecciona un cliente para ver su historial.</Text>
      )}

      {!showForm && selectedCliente && (
        <Button title="+ Agregar Nuevo Historial" onPress={() => setShowForm(true)} />
      )}

      {showForm && (
        <View style={styles.formContainer}>
          <Text>📝 Registrar Nuevo Historial</Text>
          <TextInput
            style={styles.input}
            value={fechaComunicacion}
            onChangeText={setFechaComunicacion}
            placeholder="Fecha de comunicación"
          />
          <Picker
            selectedValue={tipoComunicacion}
            onValueChange={(value) => setTipoComunicacion(Number(value))}
          >
            <Picker.Item label="Correo" value={1} />
            <Picker.Item label="Videollamada" value={2} />
            <Picker.Item label="Red Social" value={4} />
            <Picker.Item label="Presencial" value={5} />
          </Picker>
          <TextInput
            style={styles.input}
            value={detalles}
            onChangeText={setDetalles}
            placeholder="Escribe los detalles..."
          />
          <TextInput
            style={styles.input}
            value={solicitud}
            onChangeText={setSolicitud}
            placeholder="Escribe la solicitud..."
          />
          <TextInput
            style={styles.input}
            value={fechaProximaCita}
            onChangeText={setFechaProximaCita}
            placeholder="Fecha de próxima cita"
          />
          <Button title="Registrar" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  formContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historialCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  historialText: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    overflow: "hidden",
  },
});
export default HistorialComunicacion;