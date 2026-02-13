<template>
  <div class="container mt-4">
    <h2>Mi Cesta</h2>

    <div v-if="cesta.items.length == 0" class="alert alert-info">
      La cesta está vacía.
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precios</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cesta.items" key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio }} €</td>
            <td>
              <button
                class="btn btn-se btn-outline-secondary me-1"
                @click="decrementar(item.id)"
              >
                -
              </button>
              {{ item.cantidad }}
              <button
                class="btn btn-sm btn-outline-secondary ms-1"
                @click="incrementar(item.id)"
              >
                +
              </button>
            </td>
            <td>{{ item.precio * item.cantidad }} €</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="removeProducto(item.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <label for="descuento">Introduce tu codigo de descuento</label>
        <input
          type="text"
          id="descuento"
          name="descuento"
          class="form-control w-25 d-inline-block ms-2"
          placeholder="Codigo de descuento"
          v-model="codigoDescuento"
          @input="calcularPrecioFinal"
        />
      </div>

      <div class="mt-3">
        <div class="d-flex justify-content-between">
          <span>Subtotal:</span>
          <span
            ><strong>{{ subtotal.toFixed(2) }}€</strong></span
          >
        </div>
        <div v-if="gastosEnvio > 0" class="d-flex justify-content-between">
          <span v-if="!isAdmin"><i class="me-1"></i>IVA (21%)</span>
          <span v-if="isAdmin"><i class="me-1"></i>IVA (10%)</span>
          <span
            ><strong>{{ gastosEnvio.toFixed(2) }}€</strong></span
          >
        </div>
        <div v-else class="d-flex justify-content-between text-success">
          <span
            ><i class="bi bi-check-circle-fill me-1"></i>Gastos de envío:</span
          >
          <span><strong>¡GRATIS!</strong></span>
        </div>
        <hr />
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Total:</h5>
          <h5 class="mb-0">
            <strong>{{ precioFinal.toFixed(2) }}€</strong>
          </h5>
        </div>
      </div>

      <div class="text-end mt-3">
        <button class="btn btn-success" @click="iniciarPago">
          Iniciar Pago
        </button>
      </div>
      <!-- <div class="text-end mt-3">
        <h4>Total: {{ formatoPrecio (totalPrice) }}</h4>
        <button class="btn btn-success" @click="finalizarPago" :disabled="cartItems.length === 0">
        Finalizar Compra
        </button>
    </div> -->
    </div>
  </div>
</template>

<script setup>
import { useCestaStore } from "@/store/cesta.js";
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";

const cesta = useCestaStore();

const incrementar = (id) => {
  cesta.incrementar(id);
  calcularPrecioFinal();
};

const decrementar = (id) => {
  cesta.decrementar(id);
  calcularPrecioFinal();
};

const removeProducto = (id) => {
  cesta.removeProducto(id);
  calcularPrecioFinal();
};
const codigoDescuento = ref("");
const precioFinal = ref(0);
const subtotal = ref(0);
const gastosEnvio = ref(0);
const isUsuario = ref(sessionStorage.getItem("isUsuario") === "true");
const isAdmin = ref(sessionStorage.getItem("isAdmin") === "true");

const calcularPrecioFinal = () => {
  // Calcular subtotal con descuento si aplica
  if (codigoDescuento.value === "DESCUENTO") {
    subtotal.value = cesta.totalPrecio * 0.9;
  } else {
    subtotal.value = cesta.totalPrecio;
  }

  if (subtotal.value < 50) {
    subtotal.value = subtotal.value * 1.05;
  }

  // Calcular gastos de envío: 1000€ si el subtotal es menor a 30000€
  /*if (subtotal.value < 30000 && subtotal.value > 0) {
    gastosEnvio.value = 1000;
  } else {
    gastosEnvio.value = 0;
  }*/

  if (isAdmin.value) {
    gastosEnvio.value = subtotal.value * 0.1;
  } else {
    gastosEnvio.value = subtotal.value * 0.21;
  }
  // Precio final = subtotal + gastos de envío
  precioFinal.value = subtotal.value + gastosEnvio.value;
};

calcularPrecioFinal();

const mostrarAlerta = (titulo, mensaje, tipo = "info") => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: tipo,
    confirmButtonText: "OK",
  });
};

const mostrarAlertaCesta = (titulo, mensaje, tipo = "info", ruta = "/") => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: tipo,
    confirmButtonText: "Ir a iniciar sesión/Registro",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = ruta;
    }
  });
};

// Iniciar pago con Stripe usando axios
const iniciarPago = async () => {
  if (!isUsuario.value && !isAdmin.value) {
    mostrarAlertaCesta(
      "Error",
      "Debes iniciar sesión para realizar el pago",
      "error",
      "/login",
    );
    return;
  }
  if (!cesta.items.length) {
    mostrarAlerta("Aviso", "La cesta está vacía", "warning");
    return;
  }

  try {
    // IMPORTANTE: Guardar el carrito en localStorage ANTES de hacer cualquier redireccionamiento
    localStorage.setItem("cesta", JSON.stringify(cesta.items));
    // Guardar el código de descuento también
    localStorage.setItem("codigoDescuento", codigoDescuento.value);

    // Crear la sesión de pago en el backend
    calcularPrecioFinal();
    const response = await axios.post(
      "http://localhost:5000/crear-checkout-session",
      {
        items: cesta.items,
        amount: precioFinal.value,
      },
    );

    const session = response.data;

    if (!session.url) {
      console.error("No se recibió URL de Stripe.");
      mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
      return;
    }

    // Redirigir directamente al checkout de Stripe
    window.location.href = session.url;
  } catch (error) {
    console.error("Error en iniciarPago:", error);
    mostrarAlerta("Error", "No se pudo iniciar el pago", "error");
  }
};
</script>
<style scoped></style>
