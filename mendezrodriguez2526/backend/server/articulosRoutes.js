// server/articulosRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Articulo from  "../modelos/Articulo.js";
import { fileURLToPath } from "url";
import fs from 'fs';

// inicializar configuración de multer para manejo de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que la carpeta uploads exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Carpeta uploads creada automáticamente');
}

// Crear el router
const router = express.Router();
console.log("Router articulos cargado"); // para depurar



// Configuración de almacenamiento de multer en la carpeta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // ruta absoluta a server/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Inicializar multer
const upload = multer({ storage: storage });

// AHORA VIENEN LAS RUTAS USANDO EL router DE EXPRESS
// Obtener todos los artículo
router.get("/", async (req, res) => {
  const articulos = await Articulo.find();
  res.json(articulos);
});

// Guardar artículo con imagen
router.post("/", upload.single('imagen'), async (req, res) => {
  try {
    if (!req.body.vehiculo) {
      console.error("No se recibió el campo 'vehiculo'");
      return res.status(400).json({ error: "Campo 'vehiculo' vacío" });
    }

    let datos;
    try {
      datos = JSON.parse(req.body.vehiculo);
    } catch (e) {
      console.error("Error parseando JSON:", e.message);
      return res.status(400).json({ error: "JSON inválido en 'vehiculo'", detalle: e.message });
    }

    // Remover _id para crear un nuevo documento (evita E11000 duplicate key error)
    delete datos._id;
    delete datos.__v;

    // Convertir campos numéricos a números
    if (datos.anio) datos.anio = Number(datos.anio);
    if (datos.kilometros) datos.kilometros = Number(datos.kilometros);
    if (datos.precio) datos.precio = Number(datos.precio);
    if (datos.potencia_cv) datos.potencia_cv = Number(datos.potencia_cv);

    // Validar que los campos numéricos requeridos sean válidos
    if (!datos.anio || isNaN(datos.anio)) {
      return res.status(400).json({ error: "Año debe ser un número válido" });
    }
    if (!datos.precio || isNaN(datos.precio)) {
      return res.status(400).json({ error: "Precio debe ser un número válido" });
    }

    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const articulo = new Articulo(datos);
    const guardado = await articulo.save();
    res.json(guardado);

  } catch (err) {
    console.error("Error guardando artículo:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Obtener artículo por ID
router.get("/:id", async (req, res) => {
  try {
    const articulo = await Articulo.findById(req.params.id);
    if (!articulo) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }
    res.json(articulo);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el artículo" });
  }
});

// Actualizar artículo
router.put("/:id", upload.single('imagen'), async (req, res) => {
  try {
    let datos = req.body.vehiculo ? JSON.parse(req.body.vehiculo) : req.body;

    // Convertir campos numéricos a números
    if (datos.anio) datos.anio = Number(datos.anio);
    if (datos.kilometros) datos.kilometros = Number(datos.kilometros);
    if (datos.precio) datos.precio = Number(datos.precio);
    if (datos.potencia_cv) datos.potencia_cv = Number(datos.potencia_cv);

    // Validar que los campos numéricos requeridos sean válidos
    if (!datos.anio || isNaN(datos.anio)) {
      return res.status(400).json({ error: "Año debe ser un número válido" });
    }
    if (!datos.precio || isNaN(datos.precio)) {
      return res.status(400).json({ error: "Precio debe ser un número válido" });
    }

    // No permitir cambiar _id
    delete datos._id;

    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const actualizado = await Articulo.findByIdAndUpdate(req.params.id, datos, { new: true });
    if (!actualizado) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }
    res.json(actualizado);
  } catch (err) {
    console.error("Error actualizando artículo:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar artículo
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Articulo.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }
    res.json({ mensaje: "Artículo eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el artículo" });
  }
});

router.get("/buscar", async (req, res) => {
  const {q} = req.query;

  if (!q) return res.json([]);

  const regex = new RegExp(q, "i");
// supongamos solo la marca modelo y descripción
  try {
    const articulos = await Articulo.find({
      $or: [
      { marca: regex },
      { modelo: regex },
      { descripcion: regex }
      ]
      });

    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

// otras rutas PUT, DELETE, GET /:id igual

export default router;