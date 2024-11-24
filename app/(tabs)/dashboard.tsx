import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

const screenWidth = Dimensions.get('window').width;

// Datos de ventas estáticos con detalles
const staticData = {
    mes: {
        labels: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`),
        ventas: Array.from({ length: 30 }, () => ({
            cantidad: Math.floor(Math.random() * 10) + 1,  // Cantidad vendida de protecciones
            precio: 100,  // Precio por unidad de protección
        })),
    },
    semana: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        ventas: Array.from({ length: 7 }, () => ({
            cantidad: Math.floor(Math.random() * 10) + 1,
            precio: 100,
        })),
    },
    dia: {
        labels: ["Hora 1", "Hora 2", "Hora 3", "Hora 4", "Hora 5"],
        ventas: Array.from({ length: 5 }, () => ({
            cantidad: Math.floor(Math.random() * 10) + 1,
            precio: 100,
        })),
    }
};

const DashboardScreen = () => {
    const [filter, setFilter] = useState("mes");

    // Función para obtener datos filtrados de acuerdo con la selección
    const getFilteredData = () => {
        const data = staticData[filter];
        return {
            labels: data.labels,
            datasets: [{
                data: data.ventas.map(venta => venta.cantidad * venta.precio), // Ventas en valor
                color: () => `rgba(0, 191, 255, 1)`,
            }]
        };
    };

    // Cálculo de ventas totales
    const getTotalSales = () => {
        return staticData[filter].ventas.reduce((acc, venta) => acc + (venta.cantidad * venta.precio), 0);
    };

    // Cálculo de ganancia total (suponiendo un margen de 30% sobre el precio)
    const getTotalProfit = () => {
        return getTotalSales() * 0.30;
    };

    // Función para exportar a Excel
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const exportToExcel = async () => {
        // Preparar los datos para el archivo Excel
        const wsData = staticData[filter].ventas.map((venta, index) => ({
            Fecha: staticData[filter].labels[index],
            Producto: "Protección",
            Cantidad: venta.cantidad,
            Precio: `$${venta.precio.toFixed(2)}`,
            VentaTotal: `$${(venta.cantidad * venta.precio).toFixed(2)}`,
            Ganancia: `$${((venta.cantidad * venta.precio) * 0.30).toFixed(2)}`  // 30% de margen de ganancia
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

    // Configuración del gráfico
    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
    };

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
