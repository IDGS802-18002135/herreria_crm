import { Stack } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';

import Login from "./(tabs)/login";
import WelcomeScreen from "./(tabs)/welcome";

export default function RootLayout() {

  return (
    <>
      <Stack>
      <Stack.Screen name="(tabs)" options={{title:' ',headerShown:false}}/>
      <Stack.Screen name="+not-found"/>
      
    </Stack>



    </>
      );
}
