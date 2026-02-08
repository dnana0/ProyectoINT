# 📋 Resumen del Proyecto: Sistema de Gestión Automotriz

## 🎯 Descripción General

Este es un **proyecto full-stack** que implementa un sistema de gestión automotriz con arquitectura **Frontend-Backend-Base de Datos**. Permite la compra de vehículos, gestión de clientes, ventas, facturas, citas en taller y contacto.

**Stack Tecnológico:**
- **Frontend:** Vue 3 + Vite + Pinia + Vue Router
- **Backend:** Express + Node.js + Mongoose (MongoDB)
- **Autenticación:** JWT + bcryptjs
- **Pagos:** Stripe API
- **Datos:** JSON Server + MongoDB + Multer para subida de imágenes
- **Diseño:** Bootstrap 5 + Font Awesome + Bootstrap Icons

---

## 🏗️ Arquitectura del Proyecto

```
ProyectoINT/
├── Frontend (Vite + Vue 3)
│   ├── main.js → Punto de entrada
│   ├── App.vue → Componente raíz
│   ├── components/ → Componentes Vue
│   ├── store/ → Pinia (gestión de estado)
│   ├── api/ → Servicios HTTP
│   └── assets/ → Recursos estáticos
│
├── Backend (Express + Node.js)
│   ├── server/
│   │   ├── server.js → Servidor Express
│   │   ├── authController.js → Lógica autenticación
│   │   ├── authRouter.js → Rutas autenticación
│   │   ├── articulosRoutes.js → Rutas vehículos
│   │   ├── facturaRoutes.js → Rutas facturas
│   │   ├── contactoRoutes.js → Rutas contacto
│   │   └── uploads/ → Imágenes subidas
│   ├── modelos/
│   │   ├── Articulo.js → Schema vehículos
│   │   └── Factura.js → Schema facturas
│   ├── router/
│   │   └── index.js → Rutas Vue Router
│   └── data/
│       └── db.json → Base de datos JSON
│
├── vite.config.js → Configuración Vite
└── package.json → Dependencias
```

---

## 🔄 Flujo de Funcionamiento

### 1️⃣ Inicialización de la Aplicación

#### **Frontend (main.js)**
```javascript
const app = createApp(App)
const pinia = createPinia()

app.use(router)      // Vue Router para navegación
app.use(pinia)       // Pinia para gestión de estado
app.mount('#app')    // Monta en #app del HTML
```

- **Carga de estilos:** Bootstrap, FontAwesome, SweetAlert2
- **Router:** Sistema de rutas SPA (Single Page Application)
- **Almacenamientos UI:** NavBar + RouterView + Footer

#### **Backend (server.js)**
```javascript
const app = express()
const PORT = 5000

// CORS: Permite conexiones desde Frontend (localhost:5173)
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

// Rutas disponibles:
// /api/auth → Autenticación (Login)
// /api/articulos → Gestión de vehículos (CRUD)
// /api/facturas → Gestión de facturas
// /api/contacto → Formulario de contacto
```

---

## 🔐 Sistema de Autenticación

### **Backend - Proceso de Login**

1. **Request POST `/api/auth/login`**
   ```javascript
   {
     dni: "12345678A",
     password: "password123"
   }
   ```

2. **Controlador `authController.js`:**
   - Busca el usuario por DNI en la BD (JSON Server en puerto 3000)
   - Valida la contraseña con bcrypt
   - Si es válido, crea un JWT token con:
     - `dni` del usuario
     - `tipo` de usuario (admin/user)
     - Expira en 2 horas

3. **Respuesta:**
   ```javascript
   {
     token: "eyJhbGciOiJIUzI1NiIs...",
     nombre: "Juan Pérez",
     tipo: "admin"
   }
   ```

### **Middleware de Protección**

- **`verificarToken`:** Valida que el token enviado en header `Authorization: Bearer <token>` sea válido
- **`soloAdmin`:** Verifica que el usuario sea admin antes de acceder
- Se aplica en rutas sensibles:
  - `/api/auth/noticias` (solo admin)
  - `/api/auth/citas-taller` (solo admin)
  - `/api/auth/modelos` (solo admin)
  - `/api/auth/ventas` (usuarios autenticados)

---

## 🚗 Gestión de Artículos (Vehículos)

### **Modelo (Mongoose)**
```javascript
{
  tipo, matricula, marca, modelo, año,
  precio, estado,
  kilometros, combustible, transmisión,
  potencia_cv, descripción,
  ubicación: { provincia, ciudad },
  contacto: { nombre, teléfono, email },
  imagen, fecha_publicación
}
```

### **Rutas API**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/articulos` | Obtiene todos los vehículos |
| GET | `/api/articulos/:id` | Obtiene un vehículo específico |
| POST | `/api/articulos` | Crea nuevo vehículo (con imagen) |
| PUT | `/api/articulos/:id` | Actualiza un vehículo |
| DELETE | `/api/articulos/:id` | Elimina un vehículo |

### **Upload de Imágenes (Multer)**
- Los vehículos pueden tener imágenes
- Se guardan en `/backend/server/uploads/`
- Nombres: `timestamp + extensión original`
- Se acceden vía `/uploads/nombre.jpg`

### **Frontend - API Client (`articulos.js`)**
```javascript
// Obtener vehículos
getArticulos() // GET http://localhost:5000/api/articulos

// Crear vehículo
addArticulo(formData) // POST con multipart/form-data
```

---

## 🛒 Sistema de Carrito (Cesta)

### **Pinia Store (`cesta.js`)**
- **Estado:** Array de items en el carrito
- **Persistencia:** LocalStorage del navegador
- **Getters:**
  - `totalItems`: Suma de cantidades
  - `totalPrecio`: Suma de precios × cantidades

### **Acciones:**
```javascript
cargarCesta()      // Carga del localStorage al iniciar
guardarCesta()     // Guarda en localStorage cuando hay cambios
addProducto()      // Añade un producto (o incrementa cantidad)
removeProducto()   // Elimina un producto
limpiar()          // Vacía el carrito
```

### **Flujo de Compra:**
1. Usuario selecciona vehículo en "Búscar" o "Modelos"
2. Se añade a la cesta (Pinia Store)
3. Va a `/cesta` para revisar
4. Hace clic en "Pagar con Stripe"
5. Se env́ía a `/crear-checkout-session`
6. Redirige a formulario de Stripe
7. Tras pagar: `/PaymentSuccess` o `/PaymentCancel`

---

## 💳 Integración Stripe (Pagos)

### **Backend - Crear Sesión de Checkout**
```javascript
POST /crear-checkout-session
{
  items: [
    {
      nombre: "Audi A4",
      precio: 25000,
      cantidad: 1
    }
  ]
}

// Stripe crea una sesión y devuelve URL de checkout
Response: { url: "https://checkout.stripe.com/..." }
```

### **Frontend - Flujo de Pago:**
1. Usuario hace clic en "Pagar"
2. Se envían items del carrito al backend
3. Se abre enlace de Stripe en nueva pestaña
4. Usuario completa el pago
5. Redirige a componente de éxito o cancelación

---

## 📄 Gestión de Facturas

### **Modelo (Mongoose)**
```javascript
{
  fecha: Date,
  productos: [
    {
      productoId, nombre, cantidad, precio_unitario
    }
  ],
  total: Number
}
```

### **Rutas API:**
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/facturas` | Obtiene todas las facturas |
| POST | `/api/facturas` | Crea una nueva factura |
| GET | `/api/facturas/:id` | Obtiene factura específica |

### **Generación de PDFs (jspdf)**
- Se usa `jspdf` + `jspdf-autotable` para generar facturas en PDF
- Los usuarios pueden descargar facturas de sus compras

---

## 👥 Gestión de Clientes

### **Fuentes de Datos:**
1. **JSON Server** (puerto 3000): 
   - Almacena clientes con DNI, nombre, contraseña (hasheada)
   - Los datos se cargan desde `/backend/data/db.json`

2. **Componente Frontend (`GestionClientes.vue`):**
   - CRUD completo de clientes
   - Validaciones de formulario
   - Requiere autenticación

### **Rutas de Acceso:**
- `/clientes` → Gestión de clientes (requiere login)

---

## 📧 Sistema de Contacto

### **Backend - Contacto Routes**
```javascript
POST /api/contacto
{
  nombre, email, teléfono, asunto, mensaje
}
```

Utiliza la librería `resend` para enviar emails

### **Frontend - Componente `ConTacto.vue`**
- Formulario para enviar mensajes
- Validaciones en tiempo real

---

## 🗞️ Noticias

### **Características:**
- Componente `NotiCias.vue` para mostrar noticias
- Requiere autenticación de admin
- Se pueden crear, editar y eliminar noticias

### **API Ruta:**
```javascript
GET /api/auth/noticias (requiere verificarToken + soloAdmin)
```

---

## 📅 Citas en Taller

### **Componente `CitasTaller.vue`**
- Reserva de citas para mantenimiento
- Requiere autenticación admin
- Almacena información de fecha, hora, tipo de servicio

### **API Ruta:**
```javascript
GET /api/auth/citas-taller (requiere verificarToken + soloAdmin)
```

---

## 🗂️ Componentes Principales (Frontend)

| Componente | Funcionalidad |
|-----------|-------------|
| **PaginaInicio.vue** | Página de inicio con información general |
| **NavBar.vue** | Barra de navegación con links y usuario autenticado |
| **FooTer.vue** | Pie de página |
| **ModeLos.vue** | Catálogo de vehículos disponibles |
| **BusCar.vue** | Búsqueda y filtrado de vehículos |
| **CesTa.vue** | Carrito de compras |
| **VenTas.vue** | Historial de ventas/compras del usuario |
| **TablaLogin.vue** | Formulario de login |
| **GestionClientes.vue** | CRUD de clientes (admin) |
| **ConTacto.vue** | Formulario de contacto |
| **ChatWidget.vue** | Widget de chat (integración) |
| **NotiCias.vue** | Sección de noticias |
| **CitasTaller.vue** | Gestión de citas de taller |
| **PaymentSuccess.vue** | Página post-pago exitoso |
| **PaymentCancel.vue** | Página de cancelación de pago |
| **AvisoLegal.vue** | Página de avisos legales |
| **PoliticaPrivacidad.vue** | Política de privacidad |
| **NotFound.vue** | Página 404 |

---

## 🚀 Comando de Inicio

```bash
npm start
```

Ejecuta en paralelo (con `concurrently`):
1. **JSON Server** (puerto 3000): `npm run json-server`
2. **Backend Express** (puerto 5000): `npm run server`
3. **Frontend Vite** (puerto 5173): `npm run dev`

### **URLs de Acceso:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- JSON Server: `http://localhost:3000`

---

## 📊 Flujo de Datos

```
Frontend (Vue 3)
    ↓
API Clients (axios)
    ↓
Backend (Express)
    ↓
├─ JWT Middleware (verificarToken, soloAdmin)
├─ Controllers (authController, etc.)
└─ Database (Mongoose + MongoDB / JSON Server)
```

---

## 🔑 Variables de Entorno (.env)

```
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=tu_secreto_jwt
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 📦 Dependencias Principales

### Frontend
- `vue@3.5.22` - Framework Vue 3
- `vue-router@4.6.3` - Enrutamiento
- `pinia@3.0.4` - Gestión de estado
- `axios@1.12.2` - Peticiones HTTP
- `bootstrap@5.3.8` - Framework CSS
- `jspdf@4.0.0` - Generación de PDFs
- `@stripe/stripe-js` - Pagos con Stripe

### Backend
- `express@5.2.1` - Servidor Web
- `mongoose@8.19.2` - ORM MongoDB
- `jsonwebtoken@9.0.2` - Tokens JWT
- `bcryptjs@3.0.3` - Hash de contraseñas
- `multer@2.0.2` - Upload de archivos
- `cors@2.8.5` - CORS para Frontend
- `stripe@20.1.2` - API Stripe
- `json-server@1.0.0-beta.3` - Base de datos JSON

---



---

### PASAMOS A LA EXPLICACIÓN DE MONGODB

---



---

## 🗄️ Configuración de MongoDB

### **Opción 1: MongoDB Local (Windows)**

#### Paso 1️⃣ - Descargar e Instalar MongoDB

1. Descarga **MongoDB Community Server** desde [mongodb.com/try/download](https://www.mongodb.com/try/download/community)
2. Selecciona:
   - **Platform:** Windows
   - **Package:** MSI
   - Haz clic en "Download"

3. **Ejecuta el instalador (.msi)** y sigue los pasos:
   - Acepta el acuerdo de licencia
   - Selecciona ruta de instalación (normalmente `C:\Program Files\MongoDB\Server\7.X`)
   - Instala como servicio de Windows
   - Configura MongoD Service

4. **Verifica la instalación** abriendo PowerShell:
   ```powershell
   mongod --version
   ```
   Debe mostrar la versión instalada.

#### Paso 2️⃣ - Iniciar el Servidor MongoDB

```powershell
# Inicia el servicio de MongoDB
mongod
```

O si lo instalaste como servicio Windows:
```powershell
# El servicio se inicia automáticamente
# Verifica su estado:
Get-Service MongoDB
```

**Resultado esperado:**
```
waiting for connections on port 27017
```

#### Paso 3️⃣ - Configurar la Conexión en el Proyecto

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=5000

# MongoDB - Conexión local
MONGODB_URI=mongodb://localhost:27017/proyecto_automotriz

# JWT Secret para tokens
JWT_SECRET=tu_secreto_muy_seguro_aqui_1234567890

# Stripe Keys (generadas desde Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui

# Email (para contacto)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_aplicacion
```

#### Paso 4️⃣ - Conectar MongoDB en el Backend

Abre [backend/server/server.js](backend/server/server.js) y configura la conexión:

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/proyecto_automotriz";

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB exitosamente");
  })
  .catch((error) => {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  });
```

#### Paso 5️⃣ - Verificar Conexión

Ejecuta el proyecto:
```bash
npm start
```

En la consola deberías ver:
```
✅ Conectado a MongoDB exitosamente
```

---

### **Opción 2: MongoDB Atlas (Cloud)**

#### Paso 1️⃣ - Crear una Cuenta en MongoDB Atlas

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Haz clic en **"Sign Up"** (o Sign In si ya tienes cuenta)
3. Crea una cuenta con email y contraseña
4. Verifica tu email

#### Paso 2️⃣ - Crear un Cluster

1. En el dashboard, haz clic en **"Create"** (o **"Build a Deployment"**)
2. Selecciona **"Shared"** (gratuito)
3. Elige la región más cercana a ti (ej: `Europe (eu-west-1)` para España)
4. Haz clic en **"Create"**
5. Espera a que se despliegue (2-5 minutos)

#### Paso 3️⃣ - Crear Usuario de Base de Datos

1. En el menú izquierdo, ve a **"Security" → "Database Access"**
2. Haz clic en **"Add New Database User"**
3. Rellena:
   - **Username:** `admin`
   - **Password:** Genera una contraseña fuerte (copia la contraseña)
   - **Built-in Role:** `Atlas Admin`
4. Haz clic en **"Add User"**

#### Paso 4️⃣ - Configurar IP Whitelist

1. En el menú izquierdo, ve a **"Security" → "Network Access"**
2. Haz clic en **"Add IP Address"**
3. Selecciona **"Allow Access from Anywhere"** (para desarrollo)
   - IP: `0.0.0.0/0`
4. Haz clic en **"Confirm"**

*⚠️ Para producción, especifica solo tu IP*

#### Paso 5️⃣ - Obtener Connection String

1. En el dashboard, haz clic en **"Connect"**
2. Selecciona **"Drivers"**
3. Elige **"Node.js"** como driver
4. Copia la Connection String que se ve como:
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

#### Paso 6️⃣ - Configurar en el Proyecto

Reemplaza en el archivo `.env`:

```env
MONGODB_URI=mongodb+srv://admin:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/proyecto_automotriz?retryWrites=true&w=majority
```

**Importante:** 
- Reemplaza `TU_CONTRASEÑA` con la contraseña que generaste
- Reemplaza `cluster0.xxxxx` con tu cluster ID

---

### **Paso 6️⃣ - Crear Colecciones (Datos Iniciales)**

#### Opción A: Manual (MongoDB Compass)

1. Descarga **MongoDB Compass** desde [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Abre Compass y conecta:
   - **Connection String:** `mongodb://localhost:27017` (local) o la de Atlas
3. Crea la base de datos `proyecto_automotriz`
4. Crea las colecciones:
   - `articulos`
   - `facturas`
   - `clientes`

#### Opción B: Automática (Script Node.js)

Crea [backend/scripts/seedDB.js](backend/scripts/seedDB.js):

```javascript
import mongoose from "mongoose";
import Articulo from "../modelos/Articulo.js";
import Factura from "../modelos/Factura.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Limpiar colecciones
    await Articulo.deleteMany({});
    await Factura.deleteMany({});
    console.log("🗑️ Colecciones limpiadas");

    // Insertar datos de ejemplo
    const articulos = await Articulo.insertMany([
      {
        tipo: "Vehículo",
        matricula: "1234ABC",
        marca: "Audi",
        modelo: "A4",
        anio: 2023,
        precio: 35000,
        estado: "disponible",
        combustible: "gasolina",
        transmision: "automática",
        potencia_cv: 190,
        ubicacion: { provincia: "Madrid", ciudad: "Madrid" },
        contacto: { nombre: "Juan", telefono: "600111111", email: "juan@example.com" },
        descripcion: "Audi A4 en perfecto estado"
      },
      {
        tipo: "Vehículo",
        matricula: "5678DEF",
        marca: "BMW",
        modelo: "320i",
        anio: 2022,
        precio: 28000,
        estado: "disponible",
        combustible: "gasolina",
        transmision: "manual",
        potencia_cv: 170,
        ubicacion: { provincia: "Barcelona", ciudad: "Barcelona" },
        contacto: { nombre: "María", telefono: "600222222", email: "maria@example.com" },
        descripcion: "BMW 320i con bajo kilometraje"
      }
    ]);

    console.log(`✅ ${articulos.length} vehículos insertados`);

    await mongoose.connection.close();
    console.log("✅ Script completado");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedDB();
```

Ejecuta en terminal:
```bash
node backend/scripts/seedDB.js
```

---

### **Paso 7️⃣ - Validar Conexión**

#### Test con Compass o MongoDB Shell

**MongoDB local:**
```bash
mongosh
```

```bash
# En la shell
use proyecto_automotriz
db.articulos.find()  # Debe mostrar los vehículos
```

#### Test desde el Backend

Crea [backend/test/testConnection.js](backend/test/testConnection.js):

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";
import Articulo from "../modelos/Articulo.js";

dotenv.config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conexión exitosa a MongoDB");

    // Prueba lectura
    const count = await Articulo.countDocuments();
    console.log(`📊 Total de artículos en BD: ${count}`);

    // Prueba inserción
    const newArticulo = new Articulo({
      tipo: "Vehículo",
      matricula: "TEST123",
      marca: "Test",
      modelo: "Test",
      anio: 2024,
      precio: 10000,
      combustible: "gasolina",
      transmision: "automática",
      ubicacion: { provincia: "Test", ciudad: "Test" },
      contacto: { nombre: "Test", telefono: "600000000", email: "test@test.com" }
    });

    await newArticulo.save();
    console.log("✅ Inserción exitosa");

    // Elimina el documento de prueba
    await Articulo.deleteOne({ matricula: "TEST123" });
    console.log("✅ Limpieza completada");

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
}

testConnection();
```

Ejecuta:
```bash
node backend/test/testConnection.js
```

---

### **Comparación: Local vs Atlas**

| Aspecto | Local | Atlas (Cloud) |
|--------|-------|--------------|
| **Instalación** | Requiere descargar MongoDB | Sin instalación |
| **Inicio** | Ejecutar `mongod` | Automático |
| **Acceso** | Solo localhost | Desde cualquier lugar |
| **Copia de seguridad** | Manual | Automática |
| **Escalabilidad** | Limitada | Excelente |
| **Costo** | Gratuito | Gratuito (con límites) |
| **Para desarrollo** | ✅ Recomendado | ✅ Alternativa |
| **Para producción** | ❌ No | ✅ Recomendado |

---

### **Troubleshooting: Problemas Comunes**

#### ❌ Error: "connection refused"
```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solución:**
- Verifica que MongoDB esté ejecutándose: `mongod`
- O que la Connection String de Atlas sea correcta

#### ❌ Error: "Authentication failed"
```
MongoAuthenticationError: authentication failed
```
**Solución:**
- Verifica usuario/contraseña en `.env`
- Asegúrate de que el usuario existe en MongoDB Atlas

#### ❌ Error: "IP not whitelisted"
```
MongoServerError: 513 - IP was not whitelisted
```
**Solución (Atlas):**
- Ve a Security → Network Access
- Añade tu IP o usa `0.0.0.0/0` para desarrollo

#### ❌ Error: "Database not found"
```
MongoParseError: Invalid connection string
```
**Solución:**
- Verifica la Connection String
- Asegúrate de reemplazar `PASSWORD` con tu contraseña real

---

### **Variables de Entorno Completas**

Archivo `.env` recomendado:

```env
# =====================
# SERVIDOR
# =====================
PORT=5000
NODE_ENV=development

# =====================
# BASE DE DATOS - MongoDB
# =====================
# Opción 1: Local
MONGODB_URI=mongodb://localhost:27017/proyecto_automotriz

# Opción 2: Atlas (comentar la anterior y descomentar esta)
# MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/proyecto_automotriz?retryWrites=true&w=majority

# =====================
# AUTENTICACIÓN
# =====================
JWT_SECRET=tu_secreto_muy_seguro_con_numeros_123456789
JWT_EXPIRES_IN=2h

# =====================
# STRIPE (Pagos)
# =====================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# =====================
# EMAIL (Contacto)
# =====================
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_aplicacion

# =====================
# CORS
# =====================
FRONTEND_URL=http://localhost:5173
```

---

## 🎨 Estilos y Diseño

- **Bootstrap 5**: Framework CSS principal
- **Font Awesome**: Iconografía
- **Bootstrap Icons**: Iconografía adicional
- **Colores:** Basados en tema Bootstrap (primary, success, danger, info)
- **Responsive:** Diseño mobile-first
- **Ancho máximo:** 80% del viewport

---

## 🔍 Resumen General

Este es un **sistema completo de e-commerce automotriz** donde:

✅ Los usuarios pueden **buscar y comprar vehículos**  
✅ El **carrito persiste** en localStorage  
✅ Los **pagos se procesan con Stripe**  
✅ Hay **autenticación con JWT y roles (user/admin)**  
✅ Los admins pueden **gestionar noticias, citas y clientes**  
✅ Se generan **facturas en PDF**  
✅ Hay **formulario de contacto** con envío de emails  
✅ Los datos se almacenan en **MongoDB y JSON Server**  
✅ Las imágenes se suben al **servidor con Multer**  

**Arquitectura:** Frontend SPA desacoplada del Backend API REST, ambos comunicándose vía HTTP con autenticación JWT.

