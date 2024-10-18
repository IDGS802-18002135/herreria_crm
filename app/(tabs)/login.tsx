import ImageViewer from '@/components/ImageViewer';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';

const Login = () => {
  const [isRememberMe, setIsRememberMe] = useState(false);
  const PlaceholderImage =require('@/assets/images/image.png');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.formLogin}>Login</Text>
        <ImageViewer imgSource={PlaceholderImage}   selectedImage={selectedImage}/>
        <View style={styles.inputBox}>
          <TextInput
          
            placeholder="Usuario"
            placeholderTextColor="#333"
            style={styles.input}
            keyboardType="default"
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
          
            placeholder="Contraseña"
            placeholderTextColor="#333"
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.rememberForgot}>
          <View style={styles.checkboxLabel}>
            <Switch
              value={isRememberMe}
              onValueChange={setIsRememberMe}
              thumbColor={isRememberMe ? "#fff" : "#ccc"}
            />
            <Text style={styles.checkboxText}>Remember Me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => {}}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height:'100%',
    backgroundColor: '#FFFFFFFF', // Usar una biblioteca para linear-gradient si lo necesitas
    color: '#333',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 40,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  formLogin: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputBox: {
    marginVertical: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderColor: '#333',
    borderWidth: 2,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 20,
  },
  rememberForgot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkboxLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    color: '#333',
    marginLeft: 10,
  },
  link: {
    color: '#333',
    textDecorationLine: 'none',
  },
  btn: {
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
