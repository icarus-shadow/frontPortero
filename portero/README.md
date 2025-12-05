# Portero - Sistema de Control de Accesos

<p align="center">
  <strong>Aplicación especializada para el registro rápido de entradas y salidas de equipos</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Redux-2.10.1-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux">
  <img src="https://img.shields.io/badge/Vite-7.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

---

## 📋 Descripción

**Portero** es una aplicación web simplificada diseñada específicamente para el rol de portería o recepción. A diferencia del sistema administrativo completo (Lumina), Portero se enfoca exclusivamente en el registro rápido y eficiente de entradas y salidas de equipos, proporcionando una interfaz optimizada para celadores y personal de guardia.

Esta aplicación complementa al sistema principal, ofreciendo una experiencia de usuario simplificada y enfocada en las tareas operativas diarias de control de acceso.

### ✨ Características Principales

- 🚪 **Registro Rápido de Entradas**: Interfaz optimizada para registrar entradas de equipos de forma ágil
- 🚶 **Registro de Salidas**: Actualización instantánea de registros de salida
- 📸 **Escaneo QR Integrado**: Identificación rápida de equipos mediante código QR
- 🔔 **Actualizaciones en Tiempo Real**: WebSocket para sincronización instantánea con el sistema principal
- 📊 **Visualización de Historial**: Vista en tiempo real de entradas y salidas activas
- 🔐 **Autenticación Segura**: Login con tokens JWT
- ⚡ **Rendimiento Optimizado**: Interfaz ligera y rápida para uso operativo
- 🎨 **Alertas Visuales Animadas**: Feedback inmediato con animaciones usando Anime.js
- 📱 **Diseño Responsive**: Adaptable a tablets y dispositivos móviles

### 🎯 Enfoque del Sistema

A diferencia del sistema administrativo **Lumina**, esta aplicación:
- ❌ **No incluye** gestión de usuarios (CRUD)
- ❌ **No incluye** gestión de equipos (CRUD)
- ✅ **Sólo permite** registrar entradas y salidas
- ✅ **Consume datos** ya creados en el sistema principal
- ✅ **Interfaz simplificada** para uso operativo rápido

---

## 🛠️ Stack Tecnológico

### Frontend Framework
- **React 19.1.0**: Biblioteca principal (versión más reciente)
- **TypeScript 5.8.3**: Tipado estático para mayor robustez
- **Vite 7.0.0**: Build tool ultrarrápido

### Gestión de Estado
- **Redux Toolkit 2.10.1**: Manejo centralizado del estado
- **React Redux 9.2.0**: Integración con React

### UI/UX Libraries
- **Material-UI (MUI) 5.16.0**: Componentes de interfaz
  - `@mui/material`: Componentes core
  - `@mui/icons-material`: Iconos
  - `@mui/x-data-grid`: Tablas de datos
  - `@mui/x-date-pickers`: Selectores de fecha/hora
- **PrimeReact 10.8.3**: Componentes UI adicionales
- **Styled Components 6.1.19**: CSS-in-JS para estilos dinámicos
- **Lucide React 0.468.0**: Iconos modernos

### Utilidades y Herramientas
- **Axios 1.13.2**: Cliente HTTP para API
- **React Router DOM 7.6.3**: Navegación SPA
- **Anime.js 4.2.2**: Animaciones fluidas
- **Canvas Confetti 1.9.3**: Efectos visuales de celebración
- **Day.js 1.11.19**: Manipulación de fechas
- **html5-qrcode 2.3.8**: Escaneo de códigos QR
- **@yudiel/react-qr-scanner 2.1.0**: Scanner QR alternativo
- **QRCode.react 4.2.0**: Generación de códigos QR
- **Chart.js 4.5.1 + react-chartjs-2 5.3.1**: Gráficos
- **jsPDF 3.0.4 + jspdf-autotable 5.0.2**: Generación de PDFs
- **html2canvas 1.4.1**: Capturas de pantalla
- **Laravel Echo 2.2.6 + Pusher.js 8.4.0**: WebSockets
- **i18next 25.4.2**: Internacionalización

### Desarrollo
- **ESLint 9.29.0**: Linter de código
- **TypeScript ESLint 8.34.1**: Reglas específicas de TS

---

## 📁 Estructura del Proyecto

```
portero/
├── public/                        # Archivos estáticos
│   └── vite.svg                  # Favicon
├── src/
│   ├── assets/                   # Recursos multimedia
│   │   ├── icon.svg             # Icono de la aplicación
│   │   └── lumina-logo.png      # Logo del sistema
│   ├── components/              # Componentes reutilizables
│   │   ├── AlertSystem.tsx      # Sistema de alertas animadas
│   │   ├── Banner.tsx           # Barra superior
│   │   ├── Camera.tsx           # Componente de cámara QR
│   │   ├── ContNav.tsx          # Navegación de control
│   │   ├── CounterCard.tsx      # Tarjeta de contador
│   │   ├── CustomAlert.tsx      # Alerta personalizada
│   │   ├── DinamicTable.tsx     # Tabla dinámica
│   │   ├── Modal.tsx            # Modal genérico
│   │   ├── Reportes.tsx         # Generador de reportes
│   │   ├── modalForm.tsx        # Formulario modal (registro)
│   │   └── styles/              # Estilos de componentes
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── auth/                # Autenticación
│   │   │   └── Login.tsx        # Página de login
│   │   ├── entradas.tsx         # Página de entradas
│   │   └── salidas.tsx          # Página de salidas
│   ├── services/                # Servicios de la aplicación
│   │   ├── api/                 # Servicios API
│   │   │   ├── data/           # APIs de datos
│   │   │   │   ├── Elements.tsx     # API de equipos
│   │   │   │   ├── Formation.tsx    # API de formaciones
│   │   │   │   ├── LevelFormation.tsx
│   │   │   │   ├── SubElements.tsx  # API de sub-elementos
│   │   │   │   ├── Users.tsx        # API de usuarios
│   │   │   │   └── history.tsx      # API de historial
│   │   │   ├── Auth.tsx         # API de autenticación
│   │   │   └── baseApi.tsx      # Configuración Axios base
│   │   ├── redux/               # Configuración Redux
│   │   │   ├── slices/         # Redux slices
│   │   │   │   ├── data/       # Slices de datos
│   │   │   │   │   ├── elementsSlice.tsx
│   │   │   │   │   ├── formationSlice.tsx
│   │   │   │   │   ├── historySlice.tsx
│   │   │   │   │   └── UsersSlice.tsx
│   │   │   │   ├── AuthSlice.tsx    # Slice de auth
│   │   │   │   └── index.tsx        # Exportaciones
│   │   │   ├── hooks.tsx        # Hooks de Redux
│   │   │   └── store.tsx        # Store configurado
│   │   └── useEffects/          # Custom hooks
│   │       ├── history.tsx      # Efectos de historial
│   │       ├── slice.tsx        # Efectos generales
│   │       └── users.tsx        # Efectos de usuarios
│   ├── types/                   # Tipos TypeScript
│   │   └── interfacesData.tsx   # Interfaces de datos
│   ├── App.tsx                  # Componente principal
│   ├── index.css                # Estilos globales
│   ├── main.tsx                 # Punto de entrada
│   └── vite-env.d.ts           # Tipos de Vite
├── .gitignore                   # Git ignore
├── eslint.config.js             # Configuración ESLint
├── index.html                   # HTML principal
├── package.json                 # Dependencias y scripts
├── README.md                    # Este archivo
├── tsconfig.json                # Config TypeScript base
├── tsconfig.app.json            # Config TS para app
├── tsconfig.node.json           # Config TS para Node
└── vite.config.ts               # Configuración de Vite
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con Vite |
| `npm run build` | Compila la aplicación para producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |
| `npm run preview` | Previsualiza la build de producción |

---

## 🔑 Roles de Usuario

El sistema está diseñado principalmente para el rol de **Celador** (ID: 3), aunque soporta autenticación de los tres roles:

| Rol | ID | Uso en Portero |
|-----|-----|----------------|
| **Usuario** | 1 | Acceso limitado |
| **Admin** | 2 | Acceso completo |
| **Celador** | 3 | **Rol principal** - Operación diaria |

---

## 📊 Modelos de Datos

Los modelos son los mismos que en el sistema principal Lumina:

### Usuario
```typescript
{
  id: number;
  role_id: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  path_foto: string;
  email: string;
  role: Role;
  formacion: Formacion;
}
```

### Elemento/Equipo
```typescript
{
  id: number;
  sn_equipo: string;           // Número de serie
  marca: string;
  color: string;
  tipo_elemento: string;
  descripcion: string;
  qr_hash: string;            // Hash del QR
  path_foto_equipo_implemento: string;
  usuarios: Usuario[];        // Usuarios asignados
}
```

### Historial
```typescript
{
  id: number;
  usuario_id: number;
  equipos_o_elementos_id: number;
  ingreso: string;            // Timestamp de entrada
  salida: string;             // Timestamp de salida
  equipo: Elemento;
  usuario: Usuario;
}
```

---

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Login con email y contraseña
- Validación de tokens JWT
- Almacenamiento seguro en localStorage
- Interceptores Axios automáticos

### 2. Registro de Entradas
- Escaneo rápido de código QR del equipo
- Selección manual de equipo y usuario
- Validación de datos en tiempo real
- Confirmación visual con feedback animado
- Registro automático de timestamp
- Actualización instantánea del contador de entradas

### 3. Registro de Salidas
- Vista de entradas activas (sin salida registrada)
- Búsqueda por usuario o equipo
- Registro de salida con un solo clic
- Actualización automática del timestamp de salida
- Confirmación con animación
- Actualización del contador de salidas

### 4. Visualización en Tiempo Real
- Tabla dinámica de entradas recientes
- Tabla de salidas registradas
- Contadores actualizados automáticamente vía WebSocket
- Sincronización con el sistema principal

### 5. Sistema de Alertas
- Confirmaciones visuales de acciones
- Alertas de error con mensajes claros
- Notificaciones de éxito con animación
- Sistema consistente usando AlertSystem

---

## 🔄 Flujo de la Aplicación

```
┌─────────────┐
│   Login     │ (Autenticación con JWT)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Banner    │ Visible en todas las páginas
└──────┬──────┘
       │
       ▼
┌────────────────────────────┐
│    Rutas Principales       │
├────────────────────────────┤
│  /entradas  │  Registro de │
│             │  Entradas    │
├─────────────┼──────────────┤
│  /salidas   │  Registro de │
│             │  Salidas     │
└────────────────────────────┘
       │
       ▼
┌─────────────────┐
│  Redux Store    │ (Estado sincronizado)
└─────────┬───────┘
          │
          ▼
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐       ┌──────▼─────┐
│   API  │◄─────►│  WebSocket │
│Backend │       │   (Echo)   │
└────────┘       └────────────┘
```

---

## 🎨 Componentes Destacados

### modalForm (Registro de Entrada/Salida)
Componente complejo para el registro:
- Modal responsive con diferentes modos (entrada/salida)
- Escaneo QR integrado con cámara
- Selección de usuario y equipo
- Validación de campos en tiempo real
- Vista previa de equipos con imágenes
- Confirmación con feedback visual
- Integración con AlertSystem

**Características**:
- 40,000+ líneas de código
- Manejo de estados complejos
- Integración con múltiples APIs
- Animaciones fluidas

### DinamicTable
Tabla optimizada para visualización rápida:
- Renderizado eficiente
- Paginación automática
- Búsqueda integrada
- Acciones contextuales
- Responsive design

### AlertSystem
Sistema de alertas centralizado:
- 4 tipos: Success, Error, Warning, Info
- Animaciones con Anime.js
- Barra de progreso
- Alertas de confirmación
- Diseño moderno

### Banner
Barra de navegación simplificada:
- Logo del sistema
- Navegación entre entradas/salidas
- Información del usuario
- Botón de logout
- Contador de registros

---

## 🌐 API y Backend

**Backend compartido con Lumina:**
```
https://lumina-testing.onrender.com/api/
```

### Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/login` | Autenticación |
| GET | `/usuarios` | Listar usuarios (lectura) |
| GET | `/equipos_o_elementos` | Listar equipos (lectura) |
| GET | `/historial` | Obtener historial |
| POST | `/historial` | **Crear registro entrada/salida** |
| GET | `/formaciones` | Listar formaciones |

**Nota**: A diferencia del sistema administrativo, Portero **solo consume datos** (GET) y **crea registros de historial** (POST). No realiza operaciones de actualización o eliminación de usuarios/equipos.

---

## 🔐 Seguridad

- **Tokens JWT**: Autenticación basada en tokens
- **Interceptores Axios**: Inyección automática de token
- **Validación de roles**: Control de acceso
- **Almacenamiento seguro**: localStorage con cifrado de token
- **Validación de formularios**: Sanitización de inputs

---

## 🎓 Uso del Sistema

### Inicio de Sesión
1. Acceder a la aplicación
2. Ingresar credenciales de celador
3. Sistema valida y genera token
4. Redirección a `/entradas`

### Registrar Entrada
1. Click en botón "Registrar Entrada"
2. **Opción A**: Escanear código QR del equipo
   - Activar cámara
   - Enfocar código QR
   - Sistema identifica equipo automáticamente
3. **Opción B**: Selección manual
   - Seleccionar equipo de la lista
   - Seleccionar usuario
4. Click en "Confirmar"
5. Sistema registra con timestamp automático
6. Feedback visual de éxito
7. Actualización automática de tabla y contador

### Registrar Salida
1. Ir a pestaña "Salidas"
2. Buscar entrada activa en la tabla
3. Click en botón "Registrar Salida"
4. Confirmar acción
5. Sistema actualiza registro con timestamp de salida
6. Feedback visual de éxito
7. Actualización de contador

### Consultar Historial
- Vista de entradas: muestra registros sin salida
- Vista de salidas: muestra registros completados
- Filtrado por búsqueda
- Paginación automática

---

## 🐛 Solución de Problemas

### La aplicación no carga
- Verificar que el servidor de desarrollo esté corriendo
- Revisar la consola del navegador
- Verificar dependencias instaladas: `npm install`

### Error de autenticación
- Limpiar localStorage: `localStorage.clear()`
- Verificar credenciales
- Comprobar conexión con backend

### El escáner QR no funciona
- Verificar permisos de cámara en el navegador
- Comprobar que el dispositivo tenga cámara
- Probar con selección manual como alternativa

### No se actualizan los contadores
- Verificar conexión WebSocket
- Revisar permisos de red/firewall
- Refrescar la página

### Error al registrar entrada/salida
- Verificar que el backend esté disponible
- Comprobar que el usuario y equipo existan
- Revisar la consola para mensajes de error específicos

---

## 🔗 Relacionado

Este proyecto es parte del ecosistema **Lumina**:
- **Lumina (front_proyecto)**: Sistema administrativo completo
- **Portero**: Esta aplicación - Interfaz simplificada para portería
- **Backend**: API REST compartida en Laravel

---

## Manual de uso

# Aplicacion web de portero para el sistema LUMINA

1\. Como primer vistazo el sistema tiene un login en donde se registaran las credenciales de portero

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/1f9cb81e-161a-4a2c-91bd-342ec278a4c3/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0)


2\. Este es el dashboard de portero, por defecto inicia en la página de entradas en la que se listaran los elementos que han sido ingresados en el dia

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/9bb4930b-9338-4301-8482-c4c31d769141/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=26,165)


3\. adicionalmente en la sección de entradas se encuentra justo en la parte inferior una tabla con entradas de otras fechas, esto ya que el sistema permite la permanencia de los equipos por lo que aparecerán en esta sesión elementos que fueron ingresados en otras fechas y no se les a dado salida.

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/7d1abf45-575c-4d21-bef1-ce5fe72906d6/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=1060,488)


4\. Estos son los filtros que tienen las tablas (son los mismos para todas las tabas), en este se puede filtrar por hora especifica un rango de fechas, turno o jornada o por algún usuario en específico, estos filtros están diseñados para manejar la información de forma más cómoda.

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/8689c858-0417-4849-8304-f2e11ada5074/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=786,382)


5\. el sistema también cuenta con la opción de generar reportes, estos funcionan con la información listada por lo que se puede filtrar a gusto la información antes de generar el reporte.

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/3c9d0d91-e938-4b16-a528-bba7b46086ca/ascreenshot.jpeg?tl_px=0,0&br_px=1310,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=186,110)


6\. antes de generar el reporte aparecerá la siguiente ventana, en esta se mostrarán unas estadísticas del tráfico de la información listada, esta información también aparecerá en el pdf del reporte

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/1d5c1b48-f4c8-47d1-a05d-63e884461355/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=1009,462)


7\. este es el dashboard de salidas, muestra las salidas que se han hecho en el dia

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/5ed8dadf-5efe-430f-9b4d-8fd9418b9df9/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=1059,482)


8\. este es el modal para realizar una entrada/salida, como primer paso en este modal se deben dar los respectivos permisos para uso de la camara

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/b69582ce-bc55-49f5-81df-b8fabe0ba6c7/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=383,222)


9\. al escanear un elemento o usuario en la sección de la derecha se podrá apreciar la información del respectivo elemento o usuario con su imagen para su identificación

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/41823dc6-bd7e-434a-9c42-302106213bc3/ascreenshot.jpeg?tl_px=257,38&br_px=1357,653&force_format=jpeg&q=100&width=1101&wat_scale=98&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=841,393)


10\. al estar ambos datos registrados (usuario y elemento) se deshabilitará la camara para evitar errores, la información se puede limpiar en caso de no querer continuar con la acción

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/b0ecf28c-f776-44e7-b138-5a3980fa8cd5/ascreenshot.jpeg?tl_px=257,0&br_px=1357,615&force_format=jpeg&q=100&width=1101&wat_scale=98&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=797,78)


11\. luego de dar la salida el modal permanecerá activo, para permitir el ingreso/salida de multiples elementos de forma continua

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/b8cf954a-f951-42af-b037-43f431f149e4/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=798,393)


12\. los historiales tienen la opción para ver más información

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/c04ad777-18ed-4434-9847-5d43d0575cb3/ascreenshot.jpeg?tl_px=257,38&br_px=1357,653&force_format=jpeg&q=100&width=1101&wat_scale=98&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=545,313)


13\. Este es el modal que mostrara justo después de darle al botón, en este se mostrara de forma más completa la información tanto del usuario como del equipo junto con las fechas y horas del ingreso/salida

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/f471580d-c6a5-44d1-a831-b306f985b068/ascreenshot.jpeg?tl_px=0,0&br_px=1358,654&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=722,462)


14\. la aplicación también cuenta con su respectivo botón para cerrar sesión

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/28e99e44-0821-4f3d-9a2f-66f5c8d9a20a/ascreenshot.jpeg?tl_px=257,0&br_px=1357,615&force_format=jpeg&q=100&width=1101&wat_scale=98&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=680,33)


#### alertas y verificiones


15\. Alerta de tipo "success", esta alerta sale cuando alguna acción se realizó correctamente

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/cc773a75-c78a-4479-ba48-61c72661d451/ascreenshot.jpeg?tl_px=1000,0&br_px=1358,199&force_format=jpeg&q=100&width=357&wat_scale=31&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=171,61)


16\. Este es el banner que lanzara cuande se intente ingresar un elemento que ya tiene un registro previo sin resolver (no se le ha dado salida al equipo)

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/ebb3bf42-386f-4ba3-89b1-8ad95d006521/ascreenshot.jpeg?tl_px=356,154&br_px=1027,529&force_format=jpeg&q=100&width=671&wat_scale=59&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=327,242)


17\. este es el banner que sale cuando se intenta realizar una salida a un elemento que no ha sido registrado

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/c051ebf6-9fb8-4466-9b77-30e8ac934306/ascreenshot.jpeg?tl_px=350,130&br_px=1021,505&force_format=jpeg&q=100&width=671&wat_scale=59&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=953,455)


18\. esta es la alerta sale cuando se intenta realizar una salida/ingreso, pero el propietario no es el mismo que tiene asignado el elemento

![](https://ajeuwbhvhr.cloudimg.io/https://colony-recorder.s3.amazonaws.com/files/2025-12-05/f83b9ae7-af85-4fbc-b8e1-38f17747b9a2/ascreenshot.jpeg?tl_px=373,154&br_px=985,496&force_format=jpeg&q=100&width=612&wat_scale=54&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/FB923C_standard.png&wat_pad=951,448)
#### [Made with Scribe](https://scribehow.com/shared/Aplicacion_web_para_el_sistema_LUMINA__pR6UOnbJTH-8xoBO2LX1cQ)

---

<p align="center">Hecho con ❤️ usando React 19 + TypeScript</p>
