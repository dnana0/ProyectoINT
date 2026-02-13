<template>
    <div class="container-fluid my-1 p-4 border rounded-3 shadow-sm bg-light">
        <!-- Encabezado con título y botón -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0 d-flex align-items-center" style="color: #7AB2B2;">
                <i class="bi bi-person-gear fs-3 me-2"></i>
                Gestión de Citas del Taller
            </h3>
            <button 
                type="button"
                class="btn btn-outline-primary"
                @click="limpiarPagina"
                title="Limpiar formulario"
            >
                <i class="bi bi-arrow-counterclockwise me-2"></i>Limpiar
            </button>
        </div>

        <!-- Formulario para añadir o modificar citas -->
        <form @submit.prevent="guardarCita" class="mb-4">
            <!-- Primera fila: Matrícula, Móvil, Fecha -->
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <label for="matricula" class="form-label">Matrícula:</label>
                    <input 
                        type="text"
                        class="form-control"
                        id="matricula"
                        placeholder="Ej: 1234ABC"
                        pattern="[0-9]{4}[A-Za-z]{3}"
                        v-model="nuevaCita.matricula" 
                        required 
                    />
                    <small class="text-muted">Formato: 4 números + 3 letras</small>
                </div>

                <div class="col-md-4">
                    <label for="movil" class="form-label">Móvil:</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="movil"
                        placeholder="Ej: 612345678"
                        pattern="[0-9]{9}"
                        v-model="nuevaCita.movil" 
                        required
                    />
                    <small class="text-muted">9 dígitos</small>
                </div>

                <div class="col-md-4">
                    <label for="fechaCita" class="form-label">Fecha Cita:</label>
                    <input 
                        type="date" 
                        class="form-control" 
                        id="fechaCita"
                        v-model="nuevaCita.fechaCita"
                        required 
                    />
                </div>
            </div>

            <!-- Segunda fila: Estado, Concesionario, Acepta -->
            <div class="row g-3 mb-3 align-items-center">
                <div class="col-md-3">
                    <label class="form-label d-block">Estado de la cita:</label>
                    <div class="d-flex gap-3 mt-2">
                        <div class="form-check">
                            <input 
                                type="radio" 
                                class="form-check-input" 
                                id="estadoPendiente"
                                v-model="nuevaCita.estadoCita" 
                                value="Pendiente" 
                                required
                            />
                            <label class="form-check-label" for="estadoPendiente">
                                Pendiente
                            </label>
                        </div>
                        <div class="form-check">
                            <input 
                                type="radio" 
                                class="form-check-input" 
                                id="estadoFinalizado"
                                v-model="nuevaCita.estadoCita" 
                                value="Finalizado" 
                                required
                            />
                            <label class="form-check-label" for="estadoFinalizado">
                                Finalizado
                            </label>
                        </div>
                    </div>
                </div>

                <div class="col-md-5">
                    <label for="servicioTaller" class="form-label">Concesionario:</label>
                    <select 
                        id="servicioTaller"
                        v-model="nuevaCita.servicioTaller" 
                        class="form-select"
                        required
                    >
                        <option disabled value="">Selecciona un servicio</option>
                        <option v-for="servicio in listaServicios" :key="servicio" :value="servicio">
                            {{ servicio }}
                        </option>
                    </select>
                </div>

                <div class="col-md-4">
                    <label class="form-label d-block">Confirmar datos:</label>
                    <div class="form-check mt-2">
                        <input 
                            type="checkbox" 
                            class="form-check-input" 
                            id="acepta"
                            v-model="nuevaCita.acepta"
                            required
                        />
                        <label class="form-check-label" for="acepta">
                            Acepto los términos y condiciones
                        </label>
                    </div>
                </div>
            </div>

            <!-- Botón centrado -->
            <div class="d-flex justify-content-center mt-4">
                <button 
                    type="submit" 
                    class="btn btn-primary px-5"
                    style="background-color: #088395; border-color: #088395;"
                    :disabled="!nuevaCita.acepta"
                >
                    <i class="bi me-2" :class="editando ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
                    {{ editando ? "Modificar Cita" : "Añadir Cita" }}
                </button>
            </div>
        </form>

        <!-- Separador visual -->
        <hr class="my-4" style="border-top: 2px solid #7AB2B2; opacity: 0.5;">

        <!-- Tabla que muestra la lista de citas cargados -->
        <div class="mt-4">
            <h5 class="mb-3 text-center" style="color: #7AB2B2;">
                <i class="bi bi-list-ul me-2"></i>Listado de Citas
            </h5>
            
            <!-- Filtro por estado -->
            <div class="row mb-3">
                <div class="col-md-2">
                    <!-- <label for="filtroEstado" class="form-label">
                        <i class="bi bi-funnel me-2"></i>Filtrar por Estado:
                    </label> -->
                    <select 
                        id="filtroEstado"
                        v-model="filtroEstado" 
                        class="form-select"
                    >
                        <option value="">Todos los estados</option>
                        <option v-for="estado in estadosUnicos" :key="estado" :value="estado">
                            {{ estado }}
                        </option>
                    </select>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover align-middle">
                    <thead class="table-primary text-center">
                        <tr>
                            <th>ID</th>
                            <th>Fecha Cita</th>
                            <th>Matrícula</th>
                            <th>Móvil</th>
                            <th>Servicio</th>
                            <th>Estado</th>  
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr class="text-center" v-for="cita in citasFiltradas" :key="cita.id">  <!-- cita in citas si no aplicamos ningun filtro -->
                            <td>{{ cita.id }}</td>
                            <td>{{ formatearFecha(cita.fechaCita) }}</td>
                            <td>{{ cita.matricula }}</td>
                            <td>{{ cita.movil }}</td>
                            <td>{{ cita.servicioTaller }}</td>
                            <td>
                                <span 
                                    class="badge"
                                    :class="cita.estadoCita === 'Pendiente' ? 'bg-warning text-dark' : 'bg-success'"
                                >
                                    {{ cita.estadoCita }}
                                </span>
                            </td>
                            <td class="align-middle text-center">
                                <!-- Botón para editar una cita -->
                                <button 
                                    class="btn btn-sm btn-warning me-2"
                                    style="background-color: #7AB2B2; border-color: #7AB2B2;"
                                    @click="editarCita(cita.id)"
                                    title="Editar cita"
                                >
                                    <i class="bi bi-pencil"></i>
                                </button>
                                
                                <!-- Botón para eliminar una cita -->
                                <button 
                                    class="btn btn-sm btn-danger"
                                    style="background-color: #088395; border-color: #088395;"
                                    @click="borrarCita(cita.id)"
                                    title="Eliminar cita"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import {addCita, updateCita, deleteCita, getCita} from '../api/taller'
import Swal from "sweetalert2";

const citas = ref([])
const nuevaCita = ref({
    matricula: "",
    movil: "",
    fechaCita: "",
    servicioTaller: "",
    estadoCita: "",
    acepta: false
})
const listaServicios = [
    "revisión",
    "preITV",
    "neumáticos",
    "frenos",
    "cambios de aceite"
]

const editando = ref(false)
const citaEditandoId = ref("")
const filtroEstado = ref("")

// Computed property para obtener estados únicos de las citas existentes
const estadosUnicos = computed(() => {
    const estados = citas.value.map(cita => cita.estadoCita)
    return [...new Set(estados)].sort()
})

// Computed property para filtrar citas según el estado seleccionado
const citasFiltradas = computed(() => {
    if (!filtroEstado.value) {
        return citas.value
    }
    return citas.value.filter(cita => cita.estadoCita === filtroEstado.value)
})

async function cargarCita() {
    try {
        Swal.fire({
            icon: 'success',
            title: "Listando Citas..",
            showConfirmButton: false,
            timer: 1500
        });
        citas.value = await getCita()
    } catch (error) {
        console.error("Error al cargar las citas", error)
    }
}

onMounted(async () => {
    await cargarCita()
})

async function guardarCita() {
    if (!nuevaCita.value.matricula.trim() || !nuevaCita.value.movil.trim() || !nuevaCita.value.servicioTaller.trim()|| !nuevaCita.value.estadoCita.trim()) {
        alert("Rellena todos los campos")
        return
    }

    if (!nuevaCita.value.acepta) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes aceptar antes de guardar',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    if (!editando.value) {
    const duplicado = citas.value.find(
      (cita) =>
        cita.movil === nuevaCita.value.movil
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "Cliente duplicado ",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
}
    const result = await Swal.fire({
        title: editando.value
            ? "¿Desea modificar este vendedor?"
            : "¿Desea añadir este vendedor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: editando.value ? "Modificar" : "Grabar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
        return
    }

    if (editando.value) {
        const index = citas.value.findIndex((cita) => cita.id === citaEditandoId.value)
        if (index !== -1) {
            citas.value[index] = { ...nuevaCita.value }
        }
        try {
            await updateCita(citaEditandoId.value, nuevaCita.value)
            Swal.fire({
                icon: "success",
                title: "Cita actualizada",
                showConfirmButton: false,
                timer: 1500,
            });
            limpiarPagina()

        } catch (error) {
            console.error("Ha sucedido un error al actualizar", error)
            Swal.fire({
                icon: "error",
                title: "Error al actualizar la cita",
                text: "Inténtalo más tarde",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    } else {
        const citaNueva = {
            id: String(citas.value.length > 0 ? citas.value.length + 1 : 1),
            matricula: nuevaCita.value.matricula.toUpperCase(),
            movil: nuevaCita.value.movil,
            fechaCita: nuevaCita.value.fechaCita,
            servicioTaller: nuevaCita.value.servicioTaller,
            estadoCita: nuevaCita.value.estadoCita,
            acepta: nuevaCita.value.acepta,
        }

        try {
            await addCita(citaNueva)
            citas.value.push(citaNueva)
            Swal.fire({
                icon: "success",
                title: "Cita añadida",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error al añadir la cita", error)
            Swal.fire({
                icon: "error",
                title: "Error al añadir la cita",
                text: "Inténtalo más tarde",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
    limpiarPagina()
    
}
async function borrarCita(id) {
    try {
        const result = await Swal.fire({
        title: "¿Está seguro que quiere eliminar esta cita?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar" 
    })
    if (!result.isConfirmed) {
        return
    }
    await deleteCita(id)
    citas.value = citas.value.filter((cita) => cita.id !== id)
    Swal.fire({
                icon: "success",
                title: "Cita eliminada",
                showConfirmButton: false,
                timer: 1500,
            });
    } catch (error) {
        console.error("Error al eliminar la cita", error)
            Swal.fire({
                icon: "error",
                title: "Error al eliminar la cita",
                text: "Inténtalo más tarde",
                showConfirmButton: false,
                timer: 1500,
            });
    }
}

async function editarCita(id) {
    editando.value = true
    nuevaCita.value = {...citas.value.find((cita) => cita.id === id)}
    citaEditandoId.value = id
}


function limpiarPagina() {
        nuevaCita.value = {
        matricula: "",
        movil: "",
        fechaCita: "",
        servicioTaller: "",
        estadoCita: "",
        acepta: false
    };
    editando.value = false;
    citaEditandoId.value = "";
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "";
  const [year, month, day] = fechaISO.split("-");
  return `${day}-${month}-${year}`;
}



</script>
<style scoped>
.table-primary th {
  background-color: #ebf4f6 !important;
  color: #09637e !important;
  font-weight: 600;
}

.form-label {
  font-weight: 500;
  color: #09637e;
  margin-bottom: 0.5rem;
}

.form-control:focus,
.form-select:focus,
.form-check-input:focus {
  border-color: #088395;
  box-shadow: 0 0 0 0.25rem rgba(8, 131, 149, 0.25);
}

.form-check-input:checked {
  background-color: #088395;
  border-color: #088395;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

small.text-muted {
  font-size: 0.8rem;
  color: #6c757d !important;
}

.btn-outline-primary {
  color: #088395;
  border-color: #088395;
}

.btn-outline-primary:hover {
  background-color: #088395;
  border-color: #088395;
  color: white;
}

.table-responsive {
  border-radius: 0.375rem;
  overflow: hidden;
}
</style>