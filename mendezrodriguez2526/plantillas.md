# Plantilla: Componente con Formulario y Lista

## Estructura básica de un componente Vue con formulario que crea objetos y los visualiza

```vue
<template>
  <div class="container mt-4">
    <h2>Gestión de [Nombre Entidad]</h2>

    <!-- FORMULARIO PARA CREAR OBJETOS -->
    <div class="card mb-4">
      <div class="card-header">
        <h5>{{ modoEdicion ? "Editar" : "Nuevo" }} [Entidad]</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="guardarObjeto">
          <!-- Campos del formulario -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="campo1" class="form-label">Campo 1</label>
              <input
                type="text"
                class="form-control"
                id="campo1"
                v-model="objeto.campo1"
                required
              />
            </div>

            <div class="col-md-6">
              <label for="campo2" class="form-label">Campo 2</label>
              <input
                type="text"
                class="form-control"
                id="campo2"
                v-model="objeto.campo2"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label for="campo3" class="form-label">Campo 3</label>
            <textarea
              class="form-control"
              id="campo3"
              v-model="objeto.campo3"
              rows="3"
            ></textarea>
          </div>

          <!-- Select ejemplo -->
          <div class="mb-3">
            <label for="categoria" class="form-label">Categoría</label>
            <select
              class="form-select"
              id="categoria"
              v-model="objeto.categoria"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="cat1">Categoría 1</option>
              <option value="cat2">Categoría 2</option>
              <option value="cat3">Categoría 3</option>
            </select>
          </div>

          <!-- Checkbox ejemplo -->
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="activo"
              v-model="objeto.activo"
            />
            <label class="form-check-label" for="activo"> Activo </label>
          </div>

          <!-- Botones -->
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-save me-2"></i>
              {{ modoEdicion ? "Actualizar" : "Guardar" }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="limpiarFormulario"
              v-if="modoEdicion"
            >
              <i class="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- LISTADO DE OBJETOS -->
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Listado de [Entidades]</h5>
        <span class="badge bg-primary">{{ lista.length }} elementos</span>
      </div>
      <div class="card-body">
        <!-- Mensaje si está vacía -->
        <div v-if="lista.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No hay elementos que mostrar
        </div>

        <!-- Tabla con los datos -->
        <table v-else class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Campo 1</th>
              <th>Campo 2</th>
              <th>Campo 3</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in lista" :key="item.id || index">
              <td>{{ item.campo1 }}</td>
              <td>{{ item.campo2 }}</td>
              <td>{{ item.campo3 }}</td>
              <td>
                <span class="badge bg-secondary">{{ item.categoria }}</span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="item.activo ? 'bg-success' : 'bg-warning'"
                >
                  {{ item.activo ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm btn-warning me-2"
                  @click="editarObjeto(item)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="eliminarObjeto(item.id || index)"
                  title="Eliminar"
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
import { ref, reactive } from "vue";
import Swal from "sweetalert2";

// Estado del formulario
const objeto = reactive({
  id: null,
  campo1: "",
  campo2: "",
  campo3: "",
  categoria: "",
  activo: true,
});

// Lista de objetos
const lista = ref([]);

// Modo edición
const modoEdicion = ref(false);

// Función para guardar/actualizar objeto
const guardarObjeto = () => {
  if (modoEdicion.value) {
    // ACTUALIZAR objeto existente
    const index = lista.value.findIndex((item) => item.id === objeto.id);
    if (index !== -1) {
      lista.value[index] = { ...objeto };
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Elemento actualizado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  } else {
    // CREAR nuevo objeto
    const nuevoObjeto = {
      ...objeto,
      id: Date.now(), // Generar ID único
    };
    lista.value.push(nuevoObjeto);

    Swal.fire({
      icon: "success",
      title: "Guardado",
      text: "Elemento agregado correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
  }

  limpiarFormulario();
};

// Función para editar objeto
const editarObjeto = (item) => {
  Object.assign(objeto, item);
  modoEdicion.value = true;

  // Scroll al formulario
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Función para eliminar objeto
const eliminarObjeto = (id) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      lista.value = lista.value.filter((item) => item.id !== id);

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Elemento eliminado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
};

// Función para limpiar formulario
const limpiarFormulario = () => {
  objeto.id = null;
  objeto.campo1 = "";
  objeto.campo2 = "";
  objeto.campo3 = "";
  objeto.categoria = "";
  objeto.activo = true;
  modoEdicion.value = false;
};
</script>

<style scoped>
.card-header {
  background-color: #09637e;
  color: white;
}

.form-label {
  font-weight: 600;
  color: #09637e;
}

.btn-primary {
  background-color: #088395;
  border-color: #088395;
}

.btn-primary:hover {
  background-color: #09637e;
  border-color: #09637e;
}

.table {
  margin-bottom: 0;
}
</style>
```

## Variante: Con API (Backend)

```vue
<script setup>
import { ref, reactive, onMounted } from "vue";
import Swal from "sweetalert2";
// Importar funciones de API
import { getItems, createItem, updateItem, deleteItem } from "@/api/items.js";

const objeto = reactive({
  _id: null,
  campo1: "",
  campo2: "",
  categoria: "",
});

const lista = ref([]);
const modoEdicion = ref(false);
const cargando = ref(false);

// Cargar datos al montar componente
onMounted(async () => {
  await cargarLista();
});

// Función para cargar lista desde backend
const cargarLista = async () => {
  try {
    cargando.value = true;
    lista.value = await getItems();
  } catch (error) {
    console.error("Error al cargar lista:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cargar la lista",
    });
  } finally {
    cargando.value = false;
  }
};

// Guardar con API
const guardarObjeto = async () => {
  try {
    if (modoEdicion.value) {
      await updateItem(objeto._id, objeto);
      Swal.fire("Actualizado", "Elemento actualizado correctamente", "success");
    } else {
      await createItem(objeto);
      Swal.fire("Guardado", "Elemento creado correctamente", "success");
    }

    await cargarLista(); // Recargar lista
    limpiarFormulario();
  } catch (error) {
    console.error("Error al guardar:", error);
    Swal.fire("Error", "No se pudo guardar el elemento", "error");
  }
};

// Eliminar con API
const eliminarObjeto = async (id) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await deleteItem(id);
      await cargarLista();
      Swal.fire("Eliminado", "Elemento eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire("Error", "No se pudo eliminar el elemento", "error");
    }
  }
};

// Resto de funciones igual...
</script>
```

## Archivo API ejemplo (api/items.js)

```javascript
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

export const getItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createItem = async (item) => {
  const response = await axios.post(API_URL, item);
  return response.data;
};

export const updateItem = async (id, item) => {
  const response = await axios.put(`${API_URL}/${id}`, item);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
```

## Notas importantes:

1. **Validación**: Agregar validaciones a los campos del formulario
2. **ID único**: Usar `Date.now()` para IDs locales o `_id` desde MongoDB
3. **Reactivity**: Usar `ref()` para arrays y `reactive()` para objetos
4. **Feedback visual**: SweetAlert2 para notificaciones al usuario
5. **Accesibilidad**: Labels asociados a inputs, títulos en botones
6. **Responsive**: Usar clases de Bootstrap para disposición adaptable
7. **Iconos**: Usar Bootstrap Icons para mejorar UX
