import { useState } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Tabs
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
          ),
        }}
      />
    </Tabs>
  );
}