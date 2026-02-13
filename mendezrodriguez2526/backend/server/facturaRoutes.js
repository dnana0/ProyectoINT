import express from "express";
import Factura from "../modelos/Factura.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// inicializar configuración de multer para manejo de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear el router
const router = express.Router();
console.log("Router articulos cargado"); // para depurar

router.get("/", async (req, res) => {
  const facturas = await Factura.find();
  res.json(facturas);
});

// CREAR FACTURA
router.post("/", async (req, res) => {
  try {
    console.log("📥 Factura recibida:", req.body);

    const factura = new Factura(req.body);
    await factura.save();

    res.status(201).json(factura);
  } catch (error) {
    console.error("❌ Error al guardar factura:", error);
    res.status(500).json({ error: "Error al guardar factura" });
  }
});

export default router;
