import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar íconos
import { useNavigation } from '@react-navigation/native'; // Para navegación
import Greeting from './Greeting'; // Componente adaptado
import Logo from './Logo'; // Componente adaptado

const Sidebar = ({ username, navigation }) => {
    const drawerRef = useRef(null); // Referencia al DrawerLayoutAndroid

    // Función para cerrar sesión
    const handleLogout = () => {
        Alert.alert(
            '¿Estás seguro?',
            '¿Quieres cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Salir',
                    onPress: () => {
                        navigation.navigate('Login');
                        Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Contenido del menú de la sidebar
    const navigationView = (
        <View style={styles.sidebar}>
            <View style={styles.header}>
                <Logo />
                <Text style={styles.brandName}>Soldaline</Text>
            </View>
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Dashboard')}>
                    <Icon name="tachometer" style={styles.icon} size={20} />
                    <Text style={styles.menuText}>Dashboard</Text>
                </TouchableOpacity>
                {/* Agrega las demás opciones del menú aquí */}
            </View>
            <View style={styles.footer}>
                <Greeting username={username} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="sign-out" style={styles.icon} size={20} />
                    <Text style={styles.menuText}>Salir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <DrawerLayoutAndroid
            ref={drawerRef}
            drawerWidth={250}
            drawerPosition="left"
            renderNavigationView={() => navigationView}
        >
            {/* El contenido principal se cargará según la navegación */}
            <View style={styles.container}>
                <TouchableOpacity style={styles.toggleButton} onPress={() => drawerRef.current.openDrawer()}>
                    <Icon name="bars" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.contentText}>Bienvenido a la pantalla principal.</Text>
            </View>
        </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    contentText: {
        fontSize: 18,
        textAlign: 'center',
    },
    sidebar: {
        flex: 1,
        backgroundColor: '#343a40',
        padding: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    brandName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menu: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        color: '#fff',
        marginRight: 10,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default Sidebar;
