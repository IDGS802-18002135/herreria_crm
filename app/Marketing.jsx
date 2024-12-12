import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Para usar iconos (FontAwesome)

const API_URL =
  "https://bazar20241109230927.azurewebsites.net/api/Usuario/getAllEmpleados";

const MarketingModule = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombrePromocion, setNombrePromocion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [linkImagen, setLinkImagen] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [promocionCreada, setPromocionCreada] = useState(false);
  const [seleccionarClientes, setSeleccionarClientes] = useState(false);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const clientesFiltrados = data.filter(
        (empleado) => empleado.rol === "cliente"
      );
      setClientes(clientesFiltrados);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      Alert.alert("Error", "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCliente = (cliente) => {
    setClientesSeleccionados((prevSeleccionados) => {
      if (prevSeleccionados.includes(cliente.id)) {
        return prevSeleccionados.filter((id) => id !== cliente.id);
      } else {
        return [...prevSeleccionados, cliente.id];
      }
    });
  };

  const renderCliente = ({ item }) => (
    <View style={styles.clienteCard}>
      <FontAwesome name="user-circle" size={30} color="#007BFF" style={styles.icon} />
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.detalle}>Dirección: {item.direccion}</Text>
      <Text style={styles.detalle}>Correo: {item.correo}</Text>
      <Text style={styles.detalle}>Teléfono: {item.telefono}</Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => seleccionarCliente(item)}
      >
        <FontAwesome
          name={
            clientesSeleccionados.includes(item.id) ? "check-circle" : "circle-o"
          }
          size={20}
          color="#28A745"
        />
        <Text style={styles.botonTexto}>
          {" "}
          {clientesSeleccionados.includes(item.id)
            ? "Desmarcar"
            : "Marcar para Enviar"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const enviarPromocionSeleccionados = () => {
    if (clientesSeleccionados.length === 0) {
      Alert.alert("Error", "No se han seleccionado clientes.");
      return;
    }

    Alert.alert(
      "Confirmación",
      `¿Deseas enviar la promoción "${nombrePromocion}" a los clientes seleccionados?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            Alert.alert(
              "Éxito",
              `Promoción "${nombrePromocion}" enviada a ${clientesSeleccionados.length} cliente(s).`
            );
            setClientesSeleccionados([]); // Limpiar la selección
          },
        },
      ]
    );
  };

  const enviarPromocionATodos = () => {
    Alert.alert(
      "Confirmación",
      `¿Deseas enviar la promoción "${nombrePromocion}" a todos los clientes?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            Alert.alert(
              "Éxito",
              `Promoción "${nombrePromocion}" enviada a ${clientes.length} cliente(s).`
            );
          },
        },
      ]
    );
  };

  return promocionCreada ? (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seleccionar Clientes</Text>
      <TouchableOpacity
        style={styles.botonSeleccion}
        onPress={() => setSeleccionarClientes(!seleccionarClientes)}
      >
        <Text style={styles.botonTexto}>
          {seleccionarClientes ? "Enviar a Todos" : "Seleccionar Clientes"}
        </Text>
      </TouchableOpacity>

      {seleccionarClientes && (
        <FlatList
          data={clientes}
          renderItem={renderCliente}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay clientes disponibles.</Text>
          }
        />
      )}

      {/* Si no estamos en modo selección, mostramos el botón de "Enviar a Todos" */}
      {!seleccionarClientes && !loading && (
        <TouchableOpacity
          style={styles.botonEnviar}
          onPress={enviarPromocionATodos}
        >
          <Text style={styles.botonTexto}>Enviar a Todos</Text>
        </TouchableOpacity>
      )}

      {/* Solo mostramos el botón para enviar a clientes seleccionados si hay selección */}
      {clientesSeleccionados.length > 0 && (
        <TouchableOpacity
          style={styles.botonEnviar}
          onPress={enviarPromocionSeleccionados}
        >
          <Text style={styles.botonTexto}>
            Enviar Promoción ({clientesSeleccionados.length} seleccionados)
          </Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#007BFF" />}
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear Promoción</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la promoción"
        value={nombrePromocion}
        onChangeText={setNombrePromocion}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Link de la imagen"
        value={linkImagen}
        onChangeText={setLinkImagen}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de vencimiento"
        value={fechaVencimiento}
        onChangeText={setFechaVencimiento}
      />

      <TouchableOpacity
        style={styles.botonCrear}
        onPress={() => setPromocionCreada(true)}
      >
        <Text style={styles.botonTexto}>Crear Promoción</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#007BFF",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    backgroundColor: "#FFF",
  },
  botonCrear: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  botonSeleccion: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  botonEnviar: {
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  botonTexto: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  clienteCard: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detalle: {
    fontSize: 12,
    color: "#666",
  },
  boton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#E1F5FE",
    borderRadius: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default MarketingModule;
