import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";

const MarketingModule = () => {
  // JSON de clientes directamente en el script
  const [clientes] = useState([
    {
      id: 1,
      nombre: "Empresa ABC",
      email: "contacto@empresaabc.com",
      telefono: "555-1234",
      direccion: "Calle 123, Ciudad XYZ",
    },
    {
      id: 2,
      nombre: "Empresa DEF",
      email: "ventas@empresadef.com",
      telefono: "555-5678",
      direccion: "Avenida 456, Ciudad LMN",
    },
    {
      id: 3,
      nombre: "Empresa GHI",
      email: "info@empresaghi.com",
      telefono: "555-9012",
      direccion: "Boulevard 789, Ciudad OPQ",
    },
  ]);

  // Función para simular el envío de correos
  const enviarCorreo = (cliente) => {
    Alert.alert(
      "Correo Enviado",
      `Se envió una promoción a ${cliente.nombre} (${cliente.email}).`,
      [{ text: "OK" }]
    );
  };

  // Renderizar cada cliente
  const renderCliente = ({ item }) => (
    <View style={styles.clienteCard}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.detalle}>Email: {item.email}</Text>
      <Text style={styles.detalle}>Teléfono: {item.telefono}</Text>
      <Text style={styles.detalle}>Dirección: {item.direccion}</Text>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => enviarCorreo(item)}
      >
        <Text style={styles.botonTexto}>Enviar Promoción</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clientes de Marketing</Text>
      <FlatList
        data={clientes}
        renderItem={renderCliente}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  clienteCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  detalle: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  boton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  botonTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MarketingModule;
