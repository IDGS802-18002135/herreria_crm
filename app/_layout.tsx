import { View, Text, TouchableOpacity, Alert, DrawerLayoutAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from '@/components/SideBar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./(tabs)/login";
import WelcomeScreen from "./(tabs)/welcome";
import ComentariosXClientes from "./(tabs)/ComentariosXClientes";
import ProductListScreen from "./(tabs)/priceListScreen";
import DashboardScreen from "./(tabs)/dashboard";
import MarketingModule from "./(tabs)/Marketing";
import {UserProvider} from "./(tabs)/UserContext";
import HistorialComunicacion from "./(tabs)/HistorialComunicacion";
import ClientesPotenciales from "./(tabs)/ClientesPotenciales";


import ClientesPotenciales from "./(tabs)/ClientesPotenciales";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import Greeting from '@/components/Greeting'; // Componente adaptado
import Logo from '@/components/Logo'; // Componente adaptado
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar íconos


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function RootLayout({ username, navigation }) {
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
  
  
  return (
    
      <>
          <UserProvider>
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
          }}
        />
        <Drawer.Screen
          name="ComentariosXClientes"
          component={ComentariosXClientes}
          options={{
            title: 'Comentarios',
          }}
        />
        <Drawer.Screen
          name="ClientesPotenciales"
          component={ClientesPotenciales}
          options={{
            title: 'Clientes Potenciales',
          }}
        />
        
        <Drawer.Screen
          name="priceListScreen"
          component={ProductListScreen}
          options={{
            title: 'Ventas',
          }}
        />
        <Drawer.Screen
          name="dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
          }}
        />
        <Drawer.Screen
          name="HistorialComunicacion"
          component={HistorialComunicacion}
          options={{
            title: 'Historial',
          }}
        />
        
        <Drawer.Screen
          name="Marketing"
          component={MarketingModule}
          options={{
            title: 'Marketing',
          }}
        />
        <Drawer.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{
            title: 'Bienvenido',
          }}
        />
        
      </Drawer.Navigator>
          </UserProvider>

        
      </>
      
      
    );}
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
  
  
