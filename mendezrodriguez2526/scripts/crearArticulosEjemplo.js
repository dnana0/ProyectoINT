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

    // Artículos de ejemplo - Orden según bbdd.articulos.json
    const articulos = [
      {
        tipo: "coche",
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2022,
        kilometros: 15000,
        precio: 18500,
        combustible: "Gasolina",
        transmision: "manual",
        potencia_cv: 130,
        descripcion: "Vehículo en excelente estado, mantenimiento al día",
        ubicacion: {
          ciudad: "Madrid",
          provincia: "Madrid",
        },
        contacto: {
          nombre: "Juan García",
          telefono: "612345678",
          email: "juan@example.com",
        },
        fecha_publicacion: new Date(),
        estado: "disponible",
        matricula: "ABC1234",
        imagen: "/uploads/default.jpg",
      },
      {
        tipo: "coche",
        marca: "BMW",
        modelo: "X3",
        anio: 2021,
        kilometros: 32000,
        precio: 35900,
        combustible: "Diésel",
        transmision: "automatica",
        potencia_cv: 190,
        descripcion: "SUV deportivo, equipado con todas las tecnologías",
        ubicacion: {
          ciudad: "Barcelona",
          provincia: "Barcelona",
        },
        contacto: {
          nombre: "María López",
          telefono: "623456789",
          email: "maria@example.com",
        },
        fecha_publicacion: new Date(),
        estado: "disponible",
        matricula: "DEF5678",
        imagen: "/uploads/default.jpg",
      },
      {
        tipo: "coche",
        marca: "Volkswagen",
        modelo: "Passat",
        anio: 2020,
        kilometros: 48000,
        precio: 22500,
        combustible: "Gasolina",
        transmision: "automatica",
        potencia_cv: 150,
        descripcion: "Cómodo familiar con maletero amplio",
        ubicacion: {
          ciudad: "Valencia",
          provincia: "Valencia",
        },
        contacto: {
          nombre: "Pedro Martín",
          telefono: "634567890",
          email: "pedro@example.com",
        },
        fecha_publicacion: new Date(),
        estado: "disponible",
        matricula: "GHI9012",
        imagen: "/uploads/default.jpg",
      },
      {
        tipo: "coche",
        marca: "Audi",
        modelo: "A4",
        anio: 2023,
        kilometros: 5000,
        precio: 42000,
        combustible: "Gasolina",
        transmision: "automatica",
        potencia_cv: 200,
        descripcion: "Deportivo moderno, última tecnología",
        ubicacion: {
          ciudad: "Sevilla",
          provincia: "Sevilla",
        },
        contacto: {
          nombre: "Ana Rodríguez",
          telefono: "645678901",
          email: "ana@example.com",
        },
        fecha_publicacion: new Date(),
        estado: "disponible",
        matricula: "JKL3456",
        imagen: "/uploads/default.jpg",
      },
      {
        tipo: "coche",
        marca: "Seat",
        modelo: "Ibiza",
        anio: 2022,
        kilometros: 22000,
        precio: 15900,
        combustible: "Gasolina",
        transmision: "manual",
        potencia_cv: 110,
        color: "rojo",
        puertas: 5,
        descripcion: "Vehículo ideal para ciudad, económico y ágil",
        ubicacion: {
          ciudad: "Zaragoza",
          provincia: "Zaragoza",
        },
        contacto: {
          nombre: "Carlos Sánchez",
          telefono: "656789012",
          email: "carlos@example.com",
        },
        fecha_publicacion: new Date(),
        estado: "disponible",
        matricula: "MNO7890",
        imagen: "/uploads/default.jpg",
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
