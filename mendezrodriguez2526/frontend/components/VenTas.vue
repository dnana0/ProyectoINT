<template>
    <div class="container-fluid mt-2">
        <!-- Barra de búsqueda por marca -->
        <div class="d-flex justify-content-end align-items-center gap-2 mb-3">
            <input 
                v-model="filtroMarca" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar por marca..." 
                style="max-width: 250px;"
            />
            <button 
                class="btn btn-outline-secondary btn-sm d-flex align-items-center" 
                @click="ordenAscendente = !ordenAscendente"
                :title="ordenAscendente ? 'Orden A-Z' : 'Orden Z-A'">
                <i class="bi me-1" :class="ordenAscendente ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up-alt'"></i>
                {{ ordenAscendente ? 'A-Z' : 'Z-A' }}
            </button>
        </div>

        <div class="row g-4">
            <div 
            v-for="car in vehiculosFiltrados"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
            >
                <div class="card h-80 shadow-sm">
                    <img
                        :src="urlImagen(car.imagen)"
                        class="img-fluid rounded shadow-sm"
                        alt="vehiculo"
                        style="height: 200px; object-fit: cover; cursor:pointer"
                        @click="verDetalles(car)"
                    ></img>

                    <div class="card-body">
                        <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
                        <p class="card-text">
                            <strong>Año: </strong>{{ car.anio }}<br>
                            <strong>Km: </strong>{{ car.kilometros }}<br>
                            <strong>Precio: </strong>{{ car.precio }}<br>
                        </p>   
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span 
                            class="badge"
                            :class="car.estado === 'disponible' ? 'bg-primary' : 'bg-warning'">
                            {{ car.estado }}
                        </span>
                        <button
                            class="btn badge btn-sm btn-success ms-2"
                            :class="car.estado === 'disponible' ? 'btn-success' : 'btn-secondary opacity-50 cursor-not-allowed'"
                            :disabled="car.estado !== 'disponible'"
                            @click.stop="agregarACesta(car)">
                            <i class="bi bi-cart3 me-1"></i>
                            {{ car.estado === 'disponible' ? 'Agregar Cesta' : 'No disponible' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL DETALLES DEL COCHE -->
    <div
    v-if="mostrarModal"
    class="modal fade show"
    style="display: block; background: rgba(0,0,0,0.6)"
    >
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

        <div class="modal-header text-white" style="background-color: #09637e ;">
            <h5 class="modal-title">
            <i class="bi bi-car-front me-2"></i>
            {{ cocheSeleccionado.marca }} {{ cocheSeleccionado.modelo }}
            </h5>
            <button class="btn-close" @click="mostrarModal = false"></button>
        </div>

        <div class="modal-body">
            <div class="text-center mb-3">
            <img
                :src="urlImagen(cocheSeleccionado.imagen)"
                class="img-fluid rounded shadow"
                style="max-height: 250px"
            />
            </div>

            <table class="table table-bordered">
            <tbody>
                <tr><th>Marca</th><td>{{ cocheSeleccionado.marca }}</td></tr>
                <tr><th>Modelo</th><td>{{ cocheSeleccionado.modelo }}</td></tr>
                <tr><th>Año</th><td>{{ cocheSeleccionado.anio }}</td></tr>
                <tr><th>Precio</th><td>{{ cocheSeleccionado.precio }} €</td></tr>
                <tr><th>Kilómetros</th><td>{{ cocheSeleccionado.kilometros }}</td></tr>
                <tr><th>Combustible</th><td>{{ cocheSeleccionado.combustible }}</td></tr>
                <tr><th>Transmisión</th><td>{{ cocheSeleccionado.transmision }}</td></tr>
                <tr><th>Potencia</th><td>{{ cocheSeleccionado.potencia_cv }} CV</td></tr>
                <tr><th>Estado</th><td>{{ cocheSeleccionado.estado }}</td></tr>
                <tr><th>Descripción</th><td>{{ cocheSeleccionado.descripcion }}</td></tr>
            </tbody>
            </table>

            <!-- Mostrar datos de reserva si existe -->
            <div v-if="cocheSeleccionado.estado === 'reservado' && cocheSeleccionado.reserva" class="alert alert-info mt-3">
              <h6 class="mb-2"><strong>Datos de Reserva:</strong></h6>
              <p class="mb-1"><strong>Nombre:</strong> {{ cocheSeleccionado.reserva.nombre }}</p>
              <p class="mb-1"><strong>Teléfono:</strong> {{ cocheSeleccionado.reserva.telefono }}</p>
              <p class="mb-1"><strong>Email:</strong> {{ cocheSeleccionado.reserva.email }}</p>
              <p class="mb-0"><strong>Fecha:</strong> {{ cocheSeleccionado.reserva.fecha }}</p>
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarModal = false">
            Cerrar
            </button>

            <button class="btn btn-success" @click="imprimirPDF">
            <i class="bi bi-printer me-2"></i> Descargar PDF
            </button>

            <!-- Botón Reservar (solo si disponible) -->
            <button 
              v-if="cocheSeleccionado.estado === 'disponible'"
              class="btn btn-primary" 
              @click="mostrarFormularioReserva = true"
              style="background-color: #088395;">
            <i class="bi bi-calendar-check me-2"></i> Reservar
            </button>

            <!-- Botón Cancelar Reserva (solo para admins si está reservado) -->
            <button 
              v-if="cocheSeleccionado.estado === 'reservado' && isAdmin"
              class="btn btn-danger" 
              @click="cancelarReserva">
            <i class="bi bi-x-circle me-2"></i> Cancelar Reserva
            </button>
        </div>

        </div>
    </div>
    </div>

    <!-- MODAL FORMULARIO RESERVA -->
    <div
      v-if="mostrarFormularioReserva"
      class="modal fade show"
      style="display: block; background: rgba(0,0,0,0.6)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-white" style="background-color: #088395;">
            <h5 class="modal-title">
              <i class="bi bi-calendar-check me-2"></i>Formulario de Reserva
            </h5>
            <button class="btn-close" @click="mostrarFormularioReserva = false"></button>
          </div>

          <div class="modal-body">
            <p class="mb-3"><strong>{{ cocheSeleccionado.marca }} {{ cocheSeleccionado.modelo }}</strong></p>
            
            <div class="mb-3">
              <label class="form-label">Nombre:</label>
              <input 
                v-model="formularioReserva.nombre" 
                type="text" 
                class="form-control" 
                placeholder="Tu nombre"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Teléfono:</label>
              <input 
                v-model="formularioReserva.telefono" 
                type="tel" 
                class="form-control" 
                placeholder="Tu teléfono"
              />
              <small v-if="!telefonoValido" class="text-danger">Teléfono inválido (debe empezar por 6 o 7 y tener 9 dígitos).</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Email:</label>
              <input 
                v-model="formularioReserva.email" 
                type="email" 
                class="form-control" 
                placeholder="Tu email"
              />
              <small v-if="!emailValido" class="text-danger">Email inválido.</small>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarFormularioReserva = false">
              Cancelar
            </button>
            <button 
              class="btn btn-primary" 
              @click="guardarReserva"
              :disabled="!puedoGuardarReserva"
              style="background-color: #088395;">
              <i class="bi bi-check me-2"></i>Confirmar Reserva
            </button>
          </div>    
        </div>
      </div>
    </div>

    <!-- Recuadro informativo de ayuda -->
    <div class="info-ayuda">
      <div class="info-header">
      </div>
      <div class="info-body">
        <strong>Haz click en la imagen para ver los detalles del vehículo</strong>
      </div>    
    </div>

</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { getArticulos, updateArticulo } from "@/api/articulos.js";
import { useCestaStore } from "@/store/cesta.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

const cestaStore = useCestaStore(); 
const vehiculos = ref([]);
const mostrarModal = ref(false);
const mostrarFormularioReserva = ref(false);
const cocheSeleccionado = ref(null);

const isAdmin = ref(sessionStorage.getItem("isAdmin") === "true");
const filtroMarca = ref("");
const ordenAscendente = ref(true);

const vehiculosFiltrados = computed(() => {
  let lista = vehiculos.value;
  if (filtroMarca.value.trim()) {
    const busqueda = filtroMarca.value.trim().toLowerCase();
    lista = lista.filter(car => car.marca.toLowerCase().includes(busqueda));
  }
  return [...lista].sort((a, b) => {
    const cmp = a.marca.localeCompare(b.marca, 'es', { sensitivity: 'base' });
    return ordenAscendente.value ? cmp : -cmp;
  });
});

const formularioReserva = ref({
  nombre: "",
  telefono: "",
  email: ""
});

const telefonoRegex = /^[67]\d{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const telefonoValido = computed(() => {
  if (!formularioReserva.value.telefono) return true;
  return telefonoRegex.test(formularioReserva.value.telefono);
});

const emailValido = computed(() => {
  if (!formularioReserva.value.email) return true;
  return emailRegex.test(formularioReserva.value.email);
});

const puedoGuardarReserva = computed(() => {
  return (
    formularioReserva.value.nombre.trim() !== "" &&
    formularioReserva.value.telefono.trim() !== "" &&
    formularioReserva.value.email.trim() !== "" &&
    telefonoValido.value &&
    emailValido.value
  );
});

onMounted(async () => {
    vehiculos.value = await getArticulos();

    const vendidos = JSON.parse(localStorage.getItem("cochesVendidos")) || [];

    vehiculos.value.forEach((coche) => {
        if (vendidos.includes(coche._id)) {
            coche.estado = "vendido";
        }
    });
});

const urlImagen = (ruta) => {
    if (!ruta) return "/no-image.png";
    return `http://localhost:5000${ruta}`
};

const agregarACesta = (car) => {
    // Añadir a la cesta
    cestaStore.addProducto({
        id: car._id,
        nombre: `${car.marca} ${car.modelo}`,
        precio: car.precio,
        imagen: urlImagen(car.imagen),
    });

    // Cambiar estado del coche
    car.estado = "reservado";
}

const verDetalles = (car) => {
    cocheSeleccionado.value = car;
    mostrarModal.value = true;
}

const guardarReserva = async () => {
  if (!puedoGuardarReserva.value) return;

  try {
    const ahora = new Date().toISOString().split("T")[0];
    const reservaData = {
      ...cocheSeleccionado.value,
      estado: "reservado",
      reserva: {
        nombre: formularioReserva.value.nombre,
        telefono: formularioReserva.value.telefono,
        email: formularioReserva.value.email,
        fecha: ahora
      }
    };

    const resultado = await updateArticulo(cocheSeleccionado.value._id, reservaData);
    
    if (resultado) {
      cocheSeleccionado.value.reserva = reservaData.reserva;
      cocheSeleccionado.value.estado = "reservado";
      mostrarFormularioReserva.value = false;
      formularioReserva.value = { nombre: "", telefono: "", email: "" };
      
      Swal.fire({
        icon: "success",
        title: "Reserva confirmada",
        text: "El vehículo ha sido reservado correctamente.",
        confirmButtonText: "OK"
      });
    }
  } catch (error) {
    console.error("Error al guardar reserva:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar la reserva.",
      confirmButtonText: "OK"
    });
  }
}

const cancelarReserva = async () => {
  try {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "Cancelar reserva",
      text: "¿Estás seguro de que quieres cancelar esta reserva?",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No"
    });

    if (resultado.isConfirmed) {
      const reservaData = {
        ...cocheSeleccionado.value,
        estado: "disponible",
        reserva: null
      };

      const res = await updateArticulo(cocheSeleccionado.value._id, reservaData);
      
      if (res) {
        cocheSeleccionado.value.estado = "disponible";
        cocheSeleccionado.value.reserva = null;
        
        Swal.fire({
          icon: "success",
          title: "Reserva cancelada",
          text: "La reserva ha sido cancelada correctamente.",
          confirmButtonText: "OK"
        });
      }
    }
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cancelar la reserva.",
      confirmButtonText: "OK"
    });
  }
}

const imprimirPDF = () => {
    const car = cocheSeleccionado.value;
    const doc = new jsPDF();

    // Colores de la marca (RGB)
    const primaryColor = [9, 99, 126];     // #09637e
    const secondaryColor = [8, 131, 149];  // #088395
    const lightColor = [122, 178, 178];    // #7ab2b2
    const grayBg = [245, 245, 245];

    // === ENCABEZADO CON COLOR ===
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont(undefined, "bold");
    doc.text("FICHA DEL VEHÍCULO", 105, 20, { align: "center" });

    // Subtítulo con marca y modelo
    doc.setFontSize(16);
    doc.setFont(undefined, "normal");
    doc.text(`${car.marca} ${car.modelo}`, 105, 32, { align: "center" });

    // === SECCIÓN DE INFORMACIÓN PRINCIPAL ===
    let currentY = 55;

    // Recuadro de información destacada (Precio y Estado)
    doc.setFillColor(...secondaryColor);
    doc.roundedRect(15, currentY, 180, 25, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("PRECIO:", 25, currentY + 10);
    doc.setFontSize(20);
    doc.text(`${car.precio} €`, 25, currentY + 20);

    doc.setFontSize(14);
    doc.text("ESTADO:", 125, currentY + 10);
    doc.setFontSize(16);
    doc.text(car.estado.toUpperCase(), 125, currentY + 20);

    currentY += 35;

    // === CARACTERÍSTICAS TÉCNICAS ===
    doc.setFillColor(...lightColor);
    doc.rect(15, currentY, 180, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text("CARACTERÍSTICAS TÉCNICAS", 105, currentY + 7, { align: "center" });

    currentY += 15;

    // Datos en dos columnas con fondos alternados
    const datos = [
      { label: "Año:", valor: car.anio },
      { label: "Kilómetros:", valor: `${car.kilometros} km` },
      { label: "Combustible:", valor: car.combustible },
      { label: "Transmisión:", valor: car.transmision },
      { label: "Potencia:", valor: `${car.potencia_cv} CV` }
    ];

    doc.setFont(undefined, "normal");
    doc.setFontSize(11);
    
    datos.forEach((dato, index) => {
      // Fondo alternado
      if (index % 2 === 0) {
        doc.setFillColor(...grayBg);
        doc.rect(15, currentY, 180, 10, 'F');
      }

      // Etiqueta en negrita
      doc.setTextColor(...primaryColor);
      doc.setFont(undefined, "bold");
      doc.text(dato.label, 25, currentY + 7);

      // Valor normal
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
      doc.text(String(dato.valor), 80, currentY + 7);

      currentY += 10;
    });

    // === DESCRIPCIÓN ===
    currentY += 10;

    doc.setFillColor(...lightColor);
    doc.rect(15, currentY, 180, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text("DESCRIPCIÓN", 105, currentY + 7, { align: "center" });

    currentY += 15;

    // Recuadro con fondo para descripción
    const descripcion = car.descripcion || "Sin descripción disponible";
    const descripcionLines = doc.splitTextToSize(descripcion, 160);
    const descripcionHeight = descripcionLines.length * 7 + 10;

    doc.setFillColor(...grayBg);
    doc.roundedRect(15, currentY, 180, descripcionHeight, 2, 2, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(descripcionLines, 25, currentY + 7);

    currentY += descripcionHeight + 15;

    // === INFORMACIÓN DE RESERVA (si existe) ===
    if (car.estado === 'reservado' && car.reserva) {
      doc.setFillColor(255, 193, 7); // Color amarillo para reserva
      doc.roundedRect(15, currentY, 180, 30, 3, 3, 'F');

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("⚠ VEHÍCULO RESERVADO", 105, currentY + 10, { align: "center" });

      doc.setFont(undefined, "normal");
      doc.setFontSize(9);
      doc.text(`Reservado por: ${car.reserva.nombre}`, 25, currentY + 18);
      doc.text(`Teléfono: ${car.reserva.telefono}`, 25, currentY + 24);
      doc.text(`Email: ${car.reserva.email}`, 110, currentY + 18);
      doc.text(`Fecha: ${car.reserva.fecha}`, 110, currentY + 24);
    }

    // === PIE DE PÁGINA ===
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 280, 195, 280);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text("Regalos Teis - Avenida Galicia 101, Vigo 36216", 105, 285, { align: "center" });
    doc.text("Tlf: 986 666 333 - Email: regalos@example.com", 105, 290, { align: "center" });

    doc.save(`vehiculo_${car.marca}_${car.modelo}.pdf`);
}

</script>

<style scoped>
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}

.info-ayuda {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: #ffffff;
  border: 2px solid #7ab2b2;
  border-radius: 10px;
  padding: 0;
  width: 260px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.info-header {
  background: linear-gradient(135deg, #088395 0%, #7ab2b2 100%);
  color: white;
  padding: 10px 12px;
  border-radius: 8px 8px 0 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.info-body {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
  font-size: 0.85rem;
  color: #495057;
  display: flex;
  align-items: center;
}

.info-body strong {
  color: #088395;
}

/*
IMPRIMIR ANTIGUO

const imprimirPDF = () => {
    const car = cocheSeleccionado.value;
    const doc = new jsPDF();

    doc.setFontSize(16)
    doc.text(`Ficha del vehículo`, 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Marca: ${car.marca}`, 20, 30);
    doc.text(`Modelo: ${car.modelo}`, 20, 40);
    doc.text(`Año: ${car.anio}`, 20, 50);
    doc.text(`Precio: ${car.precio}`, 20, 60);
    doc.text(`Kilómetros: ${car.kilometros}`, 20, 70);
    doc.text(`Combustible: ${car.combustible}`, 20, 80);
    doc.text(`Transmisión: ${car.transmision}`, 20, 90);
    doc.text(`Potencia: ${car.potencia_cv}`, 20, 100);
    doc.text(`Estado: ${car.estado}`, 20, 110);

    doc.text(`Precio: ${car.precio}`, 20, 125);
    doc.text(car.descripcion || "Sin descripción", 20, 135, { maxWidth: 170});

    doc.save(`vehículo_${car.marca}_${car.modelo}.pdf`);
}
*/
</style>

