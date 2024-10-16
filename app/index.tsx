import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
   /* @tutinfo This used to say: "Edit app/index.tsx to edit this screen.". Now it says: "Hello world!". */
  return (
    <View style={styles.container}>
     
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
