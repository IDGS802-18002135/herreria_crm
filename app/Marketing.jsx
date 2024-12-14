import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const Marketing = () => {
  const [clientesPotenciales, setClientesPotenciales] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState("");
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [promoDetails, setPromoDetails] = useState({
    descripcion: "",
  });
  const [vistaActual, setVistaActual] = useState("potenciales");

  const normalizeClientes = (clientes, tipo) => {
    return clientes.map((cliente) => ({
      id: tipo === "potenciales" ? cliente.clienteId : cliente.usuarioId,
      nombre:
        tipo === "potenciales"
          ? cliente.nombreCliente
          : cliente.detallesUsuario?.nombres || cliente.nombreUsuario,
      correo:
        tipo === "potenciales"
          ? cliente.correo
          : cliente.detallesUsuario?.correo || "Sin correo",
      telefono:
        tipo === "potenciales"
          ? cliente.telefono
          : cliente.detallesUsuario?.telefono || "Sin teléfono",
    }));
  };

  useEffect(() => {
    const fetchClientesPotenciales = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista"
        );
        setClientesPotenciales(normalizeClientes(response.data, "potenciales"));
      } catch (error) {
        alert("Error: No se pudieron cargar los clientes potenciales.");
      }
    };

    fetchClientesPotenciales();
  }, []);

  useEffect(() => {
    const fetchClientesFrecuentes = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/Usuario/getAllClientesCom"
        );
        setClientesFrecuentes(normalizeClientes(response.data, "frecuentes"));
      } catch (error) {
        alert("Error: No se pudieron cargar los clientes frecuentes.");
      }
    };

    fetchClientesFrecuentes();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          "https://bazar20241109230927.azurewebsites.net/api/Productos"
        );
        setProductos(response.data);
      } catch (error) {
        alert("Error: No se pudieron cargar los productos.");
      }
    };

    fetchProductos();
  }, []);

  const handleClienteSelect = (clienteId) => {
    setSelectedClientes((prev) =>
      prev.includes(clienteId)
        ? prev.filter((id) => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const handleSendPromo = async () => {
    if (!selectedProductoId || !promoDetails.descripcion || selectedClientes.length === 0) {
      alert("Error: Completa los detalles y selecciona al menos un cliente.");
      return;
    }

    const productoSeleccionado = productos.find(
      (producto) => producto.id === parseInt(selectedProductoId)
    );
    const clientesSeleccionados = (vistaActual === "potenciales"
      ? clientesPotenciales
      : clientesFrecuentes
    ).filter((cliente) => selectedClientes.includes(cliente.id));

    const emailRequest = {
      to: clientesSeleccionados.map((cliente) => cliente.correo).join(","),
      subject: `Promoción: ${productoSeleccionado.nombreProducto}`,
      productName: productoSeleccionado.nombreProducto,
      productImage: productoSeleccionado.imagenProducto,
      description: promoDetails.descripcion,
      ClientName: clientesSeleccionados.map((cliente) => cliente.nombre).join(","),
    };

    try {
      await axios.post(
        "https://bazar20241109230927.azurewebsites.net/api/email/sendPromotion",
        emailRequest
      );
      alert("Éxito: Promoción enviada exitosamente.");
      setSelectedClientes([]);
      setSelectedProductoId("");
      setPromoDetails({ descripcion: "" });
    } catch (error) {
      alert(
        `Error: ${error.response?.data || "No se pudo enviar la promoción."}`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Promociones de Marketing</Text>

      <Text style={styles.label}>Producto:</Text>
      <Picker
        selectedValue={selectedProductoId}
        onValueChange={(itemValue) => setSelectedProductoId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un producto" value="" />
        {productos.map((producto) => (
          <Picker.Item key={producto.id} label={producto.nombreProducto} value={producto.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.textarea}
        value={promoDetails.descripcion}
        onChangeText={(text) => setPromoDetails({ descripcion: text })}
        placeholder="Descripción de la promoción"
        multiline
      />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, vistaActual === "potenciales" && styles.activeTab]}
          onPress={() => setVistaActual("potenciales")}
        >
          <Text style={styles.tabText}>Clientes Potenciales</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, vistaActual === "frecuentes" && styles.activeTab]}
          onPress={() => setVistaActual("frecuentes")}
        >
          <Text style={styles.tabText}>Clientes Frecuentes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={vistaActual === "potenciales" ? clientesPotenciales : clientesFrecuentes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.clientRow,
              selectedClientes.includes(item.id) && styles.selectedClientRow,
            ]}
            onPress={() => handleClienteSelect(item.id)}
          >
            <Text style={styles.clientText}>{item.nombre}</Text>
            <Text style={styles.clientText}>{item.correo}</Text>
            <Text style={styles.clientText}>{item.telefono}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Enviar Promoción"
          onPress={handleSendPromo}
          disabled={
            selectedClientes.length === 0 || !selectedProductoId || !promoDetails.descripcion
          }
          color="#007bff"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  picker: { height: 50, marginBottom: 16 },
  textarea: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  tabs: { flexDirection: "row", marginBottom: 16 },
  tab: { flex: 1, padding: 8, alignItems: "center", borderBottomWidth: 2 },
  activeTab: { borderBottomColor: "blue" },
  tabText: { fontSize: 16 },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  selectedClientRow: {
    backgroundColor: "#cce5ff",
    borderColor: "#007bff",
  },
  clientText: { flex: 1 },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
  },
});

export default Marketing;
