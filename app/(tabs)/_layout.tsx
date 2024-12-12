import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import WelcomeScreen from "./welcome";

export default function TabLayout() {
  return (
    <Tabs
      
    
    
    
    
    
    
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
}
