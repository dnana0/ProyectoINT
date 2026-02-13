<template>
  <div class="container-fluid mt-4">
    <div class="mx-auto p-4 border rounded-3 shadow-sm bg-light">
      <h3
        class="text-center mb-4 d-flex align-items-center justify-content-center"
        style="color: #7ab2b2"
      >
        <i class="bi bi-file-earmark-text fs-3 me-2"></i>
        Facturas
      </h3>

      <!-- Mensaje si no hay solicitudes -->
      <div v-if="solicitudes.length === 0" class="alert alert-info text-center">
        <i class="bi bi-info-circle me-2"></i>
        No hay solicitudes de empleo pendientes.
      </div>

      <!-- Tabla de solicitudes -->
      <div v-else class="table-responsive">
        <table
          class="table table-bordered table-striped table-hover align-middle"
        >
          <thead class="table-primary">
            <tr>
              <th class="text-center">ID</th>
              <th class="text-center">Fecha</th>
              <th class="text-center">PRECIO ARTICULO</th>
              <th class="text-center">TOTAL ARTICULOS</th>
              <th class="text-center">Total</th>

              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="solicitud in facturas" :key="solicitud.id">
              <td>{{ solicitud._id }}</td>
              <td class="text-center">{{ formatearFecha(solicitud.fecha) }}</td>
              <td>{{ solicitud.productos[0].precio_unitario }}</td>
              <td>{{ solicitud.productos.length }}</td>

              <td>
                {{
                  solicitud.productos[0].precio_unitario *
                  solicitud.productos.length
                }}
              </td>

              <td class="text-center">
                <button
                  @click="eliminarSolicitud(solicitud)"
                  class="btn btn-danger btn-sm"
                  title="Eliminar solicitud"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para ver foto grande -->
    <div
      v-if="mostrarModal"
      class="modal fade show"
      style="display: block; background: rgba(0, 0, 0, 0.6)"
      @click="mostrarModal = false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Foto del candidato</h5>
            <button class="btn-close" @click="mostrarModal = false"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="fotoModal" alt="Foto" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getSolicitudesEmpleo,
  eliminarSolicitudEmpleo,
} from "@/api/solicitudesEmpleo.js";
import Swal from "sweetalert2";
import { getFacturas } from "@/api/facturas.js";

// Mis cambios
const facturas = ref([]);
let cantTotal = 0;
onMounted(async () => {
  cargarFacturas();
});

const cargarFacturas = () => {
  getFacturas().then((data) => {
    console.log(data);
    console.log("YEYYYYY");
    facturas.value = data;
  });
};

const solicitudes = ref([]);
const mostrarModal = ref(false);
const fotoModal = ref("");

onMounted(async () => {
  await cargarSolicitudes();
});

const cargarSolicitudes = async () => {
  try {
    solicitudes.value = await getSolicitudesEmpleo();
  } catch (error) {
    console.error("Error al cargar solicitudes:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar las solicitudes.",
      confirmButtonText: "OK",
    });
  }
};

const urlFoto = (ruta) => {
  if (!ruta) return "";
  return `http://localhost:5000${ruta}`;
};

const verFotoGrande = (ruta) => {
  fotoModal.value = urlFoto(ruta);
  mostrarModal.value = true;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const eliminarSolicitud = async (solicitud) => {
  const result = await Swal.fire({
    title: "¿Eliminar solicitud?",
    text: `¿Estás seguro de eliminar la solicitud de ${solicitud.nombre} ${solicitud.apellidos}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  });

  if (result.isConfirmed) {
    try {
      await eliminarSolicitudEmpleo(solicitud.id);
      await cargarSolicitudes();
      Swal.fire({
        icon: "success",
        title: "Solicitud eliminada",
        text: "La solicitud ha sido eliminada correctamente.",
        confirmButtonText: "OK",
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la solicitud.",
        confirmButtonText: "OK",
      });
    }
  }
};
</script>

<style scoped>
.table-primary th {
  background-color: #ebf4f6 !important;
  color: #09637e !important;
}
</style>
