import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from "react-native";

interface User {
    id: number;
    nombre: string;
    rol: string;
    estatus: number;
}

export default function Customers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://192.168.57.70:5055/api/Usuario/all'); 
            const data = await response.json();
            setUsers(data); 
            console.log(data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchUsers(); 
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clientes Propuestos</Text>
            <Text style={styles.subtitle}>Calificados</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <ScrollView style={styles.cardContainer}>
                    {users.map(user => (
                        <View key={user.id} style={styles.card}>
                            <Text style={styles.cardTitle}>Nombre: {user.nombre}</Text>
                            <Text style={styles.cardText}>Rol: {user.rol}</Text>
                            <Text style={styles.cardText}>Estatus: {user.estatus === 1 ? 'Activo' : 'Inactivo'}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    subtitle: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
        marginRight: 245,
    },
    cardContainer: {
        width: '100%',
    },
    card: {
        backgroundColor: '#3e3e4f',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardText: {
        color: '#fff',
        fontSize: 16,
    },
});