import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const agregarProducto = (productoId, cantidad, productos, setProductos, setProductosSeleccionados) => {
    const producto = productos.find((p) => p.id === productoId);
    if (producto && cantidad <= producto.cantidad) {
        const nuevosProductos = productos.map((p) => 
            p.id === productoId ? { ...p, cantidad: p.cantidad - cantidad } : p
        );
        setProductos(nuevosProductos);
        const nuevoProducto = { ...producto, cantidad };
        setProductosSeleccionados(prev => [...prev, nuevoProducto]);
    } else {
        alert("Cantidad no disponible.");
    }
};

export const calcularSubtotal = (productosSeleccionados) => {
    return productosSeleccionados.reduce((total, producto) => 
        total + producto.precio * producto.cantidad, 0);
};

export const generarPDF = async (productosSeleccionados, nombreEmpresa, vendedor, calcularSubtotal) => {
    const fechaActual = new Date();
    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opcionesFecha).replace(',', '');

    let htmlContent = `
        <div style="border: 3px solid black; padding: 20px; width: 95%; margin: auto; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; font-size: 2em; margin-top: 0; font-weight: bold;">SOLDALINE</h1>
            <h2 style="text-align: center;">Cotización</h2>
            <p>Fecha: ${fechaFormateada}</p>
            <p>Empresa: ${nombreEmpresa}</p>
            <p>Vendedor: ${vendedor}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 10px; text-align: left;">Producto</th>
                        <th style="border: 1px solid black; padding: 10px; text-align: left;">Cantidad</th>
                        <th style="border: 1px solid black; padding: 10px; text-align: left;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>`;
                
    productosSeleccionados.forEach((p) => {
        htmlContent += `
                    <tr>
                        <td style="border: 1px solid black; padding: 10px;">${p.nombreFabricacion}</td>
                        <td style="border: 1px solid black; padding: 10px;">${p.cantidad}</td>
                        <td style="border: 1px solid black; padding: 10px;">$${(p.precio * p.cantidad).toFixed(2)}</td>
                    </tr>`;
    });

    htmlContent += `
                </tbody>
            </table>
            <h3 style="text-align: right; margin-top: 20px;">Total Estimado: $${calcularSubtotal(productosSeleccionados).toFixed(2)}</h3>
            <p style="text-align: center; font-style: italic; color: gray; margin-top: 20px;">Esta es solo una cotización, no confirma la compra.</p>
        </div>
    `;

    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const fileUri = FileSystem.documentDirectory + 'cotizacion.pdf';
        await FileSystem.moveAsync({ from: uri, to: fileUri });
        await Sharing.shareAsync(fileUri);
    } catch (error) {
        console.error(error);
        alert("Error al generar el PDF.");
    }
};
