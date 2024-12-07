import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Greeting = ({ username }) => {
    const currentHour = new Date().getHours();
    let greeting = 'Hola';

    if (currentHour < 12) {
        greeting = 'Buenos días';
    } else if (currentHour < 18) {
        greeting = 'Buenas tardes';
    } else {
        greeting = 'Buenas noches';
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greetingText}>
                {greeting}, {username}.
            </Text>
            <Text style={styles.timeText}>
                Son las {new Date().toLocaleTimeString()}.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    greetingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
    },
});

export default Greeting;
