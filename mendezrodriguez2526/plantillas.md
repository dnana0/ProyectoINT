# Plantilla: Componente con Formulario y Lista

## 📚 Guía Completa para Crear Componentes CRUD en Vue 3

Esta plantilla proporciona una estructura base completa para crear componentes que permitan:

- ✅ **Crear** nuevos elementos
- ✅ **Leer/Listar** elementos existentes
- ✅ **Actualizar** elementos
- ✅ **Eliminar** elementos

### 🎯 Estructura básica de un componente Vue con formulario que crea objetos y los visualiza

Este patrón es ideal para gestionar entidades como: usuarios, productos, citas, facturas, etc.

```vue
<template>
  <!-- 
    SECCIÓN TEMPLATE: Define la estructura HTML del componente
    - container: Contenedor principal de Bootstrap que centra el contenido
    - mt-4: margin-top de 1.5rem (24px) para separación del borde superior
  -->
  <div class="container mt-4">
    <h2>Gestión de [Nombre Entidad]</h2>

    <!-- 
      FORMULARIO PARA CREAR/EDITAR OBJETOS
      - Este formulario sirve tanto para crear nuevos elementos como para editarlos
      - @submit.prevent: Previene el comportamiento por defecto del formulario (recargar página)
      - Llama a la función guardarObjeto() cuando se envía el formulario
    -->
    <div class="card mb-4">
      <!--
        CARD: Componente de Bootstrap para agrupar contenido relacionado
        - mb-4: margin-bottom de 1.5rem para separación
      -->
      <div class="card-header">
        <!--
          TÍTULO DINÁMICO usando interpolación de Vue {{ }}
          - modoEdicion ? "Editar" : "Nuevo" : Operador ternario
          - Muestra "Editar" si estamos editando, "Nuevo" si estamos creando
        -->
        <h5>{{ modoEdicion ? "Editar" : "Nuevo" }} [Entidad]</h5>
      </div>
      <div class="card-body">
        <!--
          FORMULARIO con prevención del comportamiento por defecto
          - @submit.prevent: Directiva de Vue que previene el reload de la página
          - Equivale a: @submit="$event.preventDefault(); guardarObjeto()"
        -->
        <form @submit.prevent="guardarObjeto">
          <!--
            CAMPOS DEL FORMULARIO
            row mb-3: Fila de Bootstrap con margen inferior
            col-md-6: En pantallas medianas y superiores, ocupa 6 columnas (50% del ancho)
          -->
          <div class="row mb-3">
            <div class="col-md-6">
              <!--
                LABEL: Etiqueta asociada al input mediante el atributo 'for'
                - for="campo1": Se conecta con el id del input
                - Mejora la accesibilidad: al hacer clic en el label, se activa el input
              -->
              <label for="campo1" class="form-label">Campo 1</label>
              <!--
                INPUT con v-model
                - v-model: Directiva de Vue para enlace bidireccional (two-way binding)
                - Conecta el valor del input con la propiedad objeto.campo1
                - Cualquier cambio en el input actualiza la variable y viceversa
                - required: Validación HTML5 nativa, el campo no puede estar vacío
              -->
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

          <!--
            SELECT (Desplegable)
            - v-model enlaza el valor seleccionado con objeto.categoria
            - La primera opción con value="" actúa como placeholder
            - required: El usuario debe seleccionar una opción (no puede dejar el valor vacío)
            
            ALTERNATIVA DINÁMICA: Si las categorías vienen de un array:
            <option v-for="cat in categorias" :key="cat.id" :value="cat.valor">
              {{ cat.nombre }}
            </option>
          -->
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

          <!--
            CHECKBOX
            - v-model con checkbox funciona de forma especial:
              * Si está marcado, objeto.activo = true
              * Si está desmarcado, objeto.activo = false
            - No tiene required porque un checkbox puede estar desmarcado válidamente
            - form-check: Clase de Bootstrap para estilizar checkboxes
          -->
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="activo"
              v-model="objeto.activo"
            />
            <label class="form-check-label" for="activo"> Activo </label>
          </div>

          <!--
            BOTONES DEL FORMULARIO
            - d-flex: Convierte el div en un contenedor flexbox
            - gap-2: Espacio de 0.5rem entre elementos (Bootstrap 5+)
          -->
          <div class="d-flex gap-2">
            <!--
              BOTÓN SUBMIT
              - type="submit": Al hacer clic, activa el evento @submit del form
              - {{ modoEdicion ? ... }}: Texto dinámico según si estamos editando o creando
              - <i class="bi bi-save me-2">: Icono de Bootstrap Icons con margen derecho
            -->
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-save me-2"></i>
              {{ modoEdicion ? "Actualizar" : "Guardar" }}
            </button>
            <!--
              BOTÓN CANCELAR
              - type="button": No activa el submit del formulario
              - @click: Evento de Vue que ejecuta limpiarFormulario() al hacer clic
              - v-if: Renderizado condicional, solo muestra el botón si modoEdicion es true
            -->
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

    <!--
      SECCIÓN DE LISTADO
      Card separado para mostrar todos los elementos en forma de tabla
    -->
    <div class="card">
      <!--
        HEADER CON CONTADOR
        - d-flex: Contenedor flexbox
        - justify-content-between: Separa los elementos a los extremos
        - align-items-center: Centra verticalmente el contenido
      -->
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Listado de [Entidades]</h5>
        <!--
          BADGE con contador dinámico
          - {{ lista.length }}: Muestra el número de elementos en la lista
          - Se actualiza automáticamente cuando se añaden/eliminan elementos
        -->
        <span class="badge bg-primary">{{ lista.length }} elementos</span>
      </div>
      <div class="card-body">
        <!--
          MENSAJE CONDICIONAL SI LA LISTA ESTÁ VACÍA
          - v-if: Directiva de renderizado condicional
          - Solo se renderiza este div si lista.length === 0
          - alert-info: Alerta de Bootstrap con estilo informativo azul
        -->
        <div v-if="lista.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No hay elementos que mostrar
        </div>

        <!--
          TABLA DE DATOS
          - v-else: Se renderiza solo si v-if anterior es false (hay elementos)
          - table-striped: Filas con colores alternados (cebra)
          - table-hover: efecto hover al pasar el ratón sobre las filas
        -->
        <table v-else class="table table-striped table-hover">
          <thead>
            <!--
              ENCABEZADOS DE LA TABLA
              Define las columnas que se mostrarán
            -->
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
            <!--
              v-for: BUCLE DE VUE para renderizar una fila por cada elemento
              - (item, index): item es el elemento actual, index es su posición
              - :key: Atributo especial de Vue para identificar cada elemento únicamente
              - item.id || index: Usa el id del item o el index si no hay id
              - :key es OBLIGATORIO en v-for para optimizar el renderizado
            -->
            <tr v-for="(item, index) in lista" :key="item.id || index">
              <td>{{ item.campo1 }}</td>
              <td>{{ item.campo2 }}</td>
              <td>{{ item.campo3 }}</td>
              <td>
                <span class="badge bg-secondary">{{ item.categoria }}</span>
              </td>
              <!--
                CELDA CON CLASE DINÁMICA
                - :class: Binding dinámico de clases CSS
                - Cambia el color del badge según el estado
                - Verde (bg-success) si está activo, amarillo (bg-warning) si no
              -->
              <td>
                <span
                  class="badge"
                  :class="item.activo ? 'bg-success' : 'bg-warning'"
                >
                  {{ item.activo ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <!--
                CELDA DE ACCIONES
                Botones para editar y eliminar cada elemento
              -->
              <td>
                <!--
                  BOTÓN EDITAR
                  - btn-sm: Botón pequeño de Bootstrap
                  - @click: Al hacer clic, llama a editarObjeto() pasando el item completo
                  - title: Tooltip nativo que aparece al pasar el ratón
                  - me-2: margin-end (derecha) para separación
                -->
                <button
                  class="btn btn-sm btn-warning me-2"
                  @click="editarObjeto(item)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <!--
                  BOTÓN ELIMINAR
                  - @click: Llama a eliminarObjeto() pasando el id del item
                  - btn-danger: Color rojo para indicar acción destructiva
                -->
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

<!--
  SECCIÓN SCRIPT SETUP
  
  <script setup>: Sintaxis moderna de Vue 3 (Composition API)
  - Más conciso que la sintaxis tradicional
  - No necesita retornar variables/funciones, todo es automáticamente expuesto al template
  - Mejor rendimiento en tiempo de compilación
  - Soporte completo para TypeScript
-->
<script setup>
// Importar funciones reactivas de Vue
import { ref, reactive } from "vue";
// Importar biblioteca para alertas/notificaciones elegantes
import Swal from "sweetalert2";

/*
  ESTADO DEL FORMULARIO
  
  reactive(): Crea un objeto reactivo proxy
  - Ideal para objetos con múltiples propiedades
  - Mantiene la reactividad en todas sus propiedades anidadas
  - No necesita .value para acceder/modificar propiedades
  - Uso: objeto.campo1 = "nuevo valor"
  
  ¿Cuándo usar reactive()?
  - Objetos con estructura conocida y múltiples propiedades
  - Formularios con varios campos
  - Configuraciones y opciones
*/
const objeto = reactive({
  id: null, // ID único, null cuando es nuevo
  campo1: "", // Campos del formulario inicializados vacíos
  campo2: "",
  campo3: "",
  categoria: "",
  activo: true, // Boolean con valor por defecto true
});

/*
  LISTA DE OBJETOS
  
  ref(): Crea una referencia reactiva
  - Ideal para valores primitivos y arrays
  - Necesita .value para acceder/modificar en script
  - En el template no necesita .value (Vue lo desempaqueta automáticamente)
  - Uso en script: lista.value.push(...)
  - Uso en template: lista.length
  
  ¿Cuándo usar ref()?
  - Valores primitivos (string, number, boolean)
  - Arrays
  - Referencias a elementos DOM
*/
const lista = ref([]);

/*
  MODO EDICIÓN
  
  ref(false): Variable booleana reactiva
  - false: Estamos creando un nuevo elemento
  - true: Estamos editando un elemento existente
  - Controla el texto de botones y el comportamiento del formulario
*/
const modoEdicion = ref(false);

/*
  FUNCIÓN PARA GUARDAR/ACTUALIZAR OBJETO
  
  Esta función maneja tanto la creación como la actualización:
  1. Si modoEdicion es true -> ACTUALIZAR elemento existente
  2. Si modoEdicion es false -> CREAR nuevo elemento
  
  Flujo de ejecución:
  - Se ejecuta cuando el formulario se envía (submit)
  - Valida que los campos requeridos estén completos
  - Guarda/actualiza el elemento
  - Muestra notificación de éxito
  - Limpia el formulario
*/
const guardarObjeto = () => {
  if (modoEdicion.value) {
    // ==================== MODO ACTUALIZACIÓN ====================
    /*
      findIndex(): Método de array que busca el índice del elemento
      - Retorna el índice del primer elemento que cumple la condición
      - Retorna -1 si no encuentra ningún elemento
      - Comparamos el id del item con el id del objeto que estamos editando
    */
    const index = lista.value.findIndex((item) => item.id === objeto.id);

    if (index !== -1) {
      /*
        SPREAD OPERATOR (...)
        - { ...objeto }: Crea una COPIA del objeto, no una referencia
        - Importante para evitar mutaciones no deseadas
        - Crea un nuevo objeto con todas las propiedades de 'objeto'
      */
      lista.value[index] = { ...objeto };

      // Notificación de éxito con SweetAlert2
      Swal.fire({
        icon: "success", // Icono de check verde
        title: "Actualizado", // Título del modal
        text: "Elemento actualizado correctamente",
        timer: 2000, // Se cierra automáticamente después de 2 segundos
        showConfirmButton: false, // No muestra botón OK
      });
    }
  } else {
    // ==================== MODO CREACIÓN ====================
    /*
      CREAR NUEVO OBJETO
      
      Date.now(): Genera un timestamp (número de milisegundos desde 1970)
      - Es único casi siempre (salvo creaciones en el mismo milisegundo)
      - Simple y efectivo para IDs temporales
      - En producción, el backend generaría el ID real (UUID, MongoDB ObjectId, etc.)
      
      { ...objeto, id: Date.now() }:
      - Copia todas las propiedades de objeto
      - Sobrescribe/añade la propiedad id con el timestamp
    */
    const nuevoObjeto = {
      ...objeto,
      id: Date.now(), // Generar ID único temporal
    };

    // Agregar el nuevo objeto al array reactivo
    lista.value.push(nuevoObjeto);

    Swal.fire({
      icon: "success",
      title: "Guardado",
      text: "Elemento agregado correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
  }

  // Limpiar formulario después de guardar
  limpiarFormulario();
};

/*
  FUNCIÓN PARA EDITAR OBJETO
  
  Propósito:
  - Cargar los datos del elemento seleccionado en el formulario
  - Activar el modo edición
  - Hacer scroll al formulario para que el usuario lo vea
  
  Parámetro:
  - item: El objeto completo que queremos editar
*/
const editarObjeto = (item) => {
  /*
    Object.assign(destino, origen):
    - Copia todas las propiedades de 'item' a 'objeto'
    - Modifica el objeto destino (objeto) directamente
    - Mantiene la reactividad porque objeto es reactive()
    - Más eficiente que: objeto.campo1 = item.campo1, objeto.campo2 = item.campo2...
  */
  Object.assign(objeto, item);

  // Activar modo edición
  modoEdicion.value = true;

  /*
    Scroll suave al inicio de la página
    - Mejora UX: el usuario ve el formulario inmediatamente
    - behavior: "smooth": Animación suave en lugar de salto instantáneo
    - top: 0: Desplazar al principio de la página
  */
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/*
  FUNCIÓN PARA ELIMINAR OBJETO
  
  Propósito:
  - Mostrar confirmación antes de eliminar (prevenir eliminaciones accidentales)
  - Eliminar el elemento de la lista si el usuario confirma
  - Mostrar notificación de éxito
  
  Parámetro:
  - id: El identificador único del elemento a eliminar
*/
const eliminarObjeto = (id) => {
  /*
    SweetAlert2 con confirmación
    - Modal de confirmación para evitar eliminaciones accidentales
    - Buena práctica UX: siempre confirmar acciones destructivas
  */
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning", // Icono de advertencia amarillo
    showCancelButton: true, // Muestra botón de cancelar
    confirmButtonColor: "#d33", // Color rojo para el botón de confirmar
    cancelButtonColor: "#3085d6", // Color azul para el botón de cancelar
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    /*
      .then(): Promesa que se resuelve cuando el usuario hace clic en un botón
      - result.isConfirmed: true si el usuario hizo clic en "Sí, eliminar"
      - result.isDismissed: true si el usuario canceló o cerró el modal
    */
    if (result.isConfirmed) {
      /*
        filter(): Método de array que crea un NUEVO array
        - No modifica el array original
        - Retorna un array con los elementos que cumplen la condición
        - item.id !== id: Mantiene todos los elementos EXCEPTO el que queremos eliminar
        
        Ejemplo:
        lista = [{id:1}, {id:2}, {id:3}]
        eliminarObjeto(2)
        lista = [{id:1}, {id:3}]  // Se elimina el elemento con id:2
      */
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

/*
  FUNCIÓN PARA LIMPIAR FORMULARIO
  
  Propósito:
  - Resetear todos los campos del formulario a sus valores iniciales
  - Desactivar el modo edición
  - Preparar el formulario para crear un nuevo elemento
  
  Se ejecuta:
  - Después de guardar/actualizar un elemento
  - Cuando el usuario hace clic en "Cancelar" durante una edición
  - Cuando se necesita resetear el formulario manualmente
*/
const limpiarFormulario = () => {
  // Resetear todas las propiedades del objeto reactivo a sus valores iniciales
  objeto.id = null;
  objeto.campo1 = "";
  objeto.campo2 = "";
  objeto.campo3 = "";
  objeto.categoria = "";
  objeto.activo = true; // Vuelve al valor por defecto

  // Desactivar modo edición
  modoEdicion.value = false;
};
</script>

<!--
  SECCIÓN DE ESTILOS
  
  <style scoped>: Los estilos solo afectan a este componente
  - scoped: Atributo de Vue que aísla los estilos
  - Vue añade atributos únicos (data-v-xxx) para evitar conflictos
  - Los estilos NO afectan a otros componentes
  - Buena práctica: siempre usar scoped a menos que necesites estilos globales
-->
<style scoped>
/*
  ESTILOS PERSONALIZADOS PARA EL CARD HEADER
  Sobrescribe los estilos por defecto de Bootstrap
*/
.card-header {
  background-color: #09637e; /* Color de fondo azul oscuro */
  color: white; /* Texto blanco para contraste */
}

/*
  ESTILOS PARA LABELS DEL FORMULARIO
  Mejora la legibilidad y apariencia de las etiquetas
*/
.form-label {
  font-weight: 600; /* Semi-negrita (600 en escala 100-900) */
  color: #09637e; /* Color que coincide con el header */
}

/*
  ESTILOS PARA EL BOTÓN PRIMARY
  Personaliza el color del botón principal
*/
.btn-primary {
  background-color: #088395; /* Color base */
  border-color: #088395; /* Mismo color para el borde */
}

/*
  ESTADO HOVER DEL BOTÓN PRIMARY
  Cambia el color cuando el usuario pasa el ratón por encima
*/
.btn-primary:hover {
  background-color: #09637e; /* Un tono más oscuro */
  border-color: #09637e;
}

/*
  ELIMINA EL MARGEN INFERIOR DE LA TABLA
  Evita espacio extra innecesario dentro del card
*/
.table {
  margin-bottom: 0;
}
</style>
```

---

## 🌐 Variante: Con API (Backend)

### Esta versión conecta el componente con un servidor backend (Node.js, Express, MongoDB, etc.)

**Diferencias principales con la versión local:**

- ✅ Los datos se guardan en una base de datos real
- ✅ Los datos persisten aunque se recargue la página
- ✅ Múltiples usuarios pueden acceder a los mismos datos
- ✅ Requiere manejo de estados asíncronos (loading, errores)
- ✅ Necesita funciones API separadas (axios/fetch)

```vue
<script setup>
import { ref, reactive, onMounted } from "vue";
import Swal from "sweetalert2";

/*
  IMPORTAR FUNCIONES DE API
  
  Estas funciones encapsulan las llamadas HTTP al backend:
  - getItems(): GET /api/items - Obtener todos los elementos
  - createItem(): POST /api/items - Crear nuevo elemento
  - updateItem(): PUT /api/items/:id - Actualizar elemento
  - deleteItem(): DELETE /api/items/:id - Eliminar elemento
  
  Ventajas de separar la lógica API:
  - Código más limpio y organizado
  - Reutilización en diferentes componentes
  - Fácil de mantener y testear
  - Cambios en la API solo afectan un archivo
*/
import { getItems, createItem, updateItem, deleteItem } from "@/api/items.js";

// Objeto reactivo para el formulario
const objeto = reactive({
  _id: null, // MongoDB usa _id en lugar de id
  campo1: "",
  campo2: "",
  categoria: "",
});

// Array reactivo para la lista de elementos
const lista = ref([]);

// Variable para controlar si estamos editando
const modoEdicion = ref(false);

/*
  ESTADO DE CARGA
  
  Importante para mejorar la UX:
  - Muestra un loader/spinner mientras se obtienen datos
  - Deshabilita botones durante operaciones asíncronas
  - Evita que el usuario haga múltiples peticiones simultáneas
*/
const cargando = ref(false);

/*
  LIFECYCLE HOOK: onMounted
  
  Se ejecuta automáticamente cuando el componente se monta en el DOM
  
  ¿Cuándo se ejecuta?
  - Después de que el componente se renderiza por primera vez
  - El DOM ya está disponible
  - Perfecto para cargar datos iniciales
  
  async/await:
  - Permite escribir código asíncrono de forma secuencial
  - Más legible que usar .then().catch()
*/
onMounted(async () => {
  await cargarLista();
});

/*
  FUNCIÓN PARA CARGAR LISTA DESDE BACKEND
  
  Realiza una petición HTTP GET al servidor para obtener todos los elementos
  
  Manejo de errores:
  - try: Intenta ejecutar el código
  - catch: Captura cualquier error que ocurra
  - finally: Se ejecuta SIEMPRE, haya error o no (ideal para limpiar estado)
*/
const cargarLista = async () => {
  try {
    // Activar estado de carga
    cargando.value = true;

    /*
      await: Espera a que la promesa se resuelva
      - Pausa la ejecución hasta que getItems() devuelva datos
      - Si hay error, salta al bloque catch
      - Devuelve directamente el resultado (no la promesa)
    */
    lista.value = await getItems();
  } catch (error) {
    // Mostrar error en consola para debugging
    console.error("Error al cargar lista:", error);

    // Notificar al usuario de forma amigable
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cargar la lista",
    });
  } finally {
    /*
      finally: Se ejecuta SIEMPRE
      - Aunque haya error o no
      - Ideal para limpiar estado (loading, spinners, etc.)
      - Garantiza que cargando siempre vuelva a false
    */
    cargando.value = false;
  }
};

/*
  GUARDAR CON API
  
  Diferencias con la versión local:
  - Realiza peticiones HTTP al servidor (POST o PUT)
  - Maneja errores de red/servidor
  - Recarga la lista completa para sincronizar con el backend
  - El backend valida y guarda en base de datos
*/
const guardarObjeto = async () => {
  try {
    if (modoEdicion.value) {
      // ==================== ACTUALIZAR (PUT) ====================
      /*
        updateItem(id, datos):
        - Envía PUT request a /api/items/:id
        - El servidor actualiza el elemento en la base de datos
        - Retorna el elemento actualizado
      */
      await updateItem(objeto._id, objeto);
      Swal.fire("Actualizado", "Elemento actualizado correctamente", "success");
    } else {
      // ==================== CREAR (POST) ====================
      /*
        createItem(datos):
        - Envía POST request a /api/items
        - El servidor crea el elemento en la base de datos
        - El servidor genera el _id automáticamente
        - Retorna el elemento creado con su _id
      */
      await createItem(objeto);
      Swal.fire("Guardado", "Elemento creado correctamente", "success");
    }

    /*
      RECARGAR LISTA
      
      ¿Por qué recargar en lugar de actualizar localmente?
      - Sincroniza con el backend (fuente de verdad)
      - Obtiene datos generados por el servidor (IDs, timestamps, etc.)
      - Evita inconsistencias si otros usuarios modificaron datos
      - Más simple y menos propenso a errores
    */
    await cargarLista();
    limpiarFormulario();
  } catch (error) {
    console.error("Error al guardar:", error);
    Swal.fire("Error", "No se pudo guardar el elemento", "error");
  }
};

/*
  ELIMINAR CON API
  
  Flujo:
  1. Mostrar confirmación al usuario
  2. Si confirma, enviar DELETE request al servidor
  3. El servidor elimina de la base de datos
  4. Recargar lista para sincronizar
  5. Mostrar notificación de éxito/error
*/
const eliminarObjeto = async (id) => {
  // Confirmación con SweetAlert2 (retorna una promesa)
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
      /*
        deleteItem(id):
        - Envía DELETE request a /api/items/:id
        - El servidor elimina el elemento de la base de datos
        - Retorna confirmación de eliminación
      */
      await deleteItem(id);

      // Recargar para sincronizar con el backend
      await cargarLista();

      Swal.fire("Eliminado", "Elemento eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire("Error", "No se pudo eliminar el elemento", "error");
    }
  }
};

// Resto de funciones igual que en la versión local...
// (editarObjeto, limpiarFormulario)
</script>
```

## 📡 Archivo API ejemplo (api/items.js)

### Este archivo centraliza todas las peticiones HTTP al backend

**Ventajas de este patrón:**

- 📦 **Reutilización**: Mismo código en múltiples componentes
- 🔧 **Mantenimiento**: Cambios en la API solo requieren modificar este archivo
- 📚 **Organización**: Separa lógica de negocio de lógica de presentación
- ✅ **Testing**: Fácil de testear de forma aislada

```javascript
/*
  CONFIGURACIÓN DE AXIOS
  
  Axios: Biblioteca HTTP basada en promesas
  - Más fácil de usar que fetch nativo
  - Transforma automáticamente JSON
  - Mejor manejo de errores
  - Interceptores para requests/responses
  - Compatible con navegadores antiguos
  
  Instalación: npm install axios
*/
import axios from "axios";

/*
  URL BASE DEL API
  
  - En desarrollo: Puerto local (5000, 3000, etc.)
  - En producción: URL del servidor real
  
  Buena práctica:
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/items";
  
  Esto permite usar variables de entorno (.env):
  - .env.development: VITE_API_URL=http://localhost:5000/api/items
  - .env.production: VITE_API_URL=https://miapi.com/api/items
*/
const API_URL = "http://localhost:5000/api/items";

/*
  GET: OBTENER TODOS LOS ELEMENTOS
  
  Petición HTTP:
  GET /api/items
  
  Respuesta esperada del servidor:
  [
    { _id: "123", campo1: "valor1", campo2: "valor2" },
    { _id: "456", campo1: "valor3", campo2: "valor4" }
  ]
*/
export const getItems = async () => {
  /*
    axios.get(url):
    - Envía petición GET a la URL especificada
    - Retorna una promesa que resuelve con un objeto response
    - response.data: Contiene los datos del cuerpo de la respuesta
    - await: Espera a que la promesa se resuelva
  */
  const response = await axios.get(API_URL);
  return response.data; // Array de items
};

/*
  POST: CREAR NUEVO ELEMENTO
  
  Petición HTTP:
  POST /api/items
  Body: { campo1: "...", campo2: "...", categoria: "..." }
  
  El servidor:
  - Valida los datos
  - Genera un _id único
  - Guarda en base de datos
  - Retorna el elemento creado con su _id
*/
export const createItem = async (item) => {
  /*
    axios.post(url, data):
    - Envía petición POST con los datos en el cuerpo
    - Axios serializa automáticamente el objeto a JSON
    - Añade header: Content-Type: application/json
  */
  const response = await axios.post(API_URL, item);
  return response.data; // Elemento creado con _id
};

/*
  PUT: ACTUALIZAR ELEMENTO EXISTENTE
  
  Petición HTTP:
  PUT /api/items/:id
  Body: { campo1: "nuevo valor", campo2: "...", categoria: "..." }
  
  El servidor:
  - Busca el elemento por ID
  - Actualiza los campos
  - Retorna el elemento actualizado
*/
export const updateItem = async (id, item) => {
  /*
    Template literal: `${API_URL}/${id}`
    - Construye la URL dinámicamente
    - Ejemplo: http://localhost:5000/api/items/123
    - PUT reemplaza completamente el recurso
    - Alternativa: PATCH (actualización parcial)
  */
  const response = await axios.put(`${API_URL}/${id}`, item);
  return response.data; // Elemento actualizado
};

/*
  DELETE: ELIMINAR ELEMENTO
  
  Petición HTTP:
  DELETE /api/items/:id
  
  El servidor:
  - Busca el elemento por ID
  - Lo elimina de la base de datos
  - Retorna confirmación de eliminación
*/
export const deleteItem = async (id) => {
  /*
    axios.delete(url):
    - Envía petición DELETE
    - No necesita body (el ID está en la URL)
    - Retorna confirmación o el elemento eliminado
  */
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data; // Confirmación o elemento eliminado
};
```

---

## 📝 Notas importantes y Buenas Prácticas

### 1. ✅ **Validación de Formularios**

**Validación HTML5 nativa:**

```html
<!-- Validaciones básicas con atributos HTML5 -->
<input type="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
<input type="tel" pattern="[0-9]{9}" title="9 dígitos" />
<input type="number" min="0" max="100" step="1" />
```

**Validación personalizada en Vue:**

```javascript
const validarFormulario = () => {
  if (objeto.campo1.length < 3) {
    Swal.fire("Error", "El campo 1 debe tener al menos 3 caracteres", "error");
    return false;
  }
  return true;
};
```

### 2. 🆔 **Generación de IDs Únicos**

**Para datos locales (sin backend):**

```javascript
id: Date.now(); // Timestamp simple
id: crypto.randomUUID(); // UUID v4 (más robusto)
id: `${Date.now()}-${Math.random()}`; // Timestamp + aleatorio
```

**Para backend:**

- MongoDB: `_id` automático (ObjectId)
- PostgreSQL: Autoincrement o UUID
- El servidor SIEMPRE genera el ID

### 3. 🔄 **Reactividad en Vue 3**

**ref() vs reactive():**

```javascript
// ✅ USO CORRECTO DE ref()
const contador = ref(0);
contador.value++; // En script: Necesita .value
{
  {
    contador;
  }
} // En template: NO necesita .value

// ✅ USO CORRECTO DE reactive()
const usuario = reactive({ nombre: "", edad: 0 });
usuario.nombre = "Juan"; // En script: Acceso directo
{
  {
    usuario.nombre;
  }
} // En template: Acceso directo

// ❌ ERRORES COMUNES
const lista = reactive([]); // ❌ No usar reactive con arrays
lista = []; // ❌ Pierde reactividad

const lista = ref([]); // ✅ Correcto
lista.value = []; // ✅ Mantiene reactividad
lista.value.push(item); // ✅ Mantiene reactividad
```

### 4. 🎨 **Feedback Visual (UX)**

**SweetAlert2 - Diferentes tipos de alertas:**

```javascript
// Éxito
Swal.fire({
  icon: "success",
  title: "Guardado",
  timer: 2000,
  showConfirmButton: false,
});

// Error
Swal.fire({
  icon: "error",
  title: "Error",
  text: "Algo salió mal",
  confirmButtonText: "Entendido",
});

// Confirmación
const result = await Swal.fire({
  title: "¿Estás seguro?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Sí",
  cancelButtonText: "No",
});

if (result.isConfirmed) {
  // Usuario confirmó
}

// Toast (notificación pequeña)
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
});

Toast.fire({
  icon: "success",
  title: "Guardado correctamente",
});
```

### 5. ♿ **Accesibilidad (A11y)**

```html
<!-- ✅ Labels asociados con inputs -->
<label for="nombre">Nombre</label>
<input id="nombre" type="text" v-model="nombre" />

<!-- ✅ Títulos en botones de iconos -->
<button title="Editar elemento">
  <i class="bi bi-pencil"></i>
</button>

<!-- ✅ Atributos ARIA cuando sea necesario -->
<div role="status" aria-live="polite">{{ mensajeEstado }}</div>

<!-- ✅ Contraste de colores adecuado -->
<!-- ✅ Navegación por teclado (tabindex) -->
```

### 6. 📱 **Diseño Responsive con Bootstrap**

```html
<!-- Sistema de Grid (12 columnas) -->
<div class="row">
  <!-- En móviles 100%, en tablets 50%, en desktop 33.33% -->
  <div class="col-12 col-md-6 col-lg-4">...</div>
</div>

<!-- Display utilities responsive -->
<div class="d-none d-md-block">
  <!-- Oculto en móvil, visible en tablet+ -->
</div>

<!-- Clases responsive para espaciado -->
<div class="mb-2 mb-md-4 mb-lg-5">
  <!-- Margen crece con el tamaño de pantalla -->
</div>
```

### 7. 🎯 **Iconos con Bootstrap Icons**

```html
<!-- Instalación -->
<!-- npm install bootstrap-icons -->
<!-- En main.js: import 'bootstrap-icons/font/bootstrap-icons.css' -->

<!-- Uso básico -->
<i class="bi bi-save"></i>
<!-- Guardar -->
<i class="bi bi-pencil"></i>
<!-- Editar -->
<i class="bi bi-trash"></i>
<!-- Eliminar -->
<i class="bi bi-plus-circle"></i>
<!-- Añadir -->
<i class="bi bi-x-circle"></i>
<!-- Cancelar -->
<i class="bi bi-check-circle"></i>
<!-- Éxito -->

<!-- Con espaciado -->
<button><i class="bi bi-save me-2"></i>Guardar</button>
```

### 8. 🔍 **Debugging y Desarrollo**

```javascript
// Vue DevTools (extensión navegador)
// Permite inspeccionar componentes, estado, props, eventos

// Console útil
console.log("Lista:", lista.value);
console.table(lista.value); // Tabla visual en consola

// Watchers para debugging
import { watch } from "vue";
watch(lista, (newVal, oldVal) => {
  console.log("Lista cambió:", newVal);
});
```

### 9. 🚀 **Optimizaciones de Rendimiento**

```javascript
// Computed properties para cálculos derivados
const totalElementos = computed(() => lista.value.length)
const elementosActivos = computed(() =>
  lista.value.filter(item => item.activo)
)

// v-show vs v-if
// v-if: Renderizado condicional (añade/elimina del DOM)
// v-show: display: none (siempre en el DOM)
<div v-if="mostrar">Renderizado condicional</div>
<div v-show="mostrar">Toggle visibilidad</div>

// :key en v-for es OBLIGATORIO
<div v-for="item in lista" :key="item.id">
  <!-- Vue optimiza el renderizado con keys únicas -->
</div>
```

### 10. 🛡️ **Manejo de Errores**

```javascript
// Siempre usar try-catch con operaciones async
try {
  const resultado = await algunaOperacion()
} catch (error) {
  // Log para desarrolladores
  console.error('Error detallado:', error)

  // Mensaje amigable para usuarios
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'No se pudo completar la operación. Inténtalo más tarde.'
  })
}

// Manejo de errores HTTP específicos
catch (error) {
  if (error.response) {
    // El servidor respondió con código de error
    switch(error.response.status) {
      case 404:
        Swal.fire('Error', 'Elemento no encontrado', 'error')
        break
      case 401:
        Swal.fire('Error', 'No autorizado', 'error')
        break
      case 500:
        Swal.fire('Error', 'Error del servidor', 'error')
        break
    }
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    Swal.fire('Error', 'No hay conexión con el servidor', 'error')
  }
}
```

---

## 🎓 Conceptos Clave para Entender

### 📌 **Two-Way Binding (v-model)**

Sincronización bidireccional entre el input y la variable:

- Usuario escribe → Variable se actualiza
- Variable cambia → Input se actualiza

### 📌 **Renderizado Condicional**

- `v-if`: Añade/elimina del DOM (mejor para condiciones que cambian poco)
- `v-show`: Toggle CSS display (mejor para condiciones que cambian mucho)
- `v-else`: Alternativa cuando v-if es false

### 📌 **List Rendering (v-for)**

Repetir elementos basándose en un array:

- Siempre usar `:key` única
- Mejor rendimiento y menos bugs

### 📌 **Event Handling (@/v-on)**

Responder a eventos del usuario:

```html
@click="miFuncion"
<!-- Click -->
@submit.prevent="enviar"
<!-- Submit con preventDefault -->
@input="onChange"
<!-- Cada cambio en input -->
@keyup.enter="buscar"
<!-- Enter presionado -->
```

### 📌 **Lifecycle Hooks**

```javascript
import { onMounted, onUpdated, onUnmounted } from "vue";

onMounted(() => {
  // Ejecuta cuando el componente se monta
  // Ideal para: cargar datos iniciales, inicializar librerías
});

onUpdated(() => {
  // Ejecuta cuando el componente se actualiza
  // Ten cuidado: puede ejecutarse muchas veces
});

onUnmounted(() => {
  // Ejecuta antes de que el componente se destruya
  // Ideal para: limpiar timers, event listeners, etc.
});
```

---

## 🎯 Checklist para un Componente CRUD Completo

- [ ] Formulario con todos los campos necesarios
- [ ] Validación de campos (HTML5 + custom)
- [ ] Botones de guardar/actualizar con feedback visual
- [ ] Tabla responsive para mostrar datos
- [ ] Botones de editar/eliminar en cada fila
- [ ] Confirmación antes de eliminar
- [ ] Mensajes de éxito/error con SweetAlert2
- [ ] Loading state durante operaciones async
- [ ] Manejo de errores con try-catch
- [ ] Labels asociados a inputs (accesibilidad)
- [ ] Iconos descriptivos en botones
- [ ] Responsive en todos los tamaños de pantalla
- [ ] Comentarios en el código
- [ ] Console.log eliminados en producción

---

**📚 Recursos Adicionales:**

- [Vue 3 Documentation](https://vuejs.org/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/)
- [SweetAlert2 Documentation](https://sweetalert2.github.io/)
- [Axios Documentation](https://axios-http.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

---

_Plantilla actualizada - Febrero 2026_
