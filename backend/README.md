# Backend – Sistema de Gestión de Incapacidades

Este backend implementa una arquitectura limpia para la administración de incapacidades médicas, integraciones con EPS/ARL y procesos de conciliación. Está construido sobre .NET 9, Entity Framework Core y MariaDB, siguiendo las buenas prácticas descritas en el enunciado.

## Requisitos previos

- [.NET SDK 9.0](https://dotnet.microsoft.com/)
- MariaDB 10.6+ o MySQL 8.0+
- Git y PowerShell (Windows) / Bash (Linux/macOS)

## Estructura de soluciones

```
backend/
├── Domain/            # Entidades, enums y lógica del dominio
├── Application/       # DTOs, interfaces, servicios de aplicación
├── Infrastructure/    # DbContext, repositorios e integración externa
├── API/               # Endpoints REST, Swagger y configuración HTTP
├── Shared/            # Utilidades comunes (ApiResponse, clases base)
└── Incapacidades.sln  # Solución principal
```

## Configuración inicial

1. **Clonar el repositorio** y posicionarse en la carpeta `backend`.
2. **Variables de entorno / `appsettings.json`:**

   - `ConnectionStrings:IncapacidadesDatabase`: cadena de conexión MariaDB.
   - `Jwt:Secret`: clave secreta para emitir tokens JWT.
   - `Jwt:Issuer` y `Jwt:Audience`: identificadores de emisor y audiencia.

   Ejemplo de `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "IncapacidadesDatabase": "server=localhost;port=3306;database=gestion_incapacidades;user=root;password=secret;"
     },
     "Jwt": {
       "Secret": "TemporalSecretKeyParaDesarrollo123!",
       "Issuer": "Incapacidades.Api",
       "Audience": "Incapacidades.Clientes"
     }
   }
   ```

3. **Migraciones (opcional):** ejecutar scripts en `database/migrations` según el ambiente o crear migraciones de EF Core con `dotnet ef migrations add Nombre`.

## Ejecución

```bash
cd backend
dotnet restore
dotnet build
dotnet run --project API/Incapacidades.API.csproj
```

La API escuchará por defecto en `http://localhost:5192` (desarrollo) o `https://localhost:7093` (producción) y expone documentación Swagger en `/swagger`.

## 📡 API Reference - Endpoints para Frontend

La API utiliza respuestas estandarizadas con `ApiResponse<T>` y requiere autenticación JWT. Todos los endpoints están documentados en Swagger (`/swagger`).

### 🔐 Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": ["admin", "gestor_humana"]
  }
}
```

#### Registro (solo administradores)
```http
POST /api/auth/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 👥 Gestión de Usuarios

#### Listar usuarios
```http
GET /api/users
Authorization: Bearer {token}
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-15T10:30:00Z",
    "roles": ["admin"]
  }
]
```

#### Obtener usuario por ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Crear usuario
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePass123",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["empleado"]
}
```

#### Actualizar usuario
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "isActive": true,
  "roles": ["empleado", "gestor_humana"]
}
```

#### Cambiar contraseña
```http
POST /api/users/{id}/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldPass123",
  "newPassword": "newSecurePass456"
}
```

#### Eliminar usuario
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

### 👷 Gestión de Empleados

#### Listar empleados
```http
GET /api/empleados?activo=true
Authorization: Bearer {token}
```

**Parámetros de consulta:**
- `activo` (boolean, opcional): Filtrar por estado activo

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombreCompleto": "Juan Pérez",
    "documentoIdentidad": "123456789",
    "correoElectronico": "juan@example.com",
    "telefono": "+57 300 123 4567",
    "cargo": "Analista",
    "estado": true,
    "fechaIngreso": "2023-01-15T00:00:00Z",
    "cantidadIncapacidades": 2,
    "createdAt": "2023-01-15T00:00:00Z",
    "updatedAt": "2024-01-10T14:30:00Z"
  }
]
```

#### Obtener empleado por ID
```http
GET /api/empleados/{id}
Authorization: Bearer {token}
```

#### Obtener empleado por identificación
```http
GET /api/empleados/identificacion/{numeroIdentificacion}
Authorization: Bearer {token}
```

#### Crear empleado
```http
POST /api/empleados
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombreCompleto": "María González",
  "documentoIdentidad": "987654321",
  "correoElectronico": "maria@example.com",
  "telefono": "+57 301 987 6543",
  "cargo": "Desarrolladora",
  "fechaIngreso": "2024-01-15T00:00:00Z"
}
```

#### Actualizar empleado
```http
PUT /api/empleados/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombreCompleto": "María González Actualizada",
  "correoElectronico": "maria.nuevo@example.com",
  "telefono": "+57 302 111 2222",
  "cargo": "Senior Desarrolladora",
  "estado": true,
  "usuario": "admin"
}
```

#### Desactivar empleado
```http
PUT /api/empleados/{id}/desactivar
Authorization: Bearer {token}
```

#### Eliminar empleado
```http
DELETE /api/empleados/{id}
Authorization: Bearer {token}
```

### 🏥 Gestión de Incapacidades

#### Listar todas las incapacidades
```http
GET /api/incapacidades?estado=Registrada&desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
```

**Parámetros de consulta:**
- `estado` (EstadoIncapacidad, opcional): Filtrar por estado
- `desde` (DateTime, opcional): Fecha inicio del rango
- `hasta` (DateTime, opcional): Fecha fin del rango

#### Obtener incapacidad por ID
```http
GET /api/incapacidades/{id}
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "empleadoId": 1,
  "empleadoNombre": "Juan Pérez",
  "tipo": "EnfermedadGeneral",
  "fechaInicio": "2024-01-15T00:00:00Z",
  "fechaFin": "2024-01-25T00:00:00Z",
  "estado": "Registrada",
  "eps": "Sura",
  "diagnostico": "Gripe severa",
  "documentos": [
    {
      "id": 1,
      "tipo": "Incapacidad",
      "urlArchivo": "/uploads/incapacidades/550e8400-e29b-41d4-a716-446655440000/certificado.pdf",
      "fechaCarga": "2024-01-15T10:00:00Z",
      "nombreOriginal": "certificado_incapacidad.pdf"
    }
  ]
}
```

#### Listar incapacidades por empleado
```http
GET /api/incapacidades/empleado/{empleadoId}?desde=2024-01-01&hasta=2024-12-31
Authorization: Bearer {token}
```

**Parámetros de consulta:**
- `desde` (DateTime, opcional): Fecha inicio del rango
- `hasta` (DateTime, opcional): Fecha fin del rango

#### Registrar incapacidad
```http
POST /api/incapacidades/registrar
Authorization: Bearer {token}
Content-Type: multipart/form-data

# Form data:
empleadoId: 1
empleadoNombre: Juan Pérez
tipo: EnfermedadGeneral
fechaInicio: 2024-01-15
dias: 10
diagnostico: Gripe severa
eps: Sura
# documentos: [archivos adjuntos]
```

#### Actualizar estado de incapacidad
```http
PUT /api/incapacidades/{id}/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "Transcrita",
  "usuario": "admin"
}
```

#### Actualizar incapacidad completa
```http
PUT /api/incapacidades/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "AccidenteLaboral",
  "fechaInicio": "2024-01-15T00:00:00Z",
  "fechaFin": "2024-01-25T00:00:00Z",
  "diagnostico": "Fractura de brazo",
  "eps": "Nueva EPS",
  "usuario": "admin"
}
```

#### Agregar documentos a incapacidad
```http
POST /api/incapacidades/{id}/documentos
Authorization: Bearer {token}
Content-Type: multipart/form-data

# archivos: [archivos a adjuntar]
```

### 📋 Estructuras de Datos Comunes

#### Estados de Incapacidad
- `Registrada`: Inicialmente registrada
- `EnRevision`: En proceso de revisión
- `Transcrita`: Enviada a EPS
- `Aprobada`: Aprobada por EPS
- `Rechazada`: Rechazada por EPS
- `Pagada`: Pagada por EPS
- `Cancelada`: Cancelada

#### Tipos de Incapacidad
- `EnfermedadGeneral`
- `AccidenteLaboral`
- `LicenciaMaternidad`
- `LicenciaPaternidad`
- `EnfermedadProfesional`

#### Políticas de Autorización
- `GestionHumana`: Acceso a gestión de empleados e incapacidades
- `Empleado`: Acceso básico de consulta

### ⚠️ Manejo de Errores

Todas las respuestas de error siguen el formato:
```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
```

**Códigos HTTP comunes:**
- `200`: Éxito
- `201`: Creado
- `204`: Sin contenido (operaciones exitosas sin respuesta)
- `400`: Solicitud inválida
- `401`: No autorizado
- `403`: Prohibido (sin permisos)
- `404`: No encontrado
- `500`: Error interno del servidor

### 🔧 Configuración del Frontend

Para consumir la API desde el frontend:

1. **Base URL**: `https://localhost:5001` (desarrollo) o la URL de producción
2. **Autenticación**: Incluir header `Authorization: Bearer {token}` en todas las requests
3. **Content-Type**: `application/json` para datos, `multipart/form-data` para archivos
4. **Manejo de tokens**: Almacenar JWT en localStorage/sessionStorage y renovar antes de expirar
5. **Manejo de errores**: Verificar `success` en respuesta y mostrar mensajes apropiados

## Arquitectura y buenas prácticas aplicadas

- **Clean Architecture / Onion:** capas desacopladas con dependencias hacia el núcleo de dominio.
- **Domain-Driven Design:** entidades ricas (`Incapacidad`, `Documento`, `PagoEPS`) con invariantes básicas.
- **Persistence con EF Core:** `IncapacidadesDbContext` y configuraciones Fluent API para MariaDB.
- **Servicios de aplicación:** `IncapacidadService` encapsula lógica de caso de uso y utiliza repositorios.
- **Infraestructura configurable:** dependencia `IDocumentStorageService` implementada localmente, preparada para ser reemplazada por almacenamiento en la nube.
- **Autenticación JWT y autorización por políticas.**
- **Swagger/OpenAPI** documenta y facilita pruebas manuales.
- **Logging estructurado** y extensible mediante `ILogger`.
- **Configuración en un solo punto:** clases `DependencyInjection` por capa.

## Carpetas adicionales relevantes

- `database/`: scripts de creación, seeds y mantenimiento de la base de datos.
- `docs/`: prácticas recomendadas y diagramas de referencia.
- `../my-react-app/`: cliente web (Create React App) preparado para consumir la API.

## Próximos pasos sugeridos

- Implementar servicios reales de integración EPS/ARL y colas para procesos asíncronos.
- Crear migraciones automatizadas y pipeline CI/CD.
- Añadir pruebas unitarias y de integración (xUnit + Respawn).
- Integrar observabilidad (Serilog, OpenTelemetry) y validaciones adicionales de dominio.

## Docker (levantar API + MariaDB)

Se ha añadido soporte para levantar la API y una instancia de MariaDB mediante `docker compose` dentro de la carpeta `backend/`.

1. Copia el ejemplo de variables de entorno y ajústalas:

```pwsh
cp .env.example .env
# editar .env con tu editor preferido
```

2. Levanta los servicios:

```pwsh
cd backend
docker compose up --build
```

3. Accede al Swagger en `http://localhost:5192/swagger/index.html` (o el puerto que hayas definido en `API_PORT_HOST` en el `.env`).

Notas:

- El `docker-compose.yml` en `backend/` usa las variables del archivo `.env` para configurar credenciales y puertos.
- La base de datos por defecto está configurada con el nombre `gestion_incapacidades` (variable `DB_NAME`).
- Al iniciar la API, se aplican migraciones automáticamente y se ejecuta un _seed_ que crea un usuario admin si no existe.
- Credenciales por defecto de seed (puedes modificarlas en `.env`):
  - `SEED_ADMIN_USERNAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.

Si quieres, puedo añadir un endpoint de autenticación para obtener un JWT y probar los endpoints protegidos desde Swagger.

## Comandos útiles

```bash
# Ejecutar pruebas (cuando existan)
dotnet test

# Formatear código
dotnet format

# Actualizar paquetes NuGet
dotnet list package --outdated
```

---

> **Nota:** Ajuste credenciales y rutas de almacenamiento antes de desplegar en entornos productivos. Mantenga las claves JWT y la cadena de conexión fuera de control de versiones utilizando variables de entorno o gestores de secretos.
