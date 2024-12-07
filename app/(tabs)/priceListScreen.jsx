import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import ProductoCard from '../../components/ProductoCard';
import { agregarProducto, calcularSubtotal, generarPDF } from '../../utils/productoUtils';
import { Picker } from '@react-native-picker/picker'; // Importar Picker

export default function ProductListScreen() {
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [contenidoModal, setContenidoModal] = useState("");
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [vendedor, setVendedor] = useState("");
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);
    const [mostrarModalCotizaciones, setMostrarModalCotizaciones] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [empresas, setEmpresas] = useState([]); // Para almacenar las empresas disponibles

    // Cargar productos desde la nueva API
    useEffect(() => {
        fetch('https://bazar20241109230927.azurewebsites.net/api/Inventario/productos')
            .then((response) => response.json())
            .then((data) => {
                const productosConImagen = data.map((producto) => ({
                    ...producto,
                    imagen: producto.imagenProducto || "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp",
                }));
                setProductos(productosConImagen);
            })
            .catch((error) => {
                console.error('Error al cargar los productos:', error);
            });
    }, []);

    // Cargar lista de empresas desde la API
    useEffect(() => {
        fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista')
            .then((response) => response.json())
            .then((data) => {
                setEmpresas(data); // Guardar todas las empresas
                // Seleccionar la primera empresa por defecto, si existe
                const empresaSeleccionada = data.find(cliente => cliente.nombreEmpresa !== "Sin Empresa");
                if (empresaSeleccionada) {
                    setNombreEmpresa(empresaSeleccionada.nombreEmpresa);
                } else {
                    setNombreEmpresa("Sin Empresa");
                }
            })
            .catch((error) => {
                console.error('Error al cargar las empresas:', error);
            });
    }, []);

    // Filtrar productos por búsqueda
    const productosFiltrados = productos.filter(producto =>
        producto.nombreFabricacion.toLowerCase().includes(busqueda.toLowerCase())
    );

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
        if (productosSeleccionados.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de generar una cotización.");
            return; // Salir de la función si el carrito está vacío
        }
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
            
            {/* Campo de búsqueda */}
            <TextInput
                style={styles.input}
                placeholder="Buscar producto..."
                value={busqueda}
                onChangeText={setBusqueda}
            />

            {/* Lista de productos filtrados */}
            <FlatList
                data={productosFiltrados}
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
                            {`${p.nombreFabricacion} - Cantidad: ${p.cantidad} - Total: $${p.precio * p.cantidad}`}
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
                                    <Text style={styles.subtitle}>Productos:</Text>
            {cotizacion.productos.map((producto, idx) => (
                <Text key={idx} style={styles.productoSeleccionado}>
                    {`${producto.nombreFabricacion} - Cantidad: ${producto.cantidad} - Total: $${producto.precio * producto.cantidad}`}
                </Text>
            ))}
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
                        
                        {/* Selector de empresa */}
                        <Text style={styles.label}>Selecciona la empresa:</Text>
                        <Picker
                            selectedValue={nombreEmpresa}
                            onValueChange={(itemValue) => setNombreEmpresa(itemValue)}
                        >
                            {empresas.map((empresa, index) => (
                                <Picker.Item
                                    key={index}
                                    label={empresa.nombreEmpresa}
                                    value={empresa.nombreEmpresa}
                                />
                            ))}
                        </Picker>

                        {/* Campo para el vendedor */}
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
    label: {
        fontSize: 16,
        marginBottom: 10,
        marginTop: 20,
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        width: '80%',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    cotizacionCard: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    cotizacionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
