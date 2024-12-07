import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Modal, TextInput, TouchableOpacity } from 'react-native';

export default function ProductoCard({ producto, agregarProducto }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [cantidad, setCantidad] = useState('');

    const handleAgregarProducto = () => {
        setModalVisible(true);
    };

    const handleConfirmarCantidad = () => {
        const cantidadInt = parseInt(cantidad);
       /* if (cantidadInt > producto.cantidad) {
            alert("Cantidad no disponible.");
        } else {*/
            agregarProducto(producto.id, cantidadInt);
            setModalVisible(false);
            setCantidad('');
       // }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.name}>{producto.nombre}</Text>
            <Image source={{ uri: producto.imagen }} style={styles.imagen} />
            <Text>{producto.nombreFabricacion}</Text>
            <Text>Precio: ${producto.precio}</Text>
            <Text>Cantidad disponible: {producto.cantidad}</Text>
            <Button title="Agregar" onPress={handleAgregarProducto} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ingresa la cantidad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cantidad"
                            keyboardType="numeric"
                            value={cantidad}
                            onChangeText={setCantidad}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleConfirmarCantidad}>
                                <Text style={styles.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { padding: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
    name: { fontSize: 18, fontWeight: 'bold' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        textAlign: 'center',
    },
    imagen: {
        
        width: 50,
        height: 50,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    button: {
        flex: 1,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: { backgroundColor: '#f44336' },
    buttonText: { color: 'white', fontWeight: 'bold' },
});
