# Pulse — Plataforma de Gestión de Incidencias Técnicas

Pulse es una plataforma web full-stack para la **gestión de incidencias técnicas**, diseñada para operar con **roles diferenciados** (Administrador, Técnico y Usuario).  
Permite reportar fallas, asignarlas, dar seguimiento, y administrar usuarios desde un panel centralizado.

---

## Arquitectura general

El proyecto está compuesto por **tres capas principales**:

- **Frontend**: React + Vite
- **Backend**: Node.js + Express (API REST)
- **Base de datos**: MySQL
- **Infraestructura**: Docker + Docker Compose

Todos los servicios de backend y base de datos se levantan mediante **Docker Compose**.

---

## Requisitos del sistema

Antes de instalar el proyecto asegúrate de tener:

### Requerido
- **Node.js** `20.19` o superior  
- **npm** `v9.x` o superior  
- **Docker** `v20.x` o superior  
- **Docker Compose** `v2.x`

# Verificar versiones:

bash
    node -v
    npm -v
    docker -v
    docker compose version

# Estructura del proyecto

# Frontend
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Recover.jsx
│   ├── Dashboard.jsx
│   ├── AdminBoard.jsx
│   ├── TechnicianBoard.jsx
│   └── UserManagement.jsx
│
├── services/
│   ├── api.js
│   └── auth.js
│
├── styles.css
├── App.jsx
└── main.jsx

# Backend
backend/
├── routes/
│   ├── auth.js
│   ├── usuarios.js
│   └── incidencias.js
│
├── services/
│   └── database.js
│
├── server.js
└── docker-compose.yml

# Instalación del proyecto
#Clonar el repositorio
git clone https://github.com/tu-usuario/pulse.git
cd netpulse

# Instalar dependencias del frontend
npm install
Esto instalará React, React Router, Vite y demás dependencias.

# Backend y Base de Datos (Docker)
El backend y MySQL se ejecutan mediante Docker Compose.

# Levantar servicios
docker compose up -d

Esto levantará:
    API backend en http://localhost:4000
    Base de datos MySQL

# Detener servicios
docker compose down

# Ejecutar el frontend
npm run dev


El frontend estará disponible en:
http://localhost:5173

# Conexión Frontend ↔ Backend
http://localhost:4000/api


Configurado en:
src/services/api.js

# Autenticación y roles
# Rol   Permisos
Admin	Gestión total del sistema
Técnico	Gestión de incidencias asignadas
Usuario	Reporte y seguimiento de incidencias

# Seguridad

Autenticación con JWT

Rutas protegidas por rol

Persistencia de sesión en localStorage

Responsive Design

Navbar responsive con menú móvil

Layout adaptado a tablets y smartphones

Tablas con scroll horizontal

Componentes optimizados para mobile

# Estado actual del proyecto
Funcionalidad	Estado
Login / Logout	
Gestión de usuarios	
Panel administrador	
Panel técnico	
Incidencias	
Recuperación de cuenta	🚧 (email pendiente)
Responsive

# Comandos útiles
npm run dev          # Ejecutar frontend
docker compose up -d # Levantar backend + DB
docker compose down  # Detener backend + DB

# Proyecto desarrollado con fines académicos y prácticos.

# Licencia
#Uso educativo y demostrativo.

