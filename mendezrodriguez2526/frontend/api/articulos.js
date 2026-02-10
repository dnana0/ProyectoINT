import axios from "axios";

const API_URL = "http://localhost:5000/api/articulos";

// Obtener todos los artículos
export async function getArticulos() {
  const res = await axios.get(API_URL);
  return res.data;
}

// Obtener artículo por ID
export async function getArticuloById(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

// Crear artículo
export async function addArticulo(formData) {
  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// Actualizar artículo
export async function updateArticulo(id, data) {
  // Si es FormData (para actualizar con imagen), usar multipart/form-data
  if (data instanceof FormData) {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  // Si es un objeto JSON (para actualizar sin imagen)
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
}

// Eliminar artículo
export async function deleteArticulo(id) {
  await axios.delete(`${API_URL}/${id}`);
}