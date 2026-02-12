<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <h4
      class="text-center mb-4 fw-semibold border-bottom pb-2 mt-2"
      style="color: #7ab2b2"
    >
      <i class="bi bi-car-front me-2"></i>Registro de Vehículos
    </h4>

    <form @submit.prevent="guardarVehiculo" class="mb-2 mt-1">
      <!-- FILA: Tipo, Marca, Modelo -->
      <div class="row g-3 align-items-center mt-1">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Tipo:</label>
          <div class="d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-coche"
                value="coche"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-coche">Coche</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-furgoneta"
                value="furgoneta"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-furgoneta"
                >Furgoneta</label
              >
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-moto"
                value="moto"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-moto">Moto</label>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="marca" class="form-label mb-0 me-3 text-nowrap"
            >Marca:</label
          >
          <input
            type="text"
            id="marca"
            v-model="vehiculo.marca"
            @blur="capitalizarTexto('marca')"
            class="form-control rounded-0 shadow-none border"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="modelo" class="form-label mb-0 me-3 text-nowrap"
            >Modelo:</label
          >
          <input
            type="text"
            id="modelo"
            v-model="vehiculo.modelo"
            @blur="capitalizarTexto('modelo')"
            class="form-control rounded-0 shadow-none border"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="matricula" class="form-label mb-0 me-3 text-nowrap"
            >Matrícula:</label
          >
          <input
            type="text"
            id="matricula"
            v-model="vehiculo.matricula"
            @blur="convertirAMayusculas('matricula')"
            class="form-control rounded-0 shadow-none border"
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="anio" class="form-label mb-0 me-3 text-nowrap"
            >Año:</label
          >
          <input
            type="number"
            id="anio"
            v-model="vehiculo.anio"
            class="form-control rounded-0 shadow-none border text-end"
            required
          />
        </div>
      </div>

      <!-- FILA: Año, Kilómetros, Precio -->
      <div class="row g-3 align-items-center mt-2">
        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="kilometros" class="form-label mb-0 me-3 text-nowrap"
            >Kilómetros:</label
          >
          <input
            type="number"
            id="kilometros"
            v-model="vehiculo.kilometros"
            class="form-control rounded-0 shadow-none border text-end"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="precio" class="form-label mb-0 me-3 text-nowrap"
            >Precio (€):</label
          >
          <input
            type="number"
            id="precio"
            v-model="vehiculo.precio"
            class="form-control rounded-0 shadow-none border text-end"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="combustible" class="form-label mb-0 me-3 text-nowrap"
            >Combustible:</label
          >
          <select
            id="combustible"
            v-model="vehiculo.combustible"
            class="form-select rounded-0 shadow-none border"
          >
            <option disabled value="">Seleccione</option>
            <option>Gasolina</option>
            <option>Diésel</option>
            <option>Híbrido</option>
            <option>GLP</option>
            <option>Eléctrico</option>
          </select>
        </div>

        <div class="col-12 col-md-3 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap">Transmisión:</label>
          <div class="d-flex align-items-center">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="transmision-manual"
                value="coche"
                v-model="vehiculo.transmision"
              />
              <label class="form-check-label" for="transmision-manual"
                >Manual</label
              >
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="transmision-automatica"
                value="automatica"
                v-model="vehiculo.transmision"
              />
              <label class="form-check-label" for="transmision-automatica"
                >Automática</label
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="potencia" class="form-label mb-0 me-3 text-nowrap"
            >Potencia (CV):</label
          >
          <input
            type="number"
            id="potencia"
            v-model="vehiculo.potencia_cv"
            class="form-control rounded-0 shadow-none border text-end"
          />
        </div>
      </div>
      <!-- FILA: Descripción -->
      <div class="col g-2 mt-3">
        <label for="descripcion" class="form-label">Descripción:</label>
        <textarea
          id="descripcion"
          v-model="vehiculo.descripcion"
          rows="3"
          class="form-control rounded shadow-none border mb-2"
          placeholder="Describe el estado, revisiones, etc."
        >
        </textarea>
      </div>

      <!-- FILA: Imagen del vehículo-->
      <div class="row g-3 align-items-center mb-3">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label for="foto" class="form-label mb-0 me-2 text-nowrap"
            >Imagen del Vehículo:</label
          >
          <input
            type="file"
            id="foto"
            accept="image/*"
            @change="onFileChange"
            class="form-control-file col-md-10 border rounded-0 shadow-none btn-file-azul"
          />
        </div>
      </div>

      <h4
        class="text-center mb-4 fw-semibold border-bottom pb-2 mt-2"
        style="color: #7ab2b2"
      >
        <i class="bi bi-person me-2"></i>Cliente Ubicación
      </h4>
      <!-- FILA: Ubicación -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="provincia" class="form-label">Provincia:</label>
          <select
            id="provincia"
            v-model="vehiculo.ubicacion.provincia"
            class="form-select rounded shadow-none border"
            @change="filtrarCiudades"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for="ciudad" class="form-label">Ciudad:</label>
          <select
            id="ciudad"
            v-model="vehiculo.ubicacion.ciudad"
            class="form-select rounded shadow-none border"
          >
            <option disabled value="">Seleccione ciudad</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for="fecha_publicacion" class="form-label"
            >Fecha Publicación:</label
          >
          <input
            type="date"
            id="fecha_publicacion"
            v-model="vehiculo.fecha_publicacion"
            class="form-control rounded shadow-none border"
          />
        </div>
      </div>

      <!-- FILA: Contacto -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="contacto_nombre" class="form-label"
            >Nombre Contacto:</label
          >
          <input
            type="text"
            id="contacto_nombre"
            v-model="vehiculo.contacto.nombre"
            @blur="capitalizarContacto('nombre')"
            class="form-control rounded shadow-none border"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_telefono" class="form-label">Teléfono:</label>
          <input
            type="tel"
            id="contacto_telefono"
            v-model="vehiculo.contacto.telefono"
            @blur="validarTelefono"
            class="form-control rounded shadow-none border text-center"
            :class="{ 'is-invalid': !telefonoValido }"
          />
          <div v-if="!telefonoValido" class="invalid-feedback">
            Teléfono inválido (debe empezar por 6 o 7 y tener 9 dígitos).
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_email" class="form-label">Email:</label>
          <input
            type="email"
            id="contacto_email"
            v-model="vehiculo.contacto.email"
            @blur="validarEmail"
            class="form-control rounded shadow-none border"
            :class="{ 'is-invalid': !emailValido }"
          />
          <div v-if="!emailValido" class="invalid-feedback">
            Email inválido.
          </div>
        </div>
      </div>

      <!-- FILA: Estado y botón -->
      <div class="d-flex align-items-center justify-content-between mt-3">
        <div>
          <label class="form-label me-2">Estado:</label>
          <select
            v-model="vehiculo.estado"
            class="form-select d-inline-block w-auto rounded shadow-none border"
          >
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>

        <div>
          <button
            class="btn btn-primary rounded border shadow-none px-4"
            style="background-color: #088395;"
            type="submit"
          >
            {{ editando ? "Modificar" : "Guardar" }}
          </button>
        </div>
      </div>
    </form>
    <div class="table-responsive">
      <h4 class="text-center mb-3" style="color: #7ab2b2">
        Listado de Modelos
      </h4>
      
      <!-- Botones de impresión -->
      <div class="d-flex justify-content-between align-items-center mb-3 gap-3">
        <!-- Imprimir por marca (izquierda) -->
        <div class="d-flex align-items-center gap-2" style="flex: 1; max-width: 400px;">

          <button
            class="btn btn-secondary rounded shadow-sm px-3 border-2"
            type="button"
            @click="imprimirPorMarca"
            style="white-space: nowrap; background-color: #7ab2b2; border-color: #7ab2b2 ;"
            
          >
            <i class="bi bi-printer me-2"></i>Marca
          </button>

          <input
            type="text"
            id="marcaFiltro"
            v-model="filtroMarca"
            @blur="capitalizarFiltroMarca"
            class="form-control rounded shadow-none border-2"
            placeholder="Indica la marca a imprimir"
            style="flex: 1; border-color: #7ab2b2;"
          />
        </div>

        <!-- Imprimir Todo (derecha) -->
        <button
          @click="imprimirTodos"
          class="btn btn-secondary rounded shadow-sm px-3 border-2"
          type="button"
          style="background-color: #7ab2b2; border-color: #7ab2b2;  "
        >
          <i class="bi bi-printer me-2"></i>Imprimir Todo
        </button>
      </div>

      <table
        class="table table-bordered table-striped table-sm table-hover table-sm align-middle"
      >
        <thead>
          <tr class="table-primary text-center">
            <th>Imagen</th>
            <th>Matrícula</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="modelo in modelos" :key="modelo._id" class="text-center">
            <td>
              <img 
                v-if="modelo.imagen"
                :src="`http://localhost:5000${modelo.imagen}`"
                alt="Vehículo"
                style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"
              />
              <span v-else class="text-muted">Sin imagen</span>
            </td>
            <td>{{ modelo.matricula }}</td>
            <td>{{ modelo.marca }}</td>
            <td>{{ modelo.modelo }}</td>
            <td>{{ modelo.estado }}</td>
            <td>
              <div>
                {{ modelo.contacto.nombre }} {{ modelo.contacto.telefono }}
              </div>
            </td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="editarVehiculo(modelo)"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, computed, onMounted } from "vue";
import { addArticulo, updateArticulo, getArticulos } from "@/api/articulos.js";
import provmuniData from "@/data/provmuni.json";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Mis cambios
const modelos = ref([]);

onMounted(async () => {
  cargarModelos();
});

const cargarModelos = () => {
  getArticulos().then((data) => {
    console.log(data);
    modelos.value = data;
  });
};

const vehiculo = ref({
  tipo: "",
  matricula: "",
  marca: "",
  modelo: "",
  anio: 0,
  estado: "disponible",
  kilometros: 0,
  precio: 0,
  combustible: "",
  transmision: "",
  potencia_cv: 0,
  descripcion: "",
  ubicacion: {
    provincia: "",
    ciudad: "",
  },
  contacto: {
    nombre: "",
    telefono: "",
    email: "",
  },
});

const editando = ref(false);

// Cargar provincias y municipios desde JSON
const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);

// Filtrar municipios según provincia seleccionada
const filtrarCiudades = () => {
  const nombreProv = vehiculo.value.ubicacion.provincia;
  const prov = provincias.value.find((p) => p.nm === nombreProv);
  if (!prov) {
    municipiosFiltrados.value = [];
    return;
  }
  const codigoProv = prov.id.slice(0, 2);
  municipiosFiltrados.value = municipios.value.filter((m) =>
    m.id.startsWith(codigoProv),
  );
  vehiculo.value.ubicacion.ciudad = "";
};

const capitalizarTexto = (campo) => {
  const texto = vehiculo.value[campo] ?? "";
  if (texto.trim() === "") return;
  vehiculo.value[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

const convertirAMayusculas = (campo) => {
  const texto = vehiculo.value[campo] ?? "";
  if (texto.trim() === "") return;
  vehiculo.value[campo] = texto.toUpperCase();
};

const capitalizarContacto = (campo) => {
  const texto = vehiculo.value.contacto[campo] ?? "";
  if (texto.trim() === "") return;
  vehiculo.value.contacto[campo] = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

// Validar teléfono
const telefonoValido = ref(true);
const telefonoRegex = /^[67]\d{8}$/;

const validarTelefono = () => {
  const telefono = vehiculo.value.contacto.telefono.trim();

  if (telefono === "") {
    telefonoValido.value = true; // Vacío = válido (opcional)
    return true;
  }

  if (telefono.charAt(0) === "6" || telefono.charAt(0) === "7") {
    telefonoValido.value = telefonoRegex.test(telefono);
    return telefonoValido.value;
  } else {
    telefonoValido.value = false;
    return false;
  }
};

// Validar email
const emailValido = ref(true);
const validarEmail = () => {
  const email = vehiculo.value.contacto.email.trim();
  if (email === "") {
    emailValido.value = true; // Vacío = válido (opcional)
    return true;
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  emailValido.value = regex.test(email);
};

// Editar vehículo
const editarVehiculo = (modelo) => {
  editando.value = true;
  vehiculo.value = { ...modelo };
};

// Enviar datos al backend
const guardarVehiculo = async () => {
  // Validar campos obligatorios
  if (!vehiculo.value.tipo) {
    Swal.fire({
      icon: "error",
      title: "Campo obligatorio",
      text: "Debe seleccionar el tipo de vehículo.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.marca || !vehiculo.value.modelo || !vehiculo.value.anio) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: "Marca, modelo y año son campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.kilometros || !vehiculo.value.precio) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: "Kilómetros y precio son campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.combustible) {
    Swal.fire({
      icon: "error",
      title: "Campo obligatorio",
      text: "Debe seleccionar el tipo de combustible.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.transmision) {
    Swal.fire({
      icon: "error",
      title: "Campo obligatorio",
      text: "Debe seleccionar el tipo de transmisión.",
      showConfirmButton: true,
    });
    return;
  }

  if (!vehiculo.value.ubicacion.provincia || !vehiculo.value.ubicacion.ciudad) {
    Swal.fire({
      icon: "error",
      title: "Campos obligatorios",
      text: "Provincia y ciudad son campos obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  if (
    !vehiculo.value.contacto.nombre ||
    !vehiculo.value.contacto.telefono ||
    !vehiculo.value.contacto.email
  ) {
    Swal.fire({
      icon: "error",
      title: "Datos de contacto incompletos",
      text: "Nombre, teléfono y email de contacto son obligatorios.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar teléfono antes de guardar
  if (!telefonoValido.value) {
    Swal.fire({
      icon: "error",
      title: "Teléfono inválido",
      text: "El teléfono debe empezar por 6 o 7 y tener 9 dígitos.",
      showConfirmButton: true,
    });
    return;
  }

  // Validar email antes de guardar
  if (!emailValido.value) {
    Swal.fire({
      icon: "error",
      title: "Email inválido",
      text: "Por favor, introduce un email válido.",
      showConfirmButton: true,
    });
    return;
  }

  try {
    if (editando.value) {
      // Modo edición: actualizar artículo existente
      let updateData = vehiculo.value;

      // Si hay imagen nueva, usar FormData
      if (archivo.value) {
        const formData = new FormData();
        formData.append("imagen", archivo.value);
        formData.append("vehiculo", JSON.stringify(vehiculo.value));
        updateData = formData;
      }

      const resultado = await updateArticulo(vehiculo.value._id, updateData);
      if (resultado) {
        Swal.fire({
          icon: "success",
          title: "Vehículo actualizado",
          text: "El vehículo ha sido actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
        editando.value = false;
        cargarModelos();
      }
    } else {
      // Modo creación: crear nuevo artículo
      const formData = new FormData();

      if (archivo.value) {
        formData.append("imagen", archivo.value);
      }

      formData.append("vehiculo", JSON.stringify(vehiculo.value));

      const nuevo = await addArticulo(formData);

      if (nuevo && nuevo._id) {
        Swal.fire({
          icon: "success",
          title: "Vehículo guardado",
          text: "El vehículo ha sido guardado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
        cargarModelos();
      } else {
        console.error("Error al guardar el vehículo");
      }
    }

    // Limpiar formulario
    Object.assign(vehiculo.value, {
      tipo: "",
      matricula: "",
      marca: "",
      modelo: "",
      anio: 0,
      estado: "disponible",
      kilometros: 0,
      precio: 0,
      combustible: "",
      transmision: "",
      potencia_cv: 0,
      descripcion: "",
      ubicacion: {
        provincia: "",
        ciudad: "",
      },
      contacto: {
        nombre: "",
        telefono: "",
        email: "",
      },
    });
    archivo.value = null;
  } catch (error) {
    console.error("Error al guardar:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar el vehículo: " + error.message,
      showConfirmButton: true,
    });
  }
};

const archivo = ref(null);

const filtroMarca = ref("");

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    archivo.value = file;
  }
};

const capitalizarFiltroMarca = () => {
  const texto = filtroMarca.value ?? "";
  if (texto.trim() === "") return;
  filtroMarca.value = texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => {
      if (!palabra) return "";
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
};

const imprimirPorMarca = () => {
  imprimirPDF(filtroMarca.value || undefined);
};

const imprimirTodos = () => {
  imprimirPDF(null);
};

const imprimirPDF = (marca) => {
  const doc = new jsPDF();

  const now = new Date();
  const fecha = now.toISOString().split("T")[0];
  const pad = (n) => String(n).padStart(2, "0");
  const hora = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  // Page/margins setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 15;
  const rightMargin = 15;
  const usableWidth = pageWidth - leftMargin - rightMargin;

  // Columns widths (will be scaled to usableWidth if needed)
  const colWidths = [30, 35, 45, 25, 30, 25]; // Matrícula, Marca, Modelo, Estado, Combustible, Precio
  const cols = [
    "Matrícula",
    "Marca",
    "Modelo",
    "Estado",
    "Combustible",
    "Precio",
  ];

  const sumWidths = colWidths.reduce((a, b) => a + b, 0);
  if (Math.abs(sumWidths - usableWidth) > 0.1) {
    const scale = usableWidth / sumWidths;
    for (let i = 0; i < colWidths.length; i++) colWidths[i] *= scale;
  }

  // Layout
  const titleY = 20;
  const headerYStart = 32;
  const rowHeight = 8;
  const footerLimitY = 280;
  const cellPadding = 2;

  const rgbFromHex = (hex) => {
    const h = hex.replace("#", "");
    return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
  };
  const headerBg = "#09637e";
  const headerRgb = rgbFromHex(headerBg);

  const truncateToWidth = (text, maxWidth, fontSize, fontStyle = "normal") => {
    doc.setFont(undefined, fontStyle);
    doc.setFontSize(fontSize);
    if (doc.getTextWidth(text) <= maxWidth) return text;
    const ell = "...";
    let low = 0;
    let high = text.length;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      const candidate = text.slice(0, mid) + ell;
      if (doc.getTextWidth(candidate) <= maxWidth) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }
    return text.slice(0, low) + ell;
  };

  const drawHeader = (y) => {
    let x = leftMargin;
    doc.setFillColor(headerRgb[0], headerRgb[1], headerRgb[2]);
    for (let i = 0; i < cols.length; i++) {
      const w = colWidths[i];
      doc.rect(x, y, w, rowHeight, "FD");
      x += w;
    }
    x = leftMargin;
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    for (let i = 0; i < cols.length; i++) {
      const w = colWidths[i];
      const available = w - cellPadding * 2;
      const txt = truncateToWidth(cols[i], available, 10, "bold");
      const textX = x + cellPadding;
      const textY = y + rowHeight / 2 + 10 / 2.8;
      doc.text(txt, textX, textY);
      x += w;
    }
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
  };

  // Title
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("Listado de Vehículos", pageWidth / 2, titleY, { align: "center" });
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha: ${fecha}`, pageWidth / 2, titleY + 6, { align: "center" });

  // Table
  let currentY = headerYStart;
  drawHeader(currentY);
  currentY += rowHeight;

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");

  const marcaFiltro = (marca === null) ? "" : (marca !== undefined ? String(marca).trim().toLowerCase() : (filtroMarca.value || "").trim().toLowerCase());

  modelos.value.forEach((modelo) => {
    const modeloMarca = String(modelo.marca || "").trim().toLowerCase();
    const matches = !marcaFiltro || modeloMarca === marcaFiltro;
    if (!matches) return;

    if (currentY + rowHeight > footerLimitY) {
      doc.addPage();
      currentY = headerYStart;
      drawHeader(currentY);
      currentY += rowHeight;
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
    }

    let x = leftMargin;
    const cells = [
      String(modelo.matricula || ""),
      String(modelo.marca || ""),
      String(modelo.modelo || ""),
      String(modelo.estado || ""),
      String(modelo.combustible || ""),
      modelo.precio != null ? `${modelo.precio} €` : "0 €",
    ];

    for (let i = 0; i < cells.length; i++) {
      const w = colWidths[i];
      doc.rect(x, currentY, w, rowHeight);
      const available = w - cellPadding * 2;
      const txt = truncateToWidth(cells[i], available, 9, "normal");
      const textX = x + cellPadding;
      const textY = currentY + rowHeight / 2 + 9 / 2.8;
      doc.text(txt, textX, textY);
      x += w;
    }

    currentY += rowHeight;
  });

  const filePDF = `listado_vehiculos_${fecha}_${hora}.pdf`;
  doc.save(filePDF);
};

</script>

<style scoped>

.table-primary th {
  background-color: #ebf4f6 !important;
  color: #09637e !important;
}



/*

IMPRIMIR ANTIGUO




const imprimirPDF = () => {
  const doc = new jsPDF();

  const fecha = new Date().toISOString().split("T")[0];
  doc.setFontSize(16);
  doc.text("Listado de Vehículos", 75, 20);

  doc.setFontSize(10);
  doc.text(`Fecha: ${fecha}`, 85, 25);

  // Crear tabla manualmente sin autoTable
  let yPosition = 35;
  const columnX = [15, 35, 60, 90, 130, 165];
  const headers = [
    "Matrícula",
    "Marca",
    "Modelo",
    "Estado",
    "Combustible",
    "Precio",
  ];

  // Headers
  doc.setFont(undefined, "bold");
  headers.forEach((header, i) => {
    doc.text(header, columnX[i], yPosition);
  });

  yPosition += 8;
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);

  // Datos
  modelos.value.forEach((modelo) => {
    doc.text(String(modelo.matricula || ""), columnX[0], yPosition);
    doc.text(String(modelo.marca || ""), columnX[1], yPosition);
    doc.text(String(modelo.modelo || ""), columnX[2], yPosition);
    doc.text(String(modelo.estado || ""), columnX[3], yPosition);
    doc.text(String(modelo.combustible || ""), columnX[4], yPosition);
    doc.text(`${modelo.precio || 0} €`, columnX[5], yPosition);

    yPosition += 7;
  });

  const hora = new Date().toLocaleTimeString().split(" ")[0];
  const filePDF = `listado_vehiculos_${fecha}_${hora.replace(/:/g, "-")}.pdf`;

  doc.save(filePDF);
};






*/
</style>






