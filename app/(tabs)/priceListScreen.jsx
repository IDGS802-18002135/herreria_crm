import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import ProductoCard from '../../components/ProductoCard';
import { agregarProducto, calcularSubtotal, generarPDF } from '../../utils/productoUtils';

const productosIniciales = [
    { id: 1, nombre: "Puerta de hierro", precio: 1500, cantidad: 5, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 2, nombre: "Reja de ventana", precio: 800, cantidad: 10, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 3, nombre: "Barandal de escalera", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 4, nombre: "Reja", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" },
    { id: 5, nombre: "Escalera", precio: 1200, cantidad: 8, imagen: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp" }
];

export default function ProductListScreen() {
    const [productos, setProductos] = useState(productosIniciales);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [contenidoModal, setContenidoModal] = useState("");
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [vendedor, setVendedor] = useState("");
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);
    const [mostrarModalCotizaciones, setMostrarModalCotizaciones] = useState(false);

    const handleAgregarProducto = (productoId, cantidad) => {
        agregarProducto(productoId, cantidad, productos, setProductos, setProductosSeleccionados);
    };

    const guardarCotizacion = () => {
        const nuevaCotizacion = {
            id: cotizacionesPendientes.length + 1,
            nombreEmpresa,
            vendedor,
            productos: productosSeleccionados,
            subtotal: calcularSubtotal(productosSeleccionados),
            fecha: new Date().toLocaleDateString(),
        };
        setCotizacionesPendientes([...cotizacionesPendientes, nuevaCotizacion]);
    };

    const handleGenerarPDF = () => {
        generarPDF(productosSeleccionados, nombreEmpresa, vendedor, calcularSubtotal);
        guardarCotizacion();
        setProductosSeleccionados([]); // Limpia el carrito al generar la cotización
        setMostrarLista(false);
        setMostrarModalDatos(false);
    };

    const autorizarCotizacion = (cotizacionId) => {
        const cotizacionAutorizada = cotizacionesPendientes.find(c => c.id === cotizacionId);
        if (cotizacionAutorizada) {
            console.log("Cotización enviada a producción:", cotizacionAutorizada);
        }
        setCotizacionesPendientes(cotizacionesPendientes.filter(c => c.id !== cotizacionId));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Productos</Text>
            <FlatList
                data={productos}
                renderItem={({ item }) => (
                    <ProductoCard producto={item} agregarProducto={handleAgregarProducto} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setMostrarLista(!mostrarLista)}
            >
                <Text style={styles.toggleButtonText}>
                    {mostrarLista ? "Ocultar Carrito" : "Ver Carrito"}
                </Text>
            </TouchableOpacity>

            {mostrarLista && (
                <View style={styles.listaSeleccionados}>
                    <Text style={styles.subtitle}>Productos Seleccionados:</Text>
                    {productosSeleccionados.map((p, index) => (
                        <Text key={index} style={styles.productoSeleccionado}>
                            {`${p.nombre} - Cantidad: ${p.cantidad} - Total: $${p.precio * p.cantidad}`}
                        </Text>
                    ))}
                    <Text style={styles.subtotal}>Subtotal: ${calcularSubtotal(productosSeleccionados)}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Finalizar Compra" onPress={() => setMostrarModalDatos(true)} color="#4CAF50" />
                        <Button title="Generar Cotización" onPress={() => setMostrarModalDatos(true)} color="#2196F3" />
                    </View>
                </View>
            )}

            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setMostrarModalCotizaciones(true)}
            >
                <Text style={styles.toggleButtonText}>Ver Cotizaciones Pendientes</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={mostrarModalCotizaciones}
                onRequestClose={() => setMostrarModalCotizaciones(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalText}>Cotizaciones Pendientes:</Text>
                            {cotizacionesPendientes.map((cotizacion, index) => (
                                <View key={index} style={styles.cotizacionCard}>
                                    <Text style={styles.cotizacionTitle}>Empresa: {cotizacion.nombreEmpresa}</Text>
                                    <Text>Vendedor: {cotizacion.vendedor}</Text>
                                    <Text>Subtotal: ${cotizacion.subtotal}</Text>
                                    <Text>Fecha: {cotizacion.fecha}</Text>
                                    <Button 
                                        title="Autorizar"
                                        color="#4CAF50"
                                        onPress={() => autorizarCotizacion(cotizacion.id)}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                        <Button title="Cerrar" onPress={() => setMostrarModalCotizaciones(false)} color="#f44336" />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={mostrarModalDatos}
                onRequestClose={() => setMostrarModalDatos(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Ingrese los datos:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la Empresa"
                            value={nombreEmpresa}
                            onChangeText={setNombreEmpresa}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del Vendedor"
                            value={vendedor}
                            onChangeText={setVendedor}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Generar PDF" onPress={handleGenerarPDF} color="#4CAF50" />
                            <Button title="Cancelar" onPress={() => setMostrarModalDatos(false)} color="#f44336" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listaSeleccionados: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    productoSeleccionado: {
        fontSize: 16,
        marginVertical: 5,
    },
    subtotal: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    toggleButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    toggleButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalText: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    cotizacionCard: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    cotizacionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});