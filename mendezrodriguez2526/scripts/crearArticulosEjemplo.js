import mongoose from "mongoose";
import dotenv from "dotenv";
import Articulo from "../backend/modelos/Articulo.js";

dotenv.config();

async function crearArticulos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");

    // Limpiar colección anterior (opcional)
    await Articulo.deleteMany({});
    console.log("Colección limpiada");

    // Artículos de ejemplo
    const articulos = [
      {
        tipo: "Turismo",
        matricula: "ABC-1234",
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2022,
        estado: "disponible",
        kilometros: 15000,
        precio: 18500,
        combustible: "Gasolina",
        transmision: "Manual",
        potencia_cv: 130,
        descripcion: "Vehículo en excelente estado, mantenimiento al día",
        ubicacion: {
          provincia: "Madrid",
          ciudad: "Madrid",
        },
        contacto: {
          nombre: "Juan García",
          telefono: "612345678",
          email: "juan@example.com",
        },
      },
      {
        tipo: "SUV",
        matricula: "DEF-5678",
        marca: "BMW",
        modelo: "X3",
        anio: 2021,
        estado: "disponible",
        kilometros: 32000,
        precio: 35900,
        combustible: "Diésel",
        transmision: "Automática",
        potencia_cv: 190,
        descripcion: "SUV deportivo, equipado con todas las tecnologías",
        ubicacion: {
          provincia: "Barcelona",
          ciudad: "Barcelona",
        },
        contacto: {
          nombre: "María López",
          telefono: "623456789",
          email: "maria@example.com",
        },
      },
      {
        tipo: "Familiar",
        matricula: "GHI-9012",
        marca: "Volkswagen",
        modelo: "Passat",
        anio: 2020,
        estado: "disponible",
        kilometros: 48000,
        precio: 22500,
        combustible: "Gasolina",
        transmision: "Automática",
        potencia_cv: 150,
        descripcion: "Cómodo familiar con maletero amplio",
        ubicacion: {
          provincia: "Valencia",
          ciudad: "Valencia",
        },
        contacto: {
          nombre: "Pedro Martín",
          telefono: "634567890",
          email: "pedro@example.com",
        },
      },
      {
        tipo: "Deportivo",
        matricula: "JKL-3456",
        marca: "Audi",
        modelo: "A4",
        anio: 2023,
        estado: "disponible",
        kilometros: 5000,
        precio: 42000,
        combustible: "Gasolina",
        transmision: "Automática",
        potencia_cv: 200,
        descripcion: "Deportivo moderno, última tecnología",
        ubicacion: {
          provincia: "Sevilla",
          ciudad: "Sevilla",
        },
        contacto: {
          nombre: "Ana Rodríguez",
          telefono: "645678901",
          email: "ana@example.com",
        },
      },
      {
        tipo: "Compacto",
        matricula: "MNO-7890",
        marca: "Seat",
        modelo: "Ibiza",
        anio: 2022,
        estado: "disponible",
        kilometros: 22000,
        precio: 15900,
        combustible: "Gasolina",
        transmision: "Manual",
        potencia_cv: 110,
        descripcion: "Vehículo ideal para ciudad, económico y ágil",
        ubicacion: {
          provincia: "Zaragoza",
          ciudad: "Zaragoza",
        },
        contacto: {
          nombre: "Carlos Sánchez",
          telefono: "656789012",
          email: "carlos@example.com",
        },
      },
    ];

    const insertados = await Articulo.insertMany(articulos);
    console.log(`✅ ${insertados.length} artículos creados correctamente`);
    
    // Mostrar los IDs generados
    insertados.forEach((art, i) => {
      console.log(`${i + 1}. ${art.marca} ${art.modelo} - ID: ${art._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

crearArticulos();
