import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = () => {
    return (
        <View style={styles.logoContainer}>
            <Image 
                source={require('@/assets/images/image.png')} // Ruta del logo
                style={styles.logoImage} 
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    logoImage: {
        width: 100, // Ajusta el tamaño según sea necesario
        height: 100,
    },
});

export default Logo;
