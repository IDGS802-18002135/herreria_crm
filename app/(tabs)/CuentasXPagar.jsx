import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function CuentasXPagar() {
  const [cotizaciones, setCotizaciones] = useState([
    {
      id: 1,
      nombreEmpresa: "Forja Creativa",
      vendedor: "Ana Gómez",
      fecha: "2024-12-03",
      subtotal: 5800.0,
      productos: [
        { id: 1, nombre: "Barandal de acero", cantidad: 2, precio: 2500 },
        { id: 2, nombre: "Puerta de herrería", cantidad: 1, precio: 800 },
      ],
    },
    {
      id: 2,
      nombreEmpresa: "Diseños en Acero SA",
      vendedor: "Carlos Pérez",
      fecha: "2024-12-01",
      subtotal: 7300.0,
      productos: [
        { id: 1, nombre: "Escalera de caracol", cantidad: 1, precio: 5000 },
        { id: 2, nombre: "Ventanas de hierro forjado", cantidad: 4, precio: 575 },
      ],
    },
    {
      id: 3,
      nombreEmpresa: "Arte en Metal",
      vendedor: "Lucía Rodríguez",
      fecha: "2024-11-29",
      subtotal: 4900.0,
      productos: [
        { id: 1, nombre: "Reja de seguridad", cantidad: 3, precio: 1000 },
        { id: 2, nombre: "Mesa de centro de hierro", cantidad: 1, precio: 1900 },
      ],
    },
  ]);

  const [visibleCotizaciones, setVisibleCotizaciones] = useState({}); // Controla la visibilidad de los detalles

  // Alterna la visibilidad de los detalles de una cotización
  const toggleVisibility = (id) => {
    setVisibleCotizaciones((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cuentas por Pagar</Text>

      {cotizaciones.map((cotizacion) => (
        <View key={cotizacion.id} style={styles.cotizacionContainer}>
          <Text style={styles.subtitle}>Detalles de la Cotización</Text>
          <Text style={styles.text}>Empresa: {cotizacion.nombreEmpresa}</Text>
          <Text style={styles.text}>Vendedor: {cotizacion.vendedor}</Text>
          <Text style={styles.text}>Fecha: {cotizacion.fecha}</Text>
          <Text style={styles.text}>Subtotal: ${cotizacion.subtotal.toFixed(2)}</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => toggleVisibility(cotizacion.id)}
          >
            <Text style={styles.buttonText}>
              {visibleCotizaciones[cotizacion.id] ? "Ocultar Detalles" : "Ver Detalles"}
            </Text>
          </TouchableOpacity>

          {visibleCotizaciones[cotizacion.id] && (
            <>
              <Text style={styles.subtitle}>Productos:</Text>
              <FlatList
                data={cotizacion.productos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.productItem}>
                    <Text style={styles.productText}>
                      {item.nombre} - Cantidad: {item.cantidad} - Subtotal: ${(
                        item.precio * item.cantidad
                      ).toFixed(2)}
                    </Text>
                  </View>
                )}
              />
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#555",
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  cotizacionContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  productItem: {
    marginVertical: 5,
  },
  productText: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
