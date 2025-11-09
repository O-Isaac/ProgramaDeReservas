# Programa de Reservas
[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/O-Isaac/ProgramaDeReservas)

![Java](https://img.shields.io/badge/Java-24-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.6-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MapStruct](https://img.shields.io/badge/MapStruct-1.6.3-DC382D?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.0.0-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Shadcn/UI](https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)


Sistema de gestión de reservas desarrollado con Spring Boot que permite administrar reservas de aulas y horarios con autenticación basada en JWT.

## 📋 Descripción

Este proyecto es una aplicación RESTful API construida con Spring Boot que proporciona funcionalidades para gestionar:
- **Autenticación y Autorización**: Sistema completo de registro, login y gestión de usuarios con JWT
- **Reservas**: Crear, consultar, actualizar y eliminar reservas
- **Aulas**: Gestión de espacios disponibles para reservar
- **Horarios**: Administración de horarios asociados a las reservas
- **Usuarios**: Administración de usuarios del sistema

## 🚀 Tecnologías Utilizadas

- **Java 24**
- **Spring Boot 3.5.6**
- **Spring Security** - Autenticación y autorización
- **Spring OAuth2 Resource Server** - Validación de JWT
- **Spring Data JPA** - Para la persistencia de datos
- **MySQL** - Base de datos relacional
- **Lombok** - Para reducir código boilerplate
- **MapStruct** - Mapeo entre entidades y DTOs
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **SpringDoc OpenAPI** - Generación automática de documentación API
- **Scalar UI** - Interfaz interactiva para documentación API
- **Maven** - Gestión de dependencias y construcción del proyecto

## 🔐 Sistema de Roles

La aplicación implementa un sistema de roles basado en JWT para controlar el acceso a los endpoints:

- **ROLE_ADMIN**: Acceso completo a todas las funcionalidades del sistema
- **ROLE_PROFESOR**: Acceso a funcionalidades de gestión de reservas

> **Nota**: El acceso a la mayoría de endpoints requiere autenticación mediante token JWT, excepto los endpoints de `/auth/**`

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- Java Development Kit (JDK) 24 o superior
- Maven 3.6 o superior
- MySQL 8.0 o superior
- Un IDE de tu preferencia (IntelliJ IDEA, Eclipse, VS Code, etc.)

## ⚙️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/O-Isaac/ProgramaDeReservas.git
   cd ProgramaDeReservas
   ```

2. **Configurar la base de datos MySQL**
   
   Crea una base de datos en MySQL:
   ```sql
   CREATE DATABASE reservas_db;
   ```

3. **Configurar la conexión a la base de datos**
   
   Edita el archivo `src/main/resources/application.properties` y agrega la configuración de tu base de datos:
   ```properties
   spring.application.name=reservas
   
   # Configuración de la base de datos
   spring.datasource.url=jdbc:mysql://localhost:3306/reservas_db
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
   
   # Configuración de JPA/Hibernate
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   ```

4. **Compilar el proyecto**
   ```bash
   ./mvnw clean install
   ```

## 🏃 Ejecutar la Aplicación

### Usando Maven

```bash
./mvnw spring-boot:run
```

### Usando el JAR compilado

```bash
java -jar target/reservas-0.0.1-SNAPSHOT.jar
```

La aplicación se iniciará en `http://localhost:8080`

## 📖 Documentación Interactiva de la API

La aplicación incluye documentación interactiva de la API usando **OpenAPI 3.0** con **Scalar UI**. Una vez que la aplicación esté ejecutándose, puedes acceder a:

- **Documentación Interactiva (Scalar UI)**: `http://localhost:8080/docs`
- **Especificación OpenAPI (JSON)**: `http://localhost:8080/v3/api-docs`

La interfaz de Scalar te permite:
- Explorar todos los endpoints disponibles
- Ver esquemas de DTOs y modelos de datos
- Probar las peticiones directamente desde el navegador
- Ver ejemplos de request/response
- Autenticarte con JWT directamente en la interfaz

## 📚 API Endpoints

### 🔓 Autenticación (`/auth`)

Endpoints públicos para registro, login y gestión de perfil.

| Método | Endpoint | Descripción | Rol Requerido | DTO Request | DTO Response |
|--------|----------|-------------|---------------|-------------|--------------|
| POST | `/auth/login` | Iniciar sesión en el sistema | Público | `LoginRequest` | `{ token: string }` |
| POST | `/auth/register` | Registrar un nuevo usuario | Público | `RegisterRequest` | `{ message: string }` |
| GET | `/auth/perfil` | Obtener información del usuario autenticado | Autenticado | - | `{ email: string, roles: array }` |
| PATCH | `/auth/cambiar-pass` | Cambiar contraseña del usuario autenticado | Autenticado | `ChangePasswordRequest` | `{ message: string }` |

### 📅 Reservas (`/reservas`)

Gestión de reservas de aulas.

| Método | Endpoint | Descripción | Rol Requerido | DTO Request | DTO Response |
|--------|----------|-------------|---------------|-------------|--------------|
| GET | `/reservas` | Obtener todas las reservas | Autenticado | - | `List<ReservaResponse>` |
| GET | `/reservas/{id}` | Obtener una reserva por ID | Autenticado | - | `ReservaResponse` |
| POST | `/reservas` | Crear una nueva reserva | Autenticado | `ReservaPostRequest` | `ReservaResponse` |
| PUT | `/reservas/{id}` | Actualizar una reserva existente | Autenticado | `ReservaUpdateRequest` | `ReservaResponse` |
| DELETE | `/reservas/{id}` | Eliminar una reserva | Autenticado | - | 303 See Other |

### 🏫 Aulas (`/aulas`)

Gestión de aulas y espacios disponibles.

| Método | Endpoint | Descripción | Rol Requerido | DTO Request | DTO Response |
|--------|----------|-------------|---------------|-------------|--------------|
| GET | `/aulas` | Obtener todas las aulas | Autenticado | Query params opcionales: `capacidad`, `ordenadores` | `List<AulaResponse>` |
| GET | `/aulas/{id}` | Obtener un aula por ID | Autenticado | - | `AulaResponse` |
| POST | `/aulas` | Crear una nueva aula | Autenticado | `AulaPostRequest` | `AulaResponse` |
| PUT | `/aulas/{id}` | Actualizar un aula existente | Autenticado | `AulaUpdateRequest` | `AulaResponse` |
| DELETE | `/aulas/{id}` | Eliminar un aula | Autenticado | - | 303 See Other |

### ⏰ Horarios (`/horarios`)

Administración de franjas horarias.

| Método | Endpoint | Descripción | Rol Requerido | DTO Request | DTO Response |
|--------|----------|-------------|---------------|-------------|--------------|
| GET | `/horarios` | Obtener todos los horarios | Autenticado | - | `List<HorarioResponse>` |
| GET | `/horarios/{id}` | Obtener un horario por ID | Autenticado | - | `HorarioResponse` |
| POST | `/horarios` | Crear un nuevo horario | Autenticado | `HorarioPostRequest` | `HorarioResponse` |
| PUT | `/horarios/{id}` | Actualizar un horario existente | Autenticado | `HorarioUpdateRequest` | `HorarioResponse` |
| DELETE | `/horarios/{id}` | Eliminar un horario | Autenticado | - | 303 See Other |

### 👥 Usuarios (`/usuarios`)

Gestión de usuarios del sistema.

| Método | Endpoint | Descripción | Rol Requerido | DTO Request | DTO Response |
|--------|----------|-------------|---------------|-------------|--------------|
| GET | `/usuarios` | Obtener todos los usuarios | Autenticado | - | `List<UsuarioResponse>` |
| GET | `/usuarios/{id}` | Obtener un usuario por ID | Autenticado | - | `UsuarioResponse` |
| POST | `/usuarios` | Crear un nuevo usuario | Autenticado | `UsuarioPostRequest` | `UsuarioResponse` |
| PUT | `/usuarios/{id}` | Actualizar un usuario existente | Autenticado | `UsuarioUpdateRequest` | `UsuarioResponse` |
| DELETE | `/usuarios/{id}` | Eliminar un usuario | Autenticado | - | 303 See Other |

## 📝 DTOs (Data Transfer Objects)

### Autenticación

#### `LoginRequest`
```json
{
  "email": "string (email válido, requerido)",
  "password": "string (requerido)"
}
```

#### `RegisterRequest`
```json
{
  "email": "string (email válido, requerido)",
  "password": "string (mínimo 6 caracteres, requerido)",
  "nombre": "string (requerido)"
}
```

#### `ChangePasswordRequest`
```json
{
  "password": "string (mínimo 6 caracteres, requerido)"
}
```

### Reservas

#### `ReservaPostRequest`
```json
{
  "fecha": "string (formato: dd/MM/yyyy, requerido)",
  "aulaId": "number (positivo, requerido)",
  "horarioId": "number (positivo, requerido)",
  "usuarioId": "number (positivo, requerido)",
  "motivo": "string (no vacío, requerido)",
  "asistentes": "number (positivo, requerido)"
}
```

#### `ReservaResponse`
```json
{
  "id": "number",
  "fecha": "string (formato: dd/MM/yyyy)",
  "motivo": "string",
  "asistentes": "number",
  "aula": {
    "id": "number",
    "nombre": "string",
    "capacidad": "number",
    "ordenadores": "boolean"
  },
  "horario": {
    "id": "number",
    "inicio": "time",
    "fin": "time",
    "tipo": "TipoHorario (RECREO, LECTIVA, MEDIODIA)"
  },
  "usuario": {
    "id": "number",
    "nombre": "string"
  }
}
```

#### `ReservaUpdateRequest`
```json
{
  "fecha": "string (formato: dd/MM/yyyy, opcional)",
  "aulaId": "number (positivo, opcional)",
  "horarioId": "number (positivo, opcional)",
  "motivo": "string (opcional)",
  "asistentes": "number (positivo, opcional)"
}
```

### Aulas

#### `AulaResponse`
```json
{
  "id": "number",
  "nombre": "string",
  "ordenadores": "boolean",
  "capacidad": "number",
  "reservas": [
    {
      "fecha": "string (formato: dd/MM/yyyy)",
      "motivo": "string",
      "asistentes": "number"
    }
  ]
}
```

#### `AulaPostRequest`
```json
{
  "nombre": "string (requerido)",
  "ordenadores": "boolean (requerido)",
  "capacidad": "number (requerido)"
}
```

#### `AulaUpdateRequest`
```json
{
  "nombre": "string (opcional)",
  "ordenadores": "boolean (opcional)",
  "capacidad": "number (opcional)"
}
```

### Horarios

#### `HorarioResponse`
```json
{
  "id": "number",
  "dia": "DiaSemana (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO)",
  "tipo": "TipoHorario (RECREO, LECTIVA, MEDIODIA)",
  "inicio": "time",
  "fin": "time",
  "session": "number (número de sesión)",
  "reservas": [
    {
      "fecha": "string (formato: dd/MM/yyyy)",
      "motivo": "string",
      "asistentes": "number"
    }
  ]
}
```

#### `HorarioPostRequest`
```json
{
  "dia": "DiaSemana (requerido)",
  "tipo": "TipoHorario (requerido)",
  "inicio": "time (requerido)",
  "fin": "time (requerido)",
  "session": "number (opcional)"
}
```

#### `HorarioUpdateRequest`
```json
{
  "dia": "DiaSemana (opcional)",
  "tipo": "TipoHorario (opcional)",
  "inicio": "time (opcional)",
  "fin": "time (opcional)",
  "session": "number (opcional)"
}
```

### Usuarios

#### `UsuarioResponse`
```json
{
  "id": "number",
  "nombre": "string",
  "email": "string",
  "enabled": "boolean",
  "roles": "string",
  "reservas": [
    {
      "fecha": "string (formato: dd/MM/yyyy)",
      "motivo": "string",
      "asistentes": "number"
    }
  ]
}
```

#### `UsuarioPostRequest`
```json
{
  "nombre": "string (requerido)",
  "email": "string (email válido, requerido)",
  "password": "string (requerido)",
  "roles": "string (opcional)",
  "enabled": "boolean (opcional)"
}
```

#### `UsuarioUpdateRequest`
```json
{
  "roles": "string (opcional)"
}
```

## 🔑 Autenticación y Autorización

La aplicación utiliza **JWT (JSON Web Tokens)** para la autenticación stateless.

### Proceso de Autenticación

1. **Registro**: El usuario se registra mediante `POST /auth/register` con email, contraseña y nombre
2. **Login**: El usuario inicia sesión con `POST /auth/login` y recibe un token JWT
3. **Uso del Token**: Para acceder a endpoints protegidos, incluir el token en el header:
   ```
   Authorization: Bearer <tu_token_jwt>
   ```

### Configuración de Seguridad

- Los endpoints bajo `/auth/**` son públicos (no requieren autenticación)
- Todos los demás endpoints requieren autenticación válida mediante JWT
- Los tokens JWT contienen información del usuario incluyendo roles
- La aplicación valida automáticamente cada token en las peticiones protegidas

### Roles del Sistema

Los usuarios pueden tener los siguientes roles:
- `ROLE_ADMIN`: Administrador con acceso completo
- `ROLE_PROFESOR`: Profesor con permisos de gestión de reservas

> **Nota**: Los roles se almacenan en el campo `roles` de la entidad Usuario y pueden ser múltiples separados por comas.

## 🗄️ Modelo de Datos

### Entidades Principales

#### Usuario
- `id`: Identificador único
- `nombre`: Nombre del usuario
- `email`: Email único (usado como username)
- `password`: Contraseña cifrada con BCrypt
- `roles`: Roles asignados (ROLE_ADMIN, ROLE_PROFESOR)
- `enabled`: Estado activo/inactivo
- **Relaciones**: Un usuario puede tener múltiples reservas

#### Aula
- `id`: Identificador único
- `nombre`: Nombre del aula
- `capacidad`: Número de personas que puede albergar
- `esOrdenadores`: Indica si el aula tiene ordenadores
- **Relaciones**: Un aula puede tener múltiples reservas

#### Horario
- `id`: Identificador único
- `diaSemana`: Día de la semana (enum DiaSemana)
- `tipo`: Tipo de horario (enum TipoHorario)
- `inicio`: Hora de inicio
- `fin`: Hora de finalización
- `session`: Número de sesión (opcional)
- **Relaciones**: Un horario puede estar en múltiples reservas

#### Reserva
- `id`: Identificador único
- `fecha`: Fecha de la reserva
- `motivo`: Motivo de la reserva
- `asistentes`: Número de asistentes
- `createAt`: Fecha de creación automática
- **Relaciones**: Pertenece a un Aula, un Horario y un Usuario

### Enumeraciones

#### DiaSemana
Valores del enum (sin acentos en el código):
- LUNES
- MARTES
- MIERCOLES
- JUEVES
- VIERNES
- SABADO
- DOMINGO

#### TipoHorario
Valores del enum para clasificar los tipos de horarios:
- RECREO - Períodos de descanso
- LECTIVA - Horas de clase
- MEDIODIA - Período del mediodía

## 📁 Estructura del Proyecto

```
src/
├── main/
│   ├── java/
│   │   └── io/github/isaac/reservas/
│   │       ├── ReservasApplication.java      # Clase principal
│   │       ├── config/                        # Configuración
│   │       │   ├── SecurityConfig.java        # Configuración de seguridad JWT
│   │       │   ├── OpenApiConfig.java         # Configuración de OpenAPI/Swagger
│   │       │   └── CorsConfig.java            # Configuración de CORS
│   │       ├── controllers/                   # Controladores REST
│   │       │   ├── ControllerAuth.java        # Autenticación
│   │       │   ├── ControllerReserva.java     # Gestión de reservas
│   │       │   ├── ControllerAula.java        # Gestión de aulas
│   │       │   ├── ControllerHorario.java     # Gestión de horarios
│   │       │   └── ControllerUsuario.java     # Gestión de usuarios
│   │       ├── dtos/                          # Data Transfer Objects
│   │       │   ├── auth/                      # DTOs de autenticación
│   │       │   │   ├── LoginRequest.java
│   │       │   │   ├── RegisterRequest.java
│   │       │   │   └── ChangePasswordRequest.java
│   │       │   ├── reservas/                  # DTOs de reservas
│   │       │   │   ├── ReservaPostRequest.java
│   │       │   │   ├── ReservaResponse.java
│   │       │   │   └── ReservaUpdateRequest.java
│   │       │   ├── aulas/                     # DTOs de aulas
│   │       │   │   ├── AulaResponse.java
│   │       │   │   ├── AulaPostRequest.java
│   │       │   │   └── AulaUpdateRequest.java
│   │       │   ├── horarios/                  # DTOs de horarios
│   │       │   │   ├── HorarioResponse.java
│   │       │   │   ├── HorarioPostRequest.java
│   │       │   │   └── HorarioUpdateRequest.java
│   │       │   └── usuarios/                  # DTOs de usuarios
│   │       │       ├── UsuarioResponse.java
│   │       │       ├── UsuarioPostRequest.java
│   │       │       └── UsuarioUpdateRequest.java
│   │       ├── entities/                      # Entidades JPA
│   │       │   ├── Usuario.java               # Entidad Usuario (implementa UserDetails)
│   │       │   ├── Reserva.java               # Entidad Reserva
│   │       │   ├── Aula.java                  # Entidad Aula
│   │       │   └── Horario.java               # Entidad Horario
│   │       ├── enums/                         # Enumeraciones
│   │       │   ├── DiaSemana.java             # Días de la semana
│   │       │   └── TipoHorario.java           # Tipos de horario
│   │       ├── exceptions/                    # Manejo de excepciones
│   │       │   └── GlobalExceptionHandler.java
│   │       ├── mappers/                       # MapStruct mappers
│   │       │   ├── ReservaMapper.java
│   │       │   ├── AulaMapper.java
│   │       │   ├── HorarioMapper.java
│   │       │   └── UsuarioMapper.java
│   │       ├── repositories/                  # Repositorios JPA
│   │       │   ├── RepositoryUsuario.java
│   │       │   ├── RepositoryReserva.java
│   │       │   ├── RepositoryAula.java
│   │       │   └── RepositoryHorario.java
│   │       ├── services/                      # Servicios de negocio
│   │       │   ├── auth/
│   │       │   │   ├── AuthService.java           # Servicio de autenticación
│   │       │   │   ├── JWTService.java            # Servicio de JWT
│   │       │   │   └── CustomUserDetailsService.java  # UserDetailsService
│   │       │   ├── ReservaService.java
│   │       │   ├── AulaService.java
│   │       │   ├── HorarioService.java
│   │       │   └── UsuarioService.java
│   │       └── utils/                         # Utilidades
│   │           └── ResponseUtil.java
│   └── resources/
│       └── application.properties             # Configuración
└── test/                                      # Tests unitarios
```

## 🧪 Ejecutar Tests

```bash
./mvnw test
```

## 🛠️ Desarrollo

### Compilar sin ejecutar tests

```bash
./mvnw clean install -DskipTests
```

### Ejecutar en modo desarrollo

Spring Boot DevTools está incluido en el proyecto, lo que permite recarga automática de cambios durante el desarrollo.

## 📝 Notas Adicionales

- El proyecto utiliza **Lombok**, asegúrate de tener el plugin de Lombok instalado en tu IDE
- El proyecto utiliza **MapStruct** para el mapeo automático entre entidades y DTOs
- La aplicación está configurada para usar **Java 24**, verifica tu versión de Java con `java -version`
- Por defecto, la aplicación se ejecuta en el puerto **8080**
- Los tokens JWT deben incluirse en el header `Authorization: Bearer <token>` para endpoints protegidos
- Las contraseñas se cifran usando **BCrypt** antes de almacenarse en la base de datos
- La aplicación usa sesiones **stateless** (sin estado del lado del servidor)
- **CORS** está configurado para aceptar peticiones desde `http://localhost:3000` (útil para desarrollo con frontend)
- La documentación interactiva de la API está disponible en `/docs` usando **Scalar UI**
- Los DTOs usan convenciones de nombres: `*PostRequest` para crear, `*UpdateRequest` para actualizar, y `*Response` para respuestas

## 🔍 Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "nombre": "Juan Pérez"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Obtener Perfil

```bash
curl -X GET http://localhost:8080/auth/perfil \
  -H "Authorization: Bearer <tu_token>"
```

### Crear Reserva

```bash
curl -X POST http://localhost:8080/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "fecha": "15/12/2024",
    "aulaId": 1,
    "horarioId": 1,
    "usuarioId": 1,
    "motivo": "Clase de Programación",
    "asistentes": 25
  }'
```

### Listar Aulas con Filtros

```bash
# Buscar aulas con capacidad mínima de 30 y que tengan ordenadores
curl -X GET "http://localhost:8080/aulas?capacidad=30&ordenadores=true" \
  -H "Authorization: Bearer <tu_token>"
```

## 👥 Contribuir

1. Haz un Fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo una licencia de código abierto.

## 👤 Autor

Desarrollado por Isaac

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.
