import axios from 'axios';

const API_URL = 'http://localhost:5000/api/solicitudes-empleo';

// Obtener todas las solicitudes
export const getSolicitudesEmpleo = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }
};

// Crear nueva solicitud
export const crearSolicitudEmpleo = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    throw error;
  }
};

// Eliminar solicitud
export const eliminarSolicitudEmpleo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    throw error;
  }
};
