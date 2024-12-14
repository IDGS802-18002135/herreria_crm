import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const DashboardScreen = () => {
    const [salesData, setSalesData] = useState([]);
    const [topSales, setTopSales] = useState([]);
    const [userNames, setUserNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalVentas: 0,
        totalIngresos: 0,
        promedioPorVenta: 0,
    });

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/GetDashboard');
                const data = await response.json();

            
                const transformedData = data.map((item) => ({
                    id: item.id,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    totalVenta: item.cantidad * item.precioUnitario,
                    fecha: item.venta.fecha,
                    folio: item.venta.folio,
                }));

                // Calcular resumen
                const totalVentas = transformedData.length;
                const totalIngresos = transformedData.reduce((acc, curr) => acc + curr.totalVenta, 0);
                const promedioPorVenta = totalIngresos / totalVentas;

                setSalesData(transformedData);
                setSummary({ totalVentas, totalIngresos, promedioPorVenta });

                // Seleccionar las 5 ventas principales basadas en precioUnitario * cantidad
                const topSalesData = [...transformedData]
                    .sort((a, b) => b.precioUnitario * b.cantidad - a.precioUnitario * a.cantidad)
                    .slice(0, 5);

                setTopSales(topSalesData);

                // Obtener los IDs de las 5 mejores ventas
                const topSalesIds = topSalesData.map((sale) => sale.id);

                // Llamar a la API para obtener los nombres de los usuarios relacionados con esas ventas
                const fetchUserNames = async () => {
                    const names = await Promise.all(
                        topSalesIds.map(async (id) => {
                            try {
                                const response = await fetch(`https://bazar20241109230927.azurewebsites.net/api/Usuario/${id}`);
                                if (!response.ok) {
                                    throw new Error('Usuario no encontrado');
                                }
                                const user = await response.json();
                                return user.nombre || 'Usuario Desconocido'; // Si no tiene nombre, lo asigna como 'Usuario Desconocido'
                            } catch (error) {
                                console.error(`Error al obtener el usuario con ID ${id}:`, error);
                                return 'Usuario Desconocido';
                            }
                        })
                    );
                    setUserNames(names);
                };

                await fetchUserNames();
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setIsLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    if (isLoading) {
        return <Text style={styles.loadingText}>Cargando datos...</Text>;
    }


    const salesWithUserNames = salesData.map((sale, index) => ({
        ...sale,
        userName: userNames[index] || 'Usuario Desconocido',
    }));

 
    const chartData = {
        labels: topSales.map((item) => `${item.folio}`), 
        datasets: [
            {
                data: topSales.map((item) => item.precioUnitario * item.cantidad), 
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard de Ventas</Text>

            {/* Resumen */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryText}>Total Ventas</Text>
                    <Text style={styles.summaryValue}>{summary.totalVentas}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryText}>Ingresos Totales</Text>
                    <Text style={styles.summaryValue}>${summary.totalIngresos.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryText}>Promedio por Venta</Text>
                    <Text style={styles.summaryValue}>${summary.promedioPorVenta.toFixed(2)}</Text>
                </View>
            </View>

            {/* Gráfico */}
            <Text style={styles.chartTitle}>Top 5 Ventas (Precio Unitario * Cantidad)</Text>
            <BarChart
                data={chartData}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                    labelColor: () => '#000', 
                    propsForLabels: {
                        labelOffset: 10, 
                    },
                }}
                style={styles.chart}
            />

            {/* Detalle de las ventas */}
            <FlatList
                data={salesWithUserNames}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>Folio: {item.folio}</Text>
                        <Text style={styles.cardText}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
                        <Text style={styles.cardText}>Cantidad: {item.cantidad}</Text>
                        <Text style={styles.cardText}>Precio Unitario: ${item.precioUnitario.toFixed(2)}</Text>
                        <Text style={styles.cardText}>Total: ${item.totalVenta.toFixed(2)}</Text>
                        <Text style={styles.cardText}>Usuario: {item.userName}</Text> {/* Muestra el nombre del usuario */}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    summaryText: {
        fontSize: 14,
        color: '#555',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chart: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default DashboardScreen;
