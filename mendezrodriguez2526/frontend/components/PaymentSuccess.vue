<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-5">
            <h2 class="mb-4">¡Pago Completado! 🎉</h2>

            <p class="text-muted mb-4">
              Gracias por tu compra. Te hemos enviado un correo con los detalles.
            </p>

            <div class="mb-4">
              <p class="fw-bold">Descargue su factura en formato PDF:</p>
              <button class="btn btn-primary btn-lg mt-2" @click="generarFacturaPDF">
                📄 Descargar Factura
              </button>
            </div>

            <router-link to="/modelos" class="text-decoration-none">
              ← Volver a la tienda
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import { useCestaStore } from "../store/cesta.js";
import logo from "@/assets/carTeis.png";
import { addFactura } from "../api/facturas.js";

export default {
  data() {
    return {
      cartItems: [],
      totalPrice: 0,
      numeroFactura: "",
      subtotal: 0,
      descuentoAplicado: 0,
      gastosEnvio: 0,
      codigoDescuento: ""
    };
  },

  created() {
    const cartStore = useCestaStore();
    this.numeroFactura = `FAC-${Date.now()}`
    // Obtener carrito
    if (cartStore.items && cartStore.items.length > 0) {
      this.cartItems = [...cartStore.items];
    } else {
      const savedCart = localStorage.getItem("cesta");
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
          
        } catch {
          this.cartItems = [];
        }
      }
    }

    // Verificar si se aplicó un código de descuento
    const savedCodigo = localStorage.getItem("codigoDescuento");
    if (savedCodigo) {
      this.codigoDescuento = savedCodigo;
    }

    // Calcular subtotal base (suma de productos)
    const subtotalBase = this.cartItems.reduce(
      (total, item) =>
        total +
        ((item.precio_unitario || item.precio) || 0) *
          (item.cantidad || 0),
      0
    );

    // Aplicar descuento si el código es "DESCUENTO" (10% descuento)
    if (this.codigoDescuento === "DESCUENTO") {
      this.descuentoAplicado = subtotalBase * 0.1;
      this.subtotal = subtotalBase - this.descuentoAplicado;
    } else {
      this.descuentoAplicado = 0;
      this.subtotal = subtotalBase;
    }

    // Aplicar recargo del 5% si el subtotal es menor a 50€
    if (this.subtotal < 50 && this.subtotal > 0) {
      this.subtotal = this.subtotal * 1.05;
    }

    // Calcular gastos de envío: 1000€ si el subtotal < 30000€
    if (this.subtotal < 30000 && this.subtotal > 0) {
      this.gastosEnvio = 1000;
    } else {
      this.gastosEnvio = 0;
    }

    // Total final
    this.totalPrice = this.subtotal + this.gastosEnvio;

    this.numeroFactura = `FAC-${Date.now()}`;

    // ✅ GUARDAR FACTURA AL ENTRAR
    this.guardarFactura();
  },

  methods: {
    async guardarFactura() {
      try {
        const factura = {
          numeroFactura: this.numeroFactura,
          productos: this.cartItems.map((item) => ({
            productoId: item._id || item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario || item.precio,
            fecha: new Date(),
          })),
          total: this.totalPrice,
        };

        await addFactura(factura);
        console.log("✅ Factura guardada en MongoDB");
      } catch (error) {
        console.error("❌ Error guardando factura:", error);
      }
    },

    generarFacturaPDF() {
      if (!this.cartItems.length) {
        alert("No hay productos para generar factura");
        return;
      }

      const doc = new jsPDF();

      // Colores de la marca (RGB)
      const primaryColor = [9, 99, 126];     // #09637e
      const secondaryColor = [8, 131, 149];  // #088395
      const lightColor = [122, 178, 178];    // #7ab2b2
      const grayBg = [245, 245, 245];        // Fondo gris claro

      // === ENCABEZADO CON COLOR ===
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 45, 'F');

      // Logo
      try {
        doc.addImage(logo, "png", 15, 10, 25, 25);
      } catch {}

      // Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.text("FACTURA DE COMPRA", 105, 20, { align: "center" });

      // Número de factura y fecha
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(`Nº: ${this.numeroFactura}`, 105, 30, { align: "center" });
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 37, { align: "center" });

      // === INFORMACIÓN DE LA EMPRESA ===
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(...grayBg);
      doc.roundedRect(135, 52, 60, 28, 2, 2, 'F');

      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...primaryColor);
      doc.text("Regalos Teis", 138, 58);

      doc.setFont(undefined, "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("Avenida Galicia 101", 138, 63);
      doc.text("Vigo 36216", 138, 67);
      doc.text("Tlf: 986 666 333", 138, 71);
      doc.text("regalos@example.com", 138, 75);

      // === TABLA DE PRODUCTOS ===
      const startY = 90;
      const colWidths = {
        id: 25,
        producto: 70,
        cantidad: 25,
        precio: 30,
        total: 30
      };
      const colX = {
        id: 15,
        producto: 15 + colWidths.id,
        cantidad: 15 + colWidths.id + colWidths.producto,
        precio: 15 + colWidths.id + colWidths.producto + colWidths.cantidad,
        total: 15 + colWidths.id + colWidths.producto + colWidths.cantidad + colWidths.precio
      };

      // Encabezado de tabla con color
      doc.setFillColor(...primaryColor);
      doc.rect(15, startY, 180, 10, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      doc.setFontSize(10);
      doc.text("ID", colX.id + 2, startY + 7);
      doc.text("Producto", colX.producto + 2, startY + 7);
      doc.text("Cantidad", colX.cantidad + 2, startY + 7);
      doc.text("Precio", colX.precio + 2, startY + 7);
      doc.text("Total", colX.total + 2, startY + 7);

      // Líneas de la tabla
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);

      let currentY = startY + 10;
      let rowIndex = 0;

      // Filas de productos
      doc.setFont(undefined, "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      this.cartItems.forEach((item) => {
        const precio = item.precio_unitario || item.precio;
        const total = precio * item.cantidad;

        // Fondo alternado
        if (rowIndex % 2 === 0) {
          doc.setFillColor(...grayBg);
          doc.rect(15, currentY, 180, 8, 'F');
        }

        // Bordes de celda
        doc.setDrawColor(200, 200, 200);
        doc.line(15, currentY, 195, currentY);

        // Contenido
        const idText = String(item._id || item.id).substring(0, 8);
        doc.text(idText, colX.id + 2, currentY + 5.5);
        
        // Truncar nombre si es muy largo
        let nombre = item.nombre;
        if (nombre.length > 30) {
          nombre = nombre.substring(0, 27) + '...';
        }
        doc.text(nombre, colX.producto + 2, currentY + 5.5);
        
        doc.text(String(item.cantidad), colX.cantidad + 10, currentY + 5.5, { align: "center" });
        doc.text(`${precio.toFixed(2)} €`, colX.precio + 2, currentY + 5.5);
        doc.text(`${total.toFixed(2)} €`, colX.total + 2, currentY + 5.5);

        currentY += 8;
        rowIndex++;
      });

      // Línea final de tabla
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, currentY, 195, currentY);

      // === DESGLOSE DE TOTALES ===
      currentY += 8;
      const desgloseX = 145;
      const desgloseWidth = 50;
      
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);

      // Subtotal productos
      const subtotalProductos = this.cartItems.reduce(
        (total, item) => total + ((item.precio_unitario || item.precio) || 0) * (item.cantidad || 0),
        0
      );
      doc.text("Subtotal:", desgloseX, currentY);
      doc.text(`${subtotalProductos.toFixed(2)} €`, desgloseX + desgloseWidth - 5, currentY, { align: "right" });
      currentY += 6;

      // Mostrar descuento si se aplicó
      if (this.descuentoAplicado > 0) {
        doc.setTextColor(0, 150, 0);
        doc.text("Descuento (10%):", desgloseX, currentY);
        doc.text(`-${this.descuentoAplicado.toFixed(2)} €`, desgloseX + desgloseWidth - 5, currentY, { align: "right" });
        doc.setTextColor(0, 0, 0);
        currentY += 6;
      }

      // Mostrar gastos de envío
      if (this.gastosEnvio > 0) {
        doc.setTextColor(200, 100, 0);
        doc.text("Gastos de envío:", desgloseX, currentY);
        doc.text(`${this.gastosEnvio.toFixed(2)} €`, desgloseX + desgloseWidth - 5, currentY, { align: "right" });
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setTextColor(0, 150, 0);
        doc.text("Gastos de envío:", desgloseX, currentY);
        doc.text("GRATIS", desgloseX + desgloseWidth - 5, currentY, { align: "right" });
        doc.setTextColor(0, 0, 0);
      }
      currentY += 8;

      // Línea separadora
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(desgloseX, currentY, desgloseX + desgloseWidth, currentY);
      currentY += 2;

      // === TOTAL ===
      const totalY = currentY + 5;
      doc.setFillColor(...secondaryColor);
      doc.roundedRect(desgloseX, totalY, desgloseWidth, 12, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      doc.setFontSize(14);
      doc.text("TOTAL:", desgloseX + 5, totalY + 8);
      doc.text(`${this.totalPrice.toFixed(2)} €`, desgloseX + desgloseWidth - 5, totalY + 8, { align: "right" });

      // === PIE DE PÁGINA ===
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont(undefined, "italic");
      doc.text("Gracias por su compra. Para cualquier consulta contacte con nosotros.", 105, 280, { align: "center" });

      const fecha = new Date().toISOString().split("T")[0];
      doc.save(`Factura_${fecha}.pdf`);
    },
  },

  beforeUnmount() {
    const cartStore = useCestaStore();
    cartStore.clearCesta();
    // Limpiar también el código de descuento
    localStorage.removeItem('codigoDescuento');
  },
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}

.btn-primary {
  border-radius: 8px;
  padding: 12px 30px;
}
</style>
