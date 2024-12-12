<<<<<<< HEAD
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import WelcomeScreen from "./welcome";
=======
import { useState } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
>>>>>>> 7dd9d2610d1d8831b20b05494c3465f2b70bca56

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Tabs
<<<<<<< HEAD
      
    
    
    
    
    
    
    //initialRouteName="login" // Ahora apunta a la pantalla 'login'
      
      
      
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="welcome"
        
        options={{
          
          title: "Welcome",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
=======
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
      {!isAuthenticated && (
        <Tabs.Screen
          name="login"
          options={{
            title: 'Login',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'log-in' : 'log-in-outline'} color={color} size={24} />
            ),
          }}
        />
      )}
      
      {isAuthenticated && (
        <Tabs.Screen
          name="welcome"
          options={{
            title: 'Welcome',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'hand-sharp' : 'hand-outline'} color={color} size={24} />
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="ClientesPotenciales"
        options={{
          title: 'Potenciales',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people-sharp' : 'people-outline'} color={color} size={24} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="priceListScreen"
        options={{
          title: 'Lista Precios',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pricetag-sharp' : 'pricetag-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="customer"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="planificacion"
        options={{
          title: 'Planificación',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={24} />
>>>>>>> 7dd9d2610d1d8831b20b05494c3465f2b70bca56
          ),
        }}
      />
        <Tabs.Screen
          name="test"
          
          options={{
            headerShown: false,  
            title: "Notificaciones",
            headerShadowVisible: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "notifications-sharp" : "notifications-outline"}
                color={color}
                size={24}
              />
            ),
          }}/>
      {/*
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
          tabBarStyle: { display: "none" }, // Oculta la barra de navegación
          headerShown: false, // Oculta el encabezado
        }}
      />
      <Tabs.Screen
        name="welcome"
        
        options={{
          
          title: "Welcome",
          headerShadowVisible: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "information-circle"
                  : "information-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />*/ }
    </Tabs>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 7dd9d2610d1d8831b20b05494c3465f2b70bca56
