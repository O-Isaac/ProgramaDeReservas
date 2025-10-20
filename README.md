# Programa de Reservas

Sistema de gestión de reservas desarrollado con Spring Boot que permite administrar reservas de aulas y horarios.

## 📋 Descripción

Este proyecto es una aplicación RESTful API construida con Spring Boot que proporciona funcionalidades para gestionar:
- **Reservas**: Crear, consultar, actualizar y eliminar reservas
- **Aulas**: Gestión de espacios disponibles para reservar
- **Horarios**: Administración de horarios asociados a las reservas

## 🚀 Tecnologías Utilizadas

- **Java 25**
- **Spring Boot 3.5.6**
- **Spring Data JPA** - Para la persistencia de datos
- **MySQL** - Base de datos relacional
- **Lombok** - Para reducir código boilerplate
- **Maven** - Gestión de dependencias y construcción del proyecto

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- Java Development Kit (JDK) 25 o superior
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

## 📚 API Endpoints

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reservas` | Obtener todas las reservas |
| GET | `/reservas/{id}` | Obtener una reserva por ID |
| POST | `/reservas` | Crear una nueva reserva |
| PUT | `/reservas/{id}` | Actualizar una reserva existente |
| DELETE | `/reservas/{id}` | Eliminar una reserva |

### Horarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/horarios` | Obtener todos los horarios |
| GET | `/horarios?reservaId={id}` | Obtener horarios por reserva |
| GET | `/horarios/{id}` | Obtener un horario por ID |
| POST | `/horarios` | Crear un nuevo horario |
| PUT | `/horarios/{id}` | Actualizar un horario existente |
| DELETE | `/horarios/{id}` | Eliminar un horario |

### Aulas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/aulas` | Obtener todas las aulas |
| GET | `/aulas/{id}` | Obtener un aula por ID |
| POST | `/aulas` | Crear una nueva aula |
| PUT | `/aulas/{id}` | Actualizar un aula existente |
| DELETE | `/aulas/{id}` | Eliminar un aula |

## 📁 Estructura del Proyecto

```
src/
├── main/
│   ├── java/
│   │   └── io/github/isaac/reservas/
│   │       ├── ReservasApplication.java      # Clase principal
│   │       ├── beans/                         # Beans auxiliares
│   │       ├── controllers/                   # Controladores REST
│   │       │   ├── ControllerReserva.java
│   │       │   ├── ControllerAula.java
│   │       │   └── ControllerHorario.java
│   │       ├── entities/                      # Entidades JPA
│   │       │   ├── Reserva.java
│   │       │   ├── Aula.java
│   │       │   └── Horario.java
│   │       ├── enums/                         # Enumeraciones
│   │       │   └── DiaSemana.java
│   │       ├── repositories/                  # Repositorios JPA
│   │       │   ├── RepositoryReserva.java
│   │       │   ├── RepositoryAula.java
│   │       │   └── RepositoryHorario.java
│   │       ├── services/                      # Servicios de negocio
│   │       │   ├── ServiceReserva.java
│   │       │   ├── ServiceAula.java
│   │       │   └── ServiceHorario.java
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
- La aplicación está configurada para usar **Java 25**, verifica tu versión de Java con `java -version`
- Por defecto, la aplicación se ejecuta en el puerto **8080**

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
