# Sistema de Gestión de Tareas Internas

Este proyecto es una aplicación web diseñada para la gestión eficiente de tareas internas de un equipo técnico. Permite a los usuarios organizar su trabajo mediante la creación, edición, eliminación y filtrado de tareas, asignando prioridades y estados para un mejor seguimiento.

## 🛠️ Tecnologías Utilizadas

El proyecto está construido bajo una arquitectura Cliente-Servidor separada, utilizando tecnologías modernas para garantizar escalabilidad y un desarrollo ágil.

### Frontend (SPA)
* **React:** Librería principal para la construcción de interfaces de usuario interactivas.
* **TypeScript:** Superset de JavaScript que añade tipado estático para un código más robusto y con menos errores en tiempo de ejecución.
* **Vite:** Herramienta de construcción (bundler) ultrarrápida para el entorno de desarrollo.
* **Tailwind CSS (v3):** Framework de CSS de utilidad (utility-first) para un diseño responsivo y ágil sin salir del HTML/JSX.
* **React Router DOM:** Para el enrutamiento interno de la Single Page Application (SPA) y protección de rutas privadas.
* **Context API:** Herramienta nativa de React utilizada para el manejo global del estado de autenticación (`AuthContext`).

### Backend (API REST)
* **Python & Django:** Framework de alto nivel para un desarrollo rápido y un diseño limpio.
* **Django REST Framework (DRF):** Kit de herramientas potente y flexible para construir la API web.
* **Django Filter:** Extensión utilizada para implementar el filtrado eficiente de tareas por parámetros en la URL (Query Parameters).
* **Autenticación por Token:** Sistema integrado de DRF para asegurar los endpoints de la API.
* **CORS Headers:** Configuración para permitir la comunicación segura entre el servidor frontend y el backend en distintos puertos.

---

## 🏗️ Descripción General de la Solución (Arquitectura y Enfoque)

La solución se abordó mediante una arquitectura **desacoplada (Decoupled Architecture)** donde el Frontend y el Backend operan de manera independiente comunicándose exclusivamente a través de una **API RESTful** en formato JSON.

1. **Enfoque del Backend:** Se diseñó un modelo de datos robusto (`Task`) anclado al modelo de usuarios nativo de Django. Se implementaron vistas basadas en `ModelViewSet` para delegar en DRF el manejo del CRUD estándar, manteniendo el código limpio (`DRY` - *Don't Repeat Yourself*). La seguridad se maneja mediante Tokens, asegurando que cada usuario solo interactúe con el sistema si está autenticado, y se asigna automáticamente la autoría de las tareas en la capa de serialización.

2. **Enfoque del Frontend:** Se optó por una **Single Page Application (SPA)** para evitar recargas completas de la página, brindando una sensación de fluidez similar a una aplicación nativa. La gestión de sesiones se realiza guardando el token de acceso en el `localStorage` del navegador, el cual es inyectado dinámicamente en las cabeceras (`headers`) de cada petición HTTP (fetch) hacia la API.

---

## 👥 ¿Cómo funciona? (Perspectiva del Usuario Final)

Desde la perspectiva del usuario final, la aplicación ofrece una experiencia fluida, intuitiva y sin interrupciones:

1. **Acceso Seguro (Login):** Al ingresar a la aplicación, el usuario es recibido por una pantalla de inicio de sesión. Si intenta acceder a sus tareas sin credenciales, el sistema lo redirigirá automáticamente de vuelta al login para proteger la información.
2. **Tablero Principal (Dashboard):** Una vez autenticado, el usuario accede a su panel de gestión visualizado como una cuadrícula de tarjetas (Cards). En la parte superior, cuenta con botones de filtro rápidos para ver todas sus tareas, o aislar aquellas que están *Pendientes*, *En Progreso* o *Completadas*.
3. **Gestión sin fricciones (UX):** * **Crear:** Para añadir una nueva tarea, el usuario simplemente hace clic en una tarjeta especial con un ícono de "+". Esta tarjeta se transforma inmediatamente en un formulario en línea, permitiéndole ingresar el título, descripción, prioridad y fecha límite sin ser llevado a otra página ni abrir ventanas emergentes invasivas.
   * **Visualizar y Editar:** Las tareas creadas se muestran con indicadores visuales de colores para su estado y prioridad, facilitando la lectura rápida. Al pasar el cursor sobre una tarea, aparecen opciones para editarla (convirtiendo esa tarjeta específica nuevamente en un formulario) o eliminarla.

---

*Desarrollado por Richard Cevallos Apolo.*