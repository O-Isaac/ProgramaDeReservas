# Obtener la imagen
FROM maven:3.9.9-eclipse-temurin-21-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que la aplicación se ejecutará
# 8086 -> 10000
EXPOSE 8086

# Comando para ejecutar la aplicación
CMD ["mvn", "spring-boot:run"]