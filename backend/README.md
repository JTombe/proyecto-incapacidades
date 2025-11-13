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

La API escuchará por defecto en `https://localhost:5001` y expone documentación Swagger en `/swagger`.

## Endpoints principales

- `POST /api/incapacidades/registrar` – Registrar una incapacidad con soportes.
- `GET /api/incapacidades/{id}` – Consultar detalle por identificador.
- `PUT /api/incapacidades/{id}/estado` – Actualizar el estado del caso.
- `GET /api/incapacidades/empleado/{empleadoId}` – Listado por colaborador con filtros.
- `POST /api/incapacidades/{id}/documentos` – Cargar documentos adicionales.

Todas las respuestas están estandarizadas con `ApiResponse<T>` y protegidas mediante políticas JWT (`GestionHumana`, `Empleado`).

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
- `frontend/`: cliente web (Vite + React) preparado para consumir la API.

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
