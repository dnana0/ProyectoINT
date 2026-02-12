<template>
  <div class="container mt-4">
    <div class="mx-auto p-4 border rounded-3 shadow-sm bg-light" style="max-width: 800px;">
      <h3 class="text-center mb-4 d-flex align-items-center justify-content-center" style="color: #7ab2b2">
        <i class="bi bi-briefcase-fill fs-3 me-2"></i>
        Solicitud de Empleo
      </h3>

      <form @submit.prevent="enviarSolicitud">
        <!-- Nombre y Apellidos -->
        <div class="row mb-3 g-3">
          <div class="col-md-6">
            <label for="nombre" class="form-label">Nombre:</label>
            <input
              type="text"
              id="nombre"
              v-model="solicitud.nombre"
              @blur="capitalizarTexto('nombre')"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="apellidos" class="form-label">Apellidos:</label>
            <input
              type="text"
              id="apellidos"
              v-model="solicitud.apellidos"
              @blur="capitalizarTexto('apellidos')"
              class="form-control"
              required
            />
          </div>
        </div>

        <!-- Email y Teléfono -->
        <div class="row mb-3 g-3">
          <div class="col-md-6">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              id="email"
              v-model="solicitud.email"
              class="form-control"
              :class="{ 'is-invalid': !emailValido }"
              required
            />
            <small v-if="!emailValido" class="text-danger">Email inválido</small>
          </div>
          <div class="col-md-6">
            <label for="telefono" class="form-label">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              v-model="solicitud.telefono"
              class="form-control"
              :class="{ 'is-invalid': !telefonoValido }"
              required
            />
            <small v-if="!telefonoValido" class="text-danger">Teléfono inválido (6 o 7 + 8 dígitos)</small>
          </div>
        </div>

        <!-- Dirección -->
        <div class="mb-3">
          <label for="direccion" class="form-label">Dirección:</label>
          <input
            type="text"
            id="direccion"
            v-model="solicitud.direccion"
            @blur="capitalizarTexto('direccion')"
            class="form-control"
            required
          />
        </div>

        <!-- Provincia y Municipio -->
        <div class="row mb-3 g-3">
          <div class="col-md-6">
            <label for="provincia" class="form-label">Provincia:</label>
            <select
              id="provincia"
              v-model="solicitud.provincia"
              class="form-select"
              @change="filtrarMunicipios"
              required
            >
              <option disabled value="">Seleccione provincia</option>
              <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
                {{ prov.nm }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="municipio" class="form-label">Municipio:</label>
            <select
              id="municipio"
              v-model="solicitud.municipio"
              class="form-select"
              required
            >
              <option disabled value="">Seleccione municipio</option>
              <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">
                {{ mun.nm }}
              </option>
            </select>
          </div>
        </div>

        <!-- Foto -->
        <div class="mb-3">
          <label for="foto" class="form-label">Foto (opcional):</label>
          <input
            type="file"
            id="foto"
            @change="handleFileUpload"
            class="form-control"
            accept="image/*"
          />
          <small class="text-muted">Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB</small>
        </div>

        <!-- Vista previa de la foto -->
        <div v-if="vistaPrevia" class="mb-3 text-center">
          <img :src="vistaPrevia" alt="Vista previa" class="img-thumbnail" style="max-height: 200px;" />
        </div>

        <!-- Botón Enviar -->
        <div class="d-flex justify-content-center mt-4">
          <button
            type="submit"
            class="btn btn-primary px-5"
            style="background-color: #088395;"
            :disabled="!formularioValido"
          >
            <i class="bi bi-send me-2"></i>Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { crearSolicitudEmpleo } from '@/api/solicitudesEmpleo.js';
import provmuniData from '@/data/provmuni.json';
import Swal from 'sweetalert2';

const solicitud = ref({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  direccion: '',
  provincia: '',
  municipio: ''
});

const foto = ref(null);
const vistaPrevia = ref(null);

const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);

// Validaciones
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const telefonoRegex = /^[67]\d{8}$/;

const emailValido = computed(() => {
  if (!solicitud.value.email) return true;
  return emailRegex.test(solicitud.value.email);
});

const telefonoValido = computed(() => {
  if (!solicitud.value.telefono) return true;
  return telefonoRegex.test(solicitud.value.telefono);
});

const formularioValido = computed(() => {
  return (
    solicitud.value.nombre.trim() !== '' &&
    solicitud.value.apellidos.trim() !== '' &&
    solicitud.value.email.trim() !== '' &&
    solicitud.value.telefono.trim() !== '' &&
    solicitud.value.direccion.trim() !== '' &&
    solicitud.value.provincia !== '' &&
    solicitud.value.municipio !== '' &&
    emailValido.value &&
    telefonoValido.value
  );
});

// Capitalizar texto
const capitalizarTexto = (campo) => {
  const texto = solicitud.value[campo] ?? '';
  solicitud.value[campo] = texto
    .toLowerCase()
    .split(' ')
    .map((palabra) => {
      if (!palabra) return '';
      return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
    })
    .join(' ');
};

// Filtrar municipios
const filtrarMunicipios = () => {
  const nombreProv = solicitud.value.provincia;
  const prov = provincias.value.find((p) => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }

  const codigoProv = prov.id.slice(0, 2);
  municipiosFiltrados.value = municipios.value.filter((m) =>
    m.id.startsWith(codigoProv)
  );
  solicitud.value.municipio = '';
};

// Manejar subida de archivo
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El tamaño máximo es 5MB',
        confirmButtonText: 'OK'
      });
      event.target.value = '';
      return;
    }

    foto.value = file;
    
    // Vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      vistaPrevia.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Enviar solicitud
const enviarSolicitud = async () => {
  if (!formularioValido.value) return;

  try {
    const formData = new FormData();
    formData.append('nombre', solicitud.value.nombre);
    formData.append('apellidos', solicitud.value.apellidos);
    formData.append('email', solicitud.value.email);
    formData.append('telefono', solicitud.value.telefono);
    formData.append('direccion', solicitud.value.direccion);
    formData.append('provincia', solicitud.value.provincia);
    formData.append('municipio', solicitud.value.municipio);
    
    if (foto.value) {
      formData.append('foto', foto.value);
    }

    await crearSolicitudEmpleo(formData);

    Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada',
      text: 'Tu solicitud de empleo ha sido enviada correctamente.',
      confirmButtonText: 'OK'
    });

    // Limpiar formulario
    solicitud.value = {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      direccion: '',
      provincia: '',
      municipio: ''
    };
    foto.value = null;
    vistaPrevia.value = null;
    municipiosFiltrados.value = [];
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar la solicitud. Inténtalo de nuevo.',
      confirmButtonText: 'OK'
    });
  }
};
</script>

<style scoped>
.is-invalid {
  border-color: #ff1616 !important;
  background-color: antiquewhite;
}
</style>
