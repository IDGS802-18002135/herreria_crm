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
    //const [idEmpresa, setIdEmpresa] = useState("");
    const [empresa, setEmpresa] = useState(null);
    const [empresas, setEmpresas] = useState([]); // Lista de empresas
    const [idEmpresaSeleccionada, setIdEmpresaSeleccionada] = useState(null); // ID de la empresa seleccionada
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null); // Objeto completo de la empresa seleccionada

    
    const [vendedor, setVendedor] = useState("");
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);
    const [mostrarModalCotizaciones, setMostrarModalCotizaciones] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        // Listener para manejar la interacción con la notificación
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            
            setMostrarModalCotizaciones(false);
            setMostrarModalDatos(false);
            // Redirigir al módulo correspondiente
            
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
        fetch('https://bazar20241109230927.azurewebsites.net/api/Inventario/productos')
            .then((response) => response.json())
            .then((data) => {
                const productosConImagen = data.map((producto) => ({
                    ...producto,
                    imagen: producto.imagen || "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp",
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
            const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/Cotizaciones/getAll');

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
    
    // Cargar las empresas desde la API
    useEffect(() => {
        fetch('https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/vista')
            .then((response) => response.json())
            .then((data) => {
                setEmpresas(data);

                // Seleccionar la primera empresa válida por defecto
                if (data.length > 0) {
                    const empresaPorDefecto = data[0];
                    setIdEmpresaSeleccionada(empresaPorDefecto.empresaId);
                    setEmpresaSeleccionada(empresaPorDefecto);
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
    const handleEmpresaChange = (idEmpresa) => {
        setIdEmpresaSeleccionada(idEmpresa);

        // Buscar la empresa seleccionada por su ID
        const seleccionada = empresas.find((empresa) => empresa.empresaId === idEmpresa);
        setEmpresaSeleccionada(seleccionada || null);
    };
    const cambiarStatusCotizacion = async (cotizacion, nuevoStatus) => {
        try {
            // Verificar si la cotización ya está autorizada
            if (cotizacion.status === 1) {
                alert(`La cotización ${cotizacion.cotizacionId} ya está autorizada y no se puede autorizar nuevamente.`);
                return;
            }
    
            const url = `https://bazar20241109230927.azurewebsites.net/api/Cotizaciones/${cotizacion.cotizacionId}/status`;
    
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoStatus),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al cambiar el estado: ${errorText}`);
            }
    
            const data = await response.text();
            console.log('Estado actualizado:', data);
            alert(`Estado de la cotización ha cambiado a ${getStatusLabel(nuevoStatus)}`);
    
            // Si el nuevo estado es "Autorizado" (1), registrar la venta
            if (nuevoStatus === 1) {
                await registrarVenta(cotizacion);
            }
        } catch (error) {
            console.error('Error al cambiar el estado:', error);
            alert(`Hubo un error al cambiar el estado: ${error.message}`);
        }
    };
    const registrarVenta = async (cotizacion) => {
        try {
            // Construir la URL del endpoint
            const url = 'https://bazar20241109230927.azurewebsites.net/api/Venta/PostVenta';
    
            // Transformar los datos de la cotización al formato esperado por el endpoint
            const ventaData = {
                folio: `COT-${cotizacion.cotizacionId}`, // Usamos el ID de la cotización como folio
                usuarioId: cotizacion.idVendedor, // ID del vendedor que autorizó
                detallesVenta: cotizacion.detalleCotizacions.map((detalle) => ({
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario,
                    inventarioProductoId: detalle.inventarioProductoId,
                    clientePotencialDescuento: 0, // Puedes ajustar esto según sea necesario
                })),
            };
    
            // Realizar la solicitud POST al endpoint
            const response = await fetch(url, {
                method: 'POST', // Método HTTP POST
                headers: {
                    'Content-Type': 'application/json', // Indicar que enviamos JSON
                },
                body: JSON.stringify(ventaData), // Convertir el objeto a JSON
            });
    
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al registrar la venta: ${errorText}`);
            }
    
            const data = await response.json(); // Leer la respuesta del servidor
            console.log('Venta registrada exitosamente:', data);
            cargarCotizaciones();
    
            // Notificar al usuario
            alert(`La venta con folio ${ventaData.folio} ha sido registrada exitosamente.`);
        } catch (error) {
            console.error('Error al registrar la venta:', error);
            alert(`Hubo un error al registrar la venta: ${error.message}`);
        }
    };
     const guardarCotizacion = async () => {
        
     
        
        console.log('Guardando ',productosSeleccionados.reduce((total, producto) => 
            total + producto.precio * producto.cantidad, 0));
        console.log("Guardando",productosSeleccionados.map((producto) => ({
            inventarioProductoId: producto.id,  // ID del producto
            cantidad: producto.cantidad,  // Cantidad del producto
            precioUnitario: producto.precio,  // Precio unitario del producto
            costo: producto.precio * producto.cantidad})));
        
        console.log(empresaSeleccionada)
        const nuevaCotizacion = {
            empresaID: empresaSeleccionada.empresaId,  // Asignar un valor válido
            clienteID: empresaSeleccionada.clienteId,  // Asignar un valor válido
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
            const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/Cotizaciones', {
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
    
    const handleGenerarPDF = (cotizacion) => {
        /* if (productosSeleccionados.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de generar una cotización.");
            return; // Salir de la función si el carrito está vacío
        }*/
         
       // generarPDF(productosSeleccionados, nombreEmpresa, vendedor, calcularSubtotal);
       
       generarPDF(cotizacion);
        
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
                title="Autorizar registrar venta"
                color={cotizacion.status === 1 ? '#CCCCCC' : '#4CAF50'} // Color diferente si está deshabilitado
                disabled={cotizacion.status === 1}
                onPress={() => cambiarStatusCotizacion(cotizacion, 1)}
                />
                <Button
                title="Rechazar"
                color={ 'red'} // Color diferente si está deshabilitado
                disabled={cotizacion.status === 2||cotizacion.status === 1}
                onPress={() =>   cambiarStatusCotizacion(cotizacion, 2)}
                />
                 <Button style={{ marginTop: 50 }}
                title="Generar PDF"
                
                color={'blue'} // Color diferente si está deshabilitado
                
                onPress={() => handleGenerarPDF(cotizacion)}
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
                selectedValue={idEmpresaSeleccionada}
                onValueChange={handleEmpresaChange} // Usamos el ID como value
            >
                {empresas.map((empresa) => (
                    <Picker.Item
                        key={empresa.empresaId}
                        label={empresa.nombreEmpresa}
                        value={empresa.empresaId} // ID de la empresa como valor
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
