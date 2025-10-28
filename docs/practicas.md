# Practicas para el desarrollo

Este documento establece normas y pautas técnicas para garantizar la calidad, mantenibilidad, escalabilidad y seguridad del Sistema de Gestión de Incapacidades Médicas. Se complementa con las tecnologías definidas para el entorno operativo: **React (TypeScript, CSS, HTML)**, **C#**, **MariaDB** y **Debian Server**.

---

## 1. Normas y Buenas Prácticas de Front-end (React/TypeScript/CSS)

Las prácticas de Front-end se centran en la experiencia del usuario (UX) y la arquitectura de componentes.

### A. Estructura y Componentes

* **Atomic Design:** Usar la metodología **Atomic Design** (Átomos, Moléculas, Organismos) para estructurar los componentes. Esto facilita la reutilización y el mantenimiento.
* **Separación de Preocupaciones:** Los componentes deben ser o **presentacionales** (solo renderizan UI) o **contenedores** (manejan la lógica y el estado).
* **Nomenclatura Clara:** Nombrar componentes y archivos usando **PascalCase** (e.g., `IncapacityForm.tsx`).

### B. TypeScript y Manejo de Estado

* **Tipado Estricto:** Utilizar **TypeScript** de manera estricta, definiendo interfaces explícitas para props, estado y datos de APIs.
* **Manejo de Estado Centralizado:** Utilizar una biblioteca de gestión de estado global (e.g., Redux, Recoil, o Context API optimizado) solo para el estado crítico (e.g., datos de sesión, datos de incapacidades, alertas globales).
* **Hooks Personalizados:** Crear *custom hooks* para encapsular lógica compleja o repetitiva (e.g., manejo de formularios, llamadas a APIs).

### C. Estilo (CSS)

* **CSS-in-JS o Módulos:** Utilizar **módulos CSS** o una librería CSS-in-JS para asegurar que los estilos sean de ámbito local a cada componente, evitando colisiones.
* **Convención BEM:** Si se usa CSS plano o preprocesadores, implementar la convención **BEM** (Bloque, Elemento, Modificador) para la nomenclatura de clases.

---

## 2. Normas y Buenas Prácticas de Back-end (C#)

Las prácticas de Back-end se enfocan en la lógica de negocio, la seguridad y la eficiencia de los datos.

### A. Arquitectura y Diseño

* **Arquitectura en Capas:** Implementar una arquitectura limpia o de cebolla (e.g., **Dominio, Aplicación, Infraestructura**) para desacoplar la lógica de negocio de la tecnología de la base de datos o APIs externas.
* **Inyección de Dependencias (DI):** Usar la inyección de dependencias para manejar la creación y ciclo de vida de los servicios (e.g., servicios de *logging*, repositorios).
* **Principios SOLID:** Aplicar los principios SOLID para asegurar que el código sea mantenible y extensible.

### B. Manejo de Datos y Seguridad

* **Transacciones Explícitas:** Usar **transacciones de base de datos** para todas las operaciones que requieran la consistencia de múltiples registros (e.g., al registrar una incapacidad y su documento asociado).
* **ORMs y Repositorios:** Utilizar un *Object-Relational Mapper* (ORM) como Entity Framework Core, y usar el patrón **Repositorio** para abstraer la lógica de acceso a **MariaDB**.
* **Validación de Entrada:** Validar **siempre** los datos de entrada en el servidor, incluso si ya fueron validados en el Front-end.

---

## 3. Normas y Buenas Prácticas de Docker

Docker se utilizará para estandarizar el entorno de operación de la aplicación en el servidor **Debian**.

* **Imágenes Ligeras:** Usar imágenes base minimalistas o multi-etapa (multi-stage builds) para reducir el tamaño final de la imagen.
* **Variables de Entorno:** Configurar datos sensibles (e.g., credenciales de **MariaDB**) y configuraciones específicas (e.g., URLs de APIs externas) mediante **Variables de Entorno** (ENV), nunca codificados en el *Dockerfile*.
* **Archivos `.dockerignore`:** Utilizar el archivo `.dockerignore` para excluir archivos innecesarios (e.g., `node_modules`, `bin`, *logs*) que ralentizarían la construcción de la imagen.
* **Usuarios No-Root:** Ejecutar los contenedores con un **usuario no-root** para minimizar riesgos de seguridad.

---

## 🔗 4. Normas y Buenas Prácticas de APIs Externas

La integración se realizará con portales de **EPS** y **ARL**, el **Sistema Contable** y el **Correo Electrónico Institucional**.

### A. Integración y Resiliencia

* **Patrón *Circuit Breaker*:** Implementar el patrón *Circuit Breaker* para manejar fallos temporales en las comunicaciones con servicios críticos como los portales de **EPS** y **ARL**.
* **Reintentos y *Timeouts*:** Definir políticas de reintento y *timeouts* claros para todas las llamadas a APIs externas.
* **Manejo de Errores:** Registrar y manejar de forma explícita los códigos de error HTTP de las APIs externas para informar adecuadamente al usuario (e.g., la **radicación fallida** en una EPS).

### B. Seguridad

* **Tokens y Cifrado:** Usar **OAuth 2.0** o **JSON Web Tokens (JWT)** para la autenticación en APIs externas si es posible.
* **No Exposición de Claves:** Almacenar todas las claves de API, *tokens* y credenciales de portales en un almacén de secretos (no en el código fuente) y acceder a ellos mediante variables de entorno en el contenedor **Docker**.
