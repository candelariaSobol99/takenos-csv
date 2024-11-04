<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Takenos API

## Descripción
Takenos API es una aplicación diseñada para gestionar transacciones y análisis de datos financieros. Permite la carga de archivos CSV, el análisis de transacciones, y la gestión de usuarios con autenticación mediante JWT.

## Requisitos Previos
Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

1. Clonar proyecto
2. ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```

6. Levantar: ```npm run start:dev```