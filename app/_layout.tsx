import { View, Text, TouchableOpacity, Alert, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from '@/components/SideBar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./login";
import WelcomeScreen from "./(tabs)/welcome";
import ComentariosXClientes from "./ComentariosXClientes";
import ProductListScreen from "./priceListScreen";
import DashboardScreen from "./dashboard";
import MarketingModule from "./Marketing";
import { UserProvider } from "./UserContext";
import HistorialComunicacion from "./HistorialComunicacion";
import ClientesPotenciales from "./ClientesPotenciales";
import CalcularTiempoProduccion from "./planificacion";

import { createDrawerNavigator,  } from '@react-navigation/drawer';
import {Drawer} from 'expo-router/drawer'
import { StyleSheet } from 'react-native';
import Greeting from '@/components/Greeting'; // Componente adaptado
import Logo from '@/components/Logo'; // Componente adaptado
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar íconos

import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import CustomDrawer from '@/components/CustomDrawer';

const Stack = createNativeStackNavigator();
const DrawerNavigator = createDrawerNavigator();

export default function RootLayout({ username,  }) {
  const handleLogout = async () => {
    
    try {
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
            onPress: async () => {
              // Borrar datos de AsyncStorage
              await AsyncStorage.removeItem('userData');  // Ejemplo de eliminar una clave específica
              // o si quieres borrar todos los datos de AsyncStorage
              // await AsyncStorage.clear();
              
              console.log("");
              Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al eliminar datos de AsyncStorage:', error);
    }
  };

  return (
    <>
      <UserProvider>
        <Drawer screenOptions={{
            drawerStyle: {
              backgroundColor: '#343a40',
            },
            drawerLabelStyle: { color: '#fff' },
          }}
          >
            
        <Drawer.Screen
            name="login"
            
            options={{
              drawerLabel:"Login",
              drawerIcon: () => <Icon name="sign-in" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="+not-found"
            
            options={{
              drawerLabel:"NOT FOUND",
              drawerIcon: () => <Icon name="sign-in" size={24} color="#fff" />,
            }}
          />
        </Drawer>


    {/*
      
      
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: '#343a40',
            },
            drawerLabelStyle: { color: '#fff' },
          }}
          initialRouteName="login"
        >
         
          <Drawer.Screen
            name="login"
            component={Login}
            options={{
              title: 'Login',
              drawerIcon: () => <Icon name="sign-in" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="planificacion"
            component={CalcularTiempoProduccion}
            options={{
              title: 'Planificación',
              drawerIcon: () => <Icon name="calendar" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="ComentariosXClientes"
            component={ComentariosXClientes}
            options={{
              title: 'Comentarios de clientes',
              drawerIcon: () => <Icon name="comment" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="ClientesPotenciales"
            component={ClientesPotenciales}
            options={{
              title: 'Clientes Potenciales',
              drawerIcon: () => <Icon name="user" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="priceListScreen"
            component={ProductListScreen}
            options={{
              title: 'Ventas y cotización',
              drawerIcon: () => <Icon name="tags" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="dashboard"
            component={DashboardScreen}
            options={{
              title: 'Dashboard',
              drawerIcon: () => <Icon name="tachometer" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="HistorialComunicacion"
            component={HistorialComunicacion}
            options={{
              title: 'Historial de comunicación',
              drawerIcon: () => <Icon name="history" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="Marketing"
            component={MarketingModule}
            options={{
              title: 'Marketing',
              drawerIcon: () => <Icon name="bullhorn" size={24} color="#fff" />,
            }}
          />
          <Drawer.Screen
            name="welcome"
            component={WelcomeScreen}
            options={{
              title: 'Bienvenido',
              drawerIcon: () => <Icon name="home" size={24} color="#fff" />,
            }}
          />
          
          
        </Drawer.Navigator>
        */} 
      </UserProvider>
      
    </>
  );
}

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
    padding: 10,
    backgroundColor: '#e74c3c',
    marginTop: 0,
    borderRadius: 50,
    width: '100%', // Asegura que el botón ocupe el 100% del ancho
  height: 50, // Opcional: establece una altura específica
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
