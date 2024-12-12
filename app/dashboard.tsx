import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
    const [filter, setFilter] = useState("mes");
    const [salesData, setSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                // Hacer la solicitud a la API para obtener los datos de ventas
                const response = await fetch('https://bazar20241109230927.azurewebsites.net/api/GetDashboard');  // Reemplaza 'URL_DE_TU_API' con la URL real
                const data = await response.json();

                // Transformar los datos en el formato necesario para el gráfico
                const transformedData = data.map(item => ({
                    cantidad: item.cantidad,
                    precio: item.precioUnitario,
                    totalVenta: item.cantidad * item.precioUnitario,
                }));

                setSalesData(transformedData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setIsLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    const getFilteredData = () => {
        return {
            labels: salesData.map((_, index) => `Venta ${index + 1}`),  // Etiquetas por venta
            datasets: [{
                data: salesData.map(item => item.totalVenta),
                color: () => `rgba(0, 191, 255, 1)`,
            }]
        };
    };

    const getTotalSales = () => {
        return salesData.reduce((acc, venta) => acc + venta.totalVenta, 0);
    };

    const getTotalProfit = () => {
        return getTotalSales() * 0.30;  // Suponiendo un margen de ganancia del 30%
    };

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const exportToExcel = async () => {
        const wsData = salesData.map((venta, index) => ({
            Fecha: `Venta ${index + 1}`,
            Producto: "Protección",
            Cantidad: venta.cantidad,
            Precio: `$${venta.precio.toFixed(2)}`,
            VentaTotal: `$${venta.totalVenta.toFixed(2)}`,
            Ganancia: `$${(venta.totalVenta * 0.30).toFixed(2)}`
        }));

        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SalesData");
        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

        if (Platform.OS === 'web') {
            const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ventas_${filter}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            const uri = FileSystem.cacheDirectory + `ventas_${filter}.xlsx`;
            await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
            await Sharing.shareAsync(uri);
        }
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
    };

    if (isLoading) {
        return <Text>Cargando...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tab} onPress={() => setFilter("mes")}>
                    <Text style={styles.tabText}>Mes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => setFilter("semana")}>
                    <Text style={styles.tabText}>Semana</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => setFilter("dia")}>
                    <Text style={styles.tabText}>Día</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Ventas ({filter})</Text>
                <LineChart
                    data={getFilteredData()}
                    width={screenWidth * 0.9}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
                <Text style={styles.legend}>Ventas Totales</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.total}>Total Ventas:</Text>
                <Text style={styles.amount}>${getTotalSales().toFixed(2)}</Text>
                <Text style={styles.total}>Ganancia Estimada:</Text>
                <Text style={styles.amount}>${getTotalProfit().toFixed(2)}</Text>
                <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
                    <Text style={styles.exportText}>Exportar a Excel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tab: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    tabText: {
        fontSize: 16,
        color: '#000',
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chart: {
        borderRadius: 16,
    },
    legend: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
    },
    footer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00bfff',
        marginBottom: 10,
    },
    exportButton: {
        padding: 10,
        backgroundColor: '#00bfff',
        borderRadius: 10,
        alignItems: 'center',
    },
    exportText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DashboardScreen;
