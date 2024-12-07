import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalcularTiempoProduccion = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [historialProduccion, setHistorialProduccion] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://192.168.0.108:5055/api/Productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
        Alert.alert('Error', 'No se pudo cargar la lista de productos');
      }
    };
    fetchProductos();
  }, []);

  // Cargar el historial desde AsyncStorage
  useEffect(() => {
    const loadHistorial = async () => {
      try {
        const storedHistorial = await AsyncStorage.getItem('historialProduccion');
        if (storedHistorial) {
          setHistorialProduccion(JSON.parse(storedHistorial));
        }
      } catch (error) {
        console.error('Error loading historial:', error);
      }
    };
    loadHistorial();
  }, []);

  // Guardar el historial en AsyncStorage
  const saveHistorialToAsyncStorage = async (nuevoRegistro: any) => {
    const nuevoHistorial = [...historialProduccion, nuevoRegistro];
    setHistorialProduccion(nuevoHistorial);

    try {
      await AsyncStorage.setItem('historialProduccion', JSON.stringify(nuevoHistorial));
    } catch (error) {
      console.error('Error saving historial:', error);
    }
  };

  const handleCalcularTiempo = async () => {
    if (!selectedProductoId) {
      Alert.alert('Error', 'Por favor, selecciona un producto.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.108:5055/api/planificacion/calcularTiempoProduccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FabricacionId: selectedProductoId,
          Cantidad: parseFloat(cantidad),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultado(data);
        Alert.alert('Cálculo Exitoso', 'El tiempo estimado de producción ha sido calculado.');
      } else {
        Alert.alert('Error', data.message || 'No se pudo calcular el tiempo de producción');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un problema, inténtalo de nuevo.');
    }
  };

  const handleMandarAProduccion = async () => {
    if (!selectedProductoId) return;

    try {
      const produccionResponse = await fetch('http://10.16.14.126:5055/api/produccion/solicitarProduccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: 1,
          FabricacionId: selectedProductoId,
          Cantidad: parseFloat(cantidad),
          Descripcion: "Producción generada desde la aplicación",
        }),
      });

      const produccionData = await produccionResponse.json();

      if (produccionResponse.ok) {
        Alert.alert('Producción Iniciada', produccionData.Mensaje || 'Se ha mandado a producción.');

        const nuevoRegistro = {
          productoId: selectedProductoId,
          cantidad: parseFloat(cantidad),
          tiempoTotalHoras: resultado.tiempoTotalHoras,
          diasLaborales: resultado.diasLaborales,
          descripcion: "Producción registrada localmente",
          fechaRegistro: new Date().toLocaleString()
        };

        saveHistorialToAsyncStorage(nuevoRegistro);

      } else {
        Alert.alert('Atención', produccionData.message || 'No se pudo iniciar la producción.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un problema, inténtalo de nuevo.');
    }
  };

  const handleCancelar = () => {
    setSelectedProductoId(null);
    setCantidad('');
    setResultado(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Calcular Tiempo de Producción</Text>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Seleccionar Producto:</Text>
          <Picker
            selectedValue={selectedProductoId ?? ""}
            onValueChange={(itemValue) => setSelectedProductoId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un producto" value="" />
            {productos.map((producto) => (
              <Picker.Item key={producto.id} label={producto.nombreProducto} value={producto.id} />
            ))}
          </Picker>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            value={cantidad}
            onChangeText={setCantidad}
            placeholder="Cantidad"
            placeholderTextColor="#333"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleCalcularTiempo}>
          <Text style={styles.btnText}>Calcular Tiempo</Text>
        </TouchableOpacity>
        {resultado && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Cantidad: {resultado.cantidad}</Text>
            <Text style={styles.resultText}>Tiempo Total en Horas: {resultado.tiempoTotalHoras}</Text>
            <Text style={styles.resultText}>Días Laborales: {resultado.diasLaborales}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.btn} onPress={handleMandarAProduccion}>
                <Text style={styles.btnText}>Mandar a Producción</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnClear} onPress={handleCancelar}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.historyBox}>
          <Text style={styles.title}>Historial de Producción</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Cantidad</Text>
              <Text style={styles.headerCell}>Horas</Text>
              <Text style={styles.headerCell}>Días</Text>
              <Text style={styles.headerCell}>Fecha</Text>
            </View>
            {historialProduccion.map((registro, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{registro.cantidad}</Text>
                <Text style={styles.cell}>{registro.tiempoTotalHoras}</Text>
                <Text style={styles.cell}>{registro.diasLaborales}</Text>
                <Text style={styles.cell}>{registro.fechaRegistro}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CalcularTiempoProduccion;




const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  wrapper: {
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputBox: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#333',
    borderWidth: 2,
    borderRadius: 25,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: 20,
    marginHorizontal: 5,
  },
  btnClear: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: 20,
    marginHorizontal: 5,
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  historyBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e2e2e2',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
});
