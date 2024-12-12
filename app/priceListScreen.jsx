import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Button, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import ProductoCard from '../components/ProductoCard';
import { agregarProducto, calcularSubtotal, generarPDF } from '../utils/productoUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Importar Picker
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native'; 
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  
export default function ProductListScreen() {
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [contenidoModal, setContenidoModal] = useState("");
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [idEmpresa, setIdEmpresa] = useState("");
    const [empresa, setEmpresa] = useState(null);
    
    const [vendedor, setVendedor] = useState("");
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);
    const [mostrarModalCotizaciones, setMostrarModalCotizaciones] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [empresas, setEmpresas] = useState([]); // Para almacenar las empresas disponibles
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        // Listener para manejar la interacción con la notificación
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            console.log('Notificación interactuada con data:', data);

            // Redirigir al módulo correspondiente
            if (data.screen) {
                navigation.navigate(data.screen, { id: data.id }); // Pasa parámetros si es necesario
            }
        });

        // Limpia el listener cuando el componente se desmonte
        return () => subscription.remove();
    }, []);

    const getStatusLabel = (status) => {
        const statusLabels = {
          0: 'Pendiente',
          1: 'Aprobada',
          2: 'Rechazada',
        };
        return statusLabels[status] || 'Desconocido';
      };

  useEffect(() => {
    const getUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('userData');
      console.log(storedUserData)
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
        
      }
    };

    getUserData();
  }, []);
  //guardar cotizacion 
    // Cargar productos desde la nueva API
    useEffect(() => {
        fetch('http://192.168.0.108:5055/api/Inventario/productos')
            .then((response) => response.json())
            .then((data) => {
                const productosConImagen = data.map((producto) => ({
                    ...producto,
                    imagen: producto.imagenProducto || "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp",
                }));
                console.log("PRODUCTOS: ",data);
                setProductos(productosConImagen);
            })
            .catch((error) => {
                
                console.error('Error al cargar los productos:', error);
            });
    }, []);
    //cargarCotizaciones 
    const cargarCotizaciones = async () => {
        try {
            console.log("AAAAAAAAAAAAAAAAA");
            const response = await fetch('http://192.168.0.108:5055/api/Cotizaciones/getAll');

            if (response.ok) {
                const data = await response.json();
                setCotizacionesPendientes(data);
                console.log("cotizaciones pendientes data",data);
            } else {
                console.log('Error al cargar las cotizaciones:', response.status);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    
    useEffect(() => {
        cargarCotizaciones();
    }, []);

    // Cargar lista de empresas desde la API
    useEffect(() => {
        fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista')
            .then((response) => response.json())
            .then((data) => {
                setEmpresas(data); // Guardar todas las empresas
                // Seleccionar la primera empresa por defecto, si existe
                const empresaSeleccionada = data.find(cliente => cliente.nombreEmpresa !== "Sin Empresa");
                console.log(empresas);
                if (empresaSeleccionada) {
                    setNombreEmpresa(empresaSeleccionada.nombreEmpresa);
                    setEmpresa(empresaSeleccionada);
                    setIdEmpresa(empresaSeleccionada.empresaId);
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
    const cambiarStatusCotizacion=async()=>{

    }

     const guardarCotizacion = async () => {
        console.log('Guardando ',empresa.empresaId);
        console.log('Guardando ',empresa.clienteId);
        console.log('Guardando ',userData.nombre);
        console.log('Guardando ',productosSeleccionados.reduce((total, producto) => 
            total + producto.precio * producto.cantidad, 0));
        console.log("Guardando",productosSeleccionados.map((producto) => ({
            inventarioProductoId: producto.id,  // ID del producto
            cantidad: producto.cantidad,  // Cantidad del producto
            precioUnitario: producto.precio,  // Precio unitario del producto
            costo: producto.precio * producto.cantidad})));
        
        console.log('Guardando ',productosSeleccionados);
        const nuevaCotizacion = {
            empresaID: empresa.empresaId,  // Asignar un valor válido
            clienteID: empresa.clienteId,  // Asignar un valor válido
            vendedor: userData.nombre,
            idVendedor: userData.id,  // Asignar el ID del vendedor
            total: productosSeleccionados.reduce((total, producto) => 
                total + producto.precio * producto.cantidad, 0),  // Calcular el total de la cotización
            detalleCotizacions: productosSeleccionados.map((producto) => ({  // Cambiado a detalleCotizacions
                inventarioProductoId: producto.id,  // ID del producto
                cantidad: producto.cantidad,  // Cantidad del producto
                precioUnitario: producto.precio,  // Precio unitario del producto
                costo: producto.precio * producto.cantidad  // Costo total del producto
            }))
        };
        console.log('Guardando cotización con los siguientes datos:', nuevaCotizacion);

        try {
            console.log('queeeee');
            // Llamada POST para guardar la cotización
            const response = await fetch('http://192.168.0.108:5055/api/Cotizaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaCotizacion),
            });
    
            if (response.ok) {
                alert('Cotización guardada exitosamente.');
                // Actualizar la lista de cotizaciones después de guardar
                cargarCotizaciones();
            } else {
                console.error('Error al guardar la cotización:', response);
                alert('Ocurrió un error al guardar la cotización.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error de red al intentar guardar la cotización.');
        }
    };
    
    const handleGenerarPDF = () => {
        if (productosSeleccionados.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de generar una cotización.");
            return; // Salir de la función si el carrito está vacío
        }
         
        generarPDF(productosSeleccionados, nombreEmpresa, vendedor, calcularSubtotal);
        setProductosSeleccionados([]); // Limpia el carrito al generar la cotización
        setMostrarLista(false);
        setMostrarModalDatos(false);
        
    };
    const handleGuardarCotizacion=()=>{
        if (productosSeleccionados.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de generar una cotización.");
            return; // Salir de la función si el carrito está vacío
        }
        guardarCotizacion();
        setProductosSeleccionados([]); // Limpia el carrito al generar la cotización
        setMostrarLista(false);
        setMostrarModalDatos(false);
    }
    
    const autorizarCotizacion = (cotizacionId) => {
        const cotizacionAutorizada = cotizacionesPendientes.find(c => c.cotizacionId === cotizacionId);
        if (cotizacionAutorizada) {
            // Actualizar estado de la cotización
            cotizacionAutorizada.status = 1; // Por ejemplo, 1 para "autorizada"
            console.log("Cotización enviada a producción:", cotizacionAutorizada);
            alert("Cotización enviada a producción");
            // Second, call scheduleNotificationAsync()
   Notifications.scheduleNotificationAsync({
    content: {
        title: '¡Cotización Autorizada!',
        body: `La cotización con ID ${cotizacionId} ha sido enviada a producción.`,
        data: { screen: 'planificacion', id: cotizacionId }
    },
    trigger: null,
  });
            // Si trabajas con un estado global o useState, actualiza la lista
            /*setCotizacionesPendientes(prevState =>
                prevState.filter(c => c.cotizacionId !== cotizacionId)
            );*/
            // Opcional: añade la cotización a otra lista, como "cotizacionesAutorizadas"
        } else {
            console.warn("No se encontró la cotización con el ID:", cotizacionId);
            alert("Ha ocurrido algo inesperado favor de contactar con su administrador");
        }
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
                <Text style={styles.cotizacionTitle}>
                  Empresa: {cotizacion.nombreEmpresa}
                </Text>
                <Text style={styles.cotizacionTitle}>
                  Vendedor: {cotizacion.vendedor+" "+cotizacion.apellidoPaternoVendedor+" "+cotizacion.apellidoMaternoVendedor}
                </Text>
                <Text style={styles.cotizacionTitle}>
                  Fecha: {cotizacion.fecha}
                </Text>
                <Text style={styles.cotizacionTitle}>
                  Total: ${cotizacion.total}
                </Text>
                <Text style={styles.cotizacionTitle}>
                    Estatus: {getStatusLabel(cotizacion.status)}
                </Text>
                {cotizacion.detalleCotizacions.map((producto, idx) => (
                  <Text key={idx} style={styles.productoSeleccionado}>
                    {`Producto: ${producto.nombreProducto} - Cantidad: ${producto.cantidad} - Precio Unitario: $${producto.precioUnitario} `}
                  </Text>
                ))}

                <Button
                  title="Autorizar"
                  color="#4CAF50"
                  onPress={() => autorizarCotizacion(cotizacion.cotizacionId)}
                />
              </View>
            ))}
          </ScrollView>
          <Button
            title="Cerrar"
            onPress={() => setMostrarModalCotizaciones(false)}
            color="#f44336"
          />
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
                            editable={false}
                            
                            value={userData?.nombre || ''}
                            
                        />
                        
                        <View style={styles.buttonContainer}>
                            <Button title="Generar PDF" onPress={handleGenerarPDF} color="#4CAF50" />
                            <Button title="Guardar Cotizacion" onPress={handleGuardarCotizacion} color="#4CAF50" />
                            
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            
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
