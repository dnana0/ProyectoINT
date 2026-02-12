import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const solicitudesPath = path.join(__dirname, '../data/solicitudesEmpleo.json');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes.'));
    }
  }
});

// Leer solicitudes
async function leerSolicitudes() {
  try {
    const data = await fs.readFile(solicitudesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Escribir solicitudes
async function escribirSolicitudes(solicitudes) {
  await fs.writeFile(solicitudesPath, JSON.stringify(solicitudes, null, 2), 'utf-8');
}

// GET - Obtener todas las solicitudes
router.get('/', async (req, res) => {
  try {
    const solicitudes = await leerSolicitudes();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// POST - Crear nueva solicitud
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const solicitudes = await leerSolicitudes();
    const nuevaSolicitud = {
      id: Date.now(),
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      provincia: req.body.provincia,
      municipio: req.body.municipio,
      foto: req.file ? `/uploads/${req.file.filename}` : null,
      fecha: new Date().toISOString()
    };
    
    solicitudes.push(nuevaSolicitud);
    await escribirSolicitudes(solicitudes);
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
});

// DELETE - Eliminar solicitud
router.delete('/:id', async (req, res) => {
  try {
    const solicitudes = await leerSolicitudes();
    const id = parseInt(req.params.id);
    const solicitudIndex = solicitudes.findIndex(s => s.id === id);
    
    if (solicitudIndex === -1) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Eliminar foto si existe
    const solicitud = solicitudes[solicitudIndex];
    if (solicitud.foto) {
      const fotoPath = path.join(__dirname, solicitud.foto);
      try {
        await fs.unlink(fotoPath);
      } catch (err) {
        console.log('Error al eliminar foto:', err);
      }
    }

    solicitudes.splice(solicitudIndex, 1);
    await escribirSolicitudes(solicitudes);
    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
});

export default router;
