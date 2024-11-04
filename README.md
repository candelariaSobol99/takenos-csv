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

## Despliegue
La aplicación está desplegada en Heroku y se puede acceder a ella en el siguiente enlace:

- **URL de la API:** [https://takenos-sobol-ad772e7df5e7.herokuapp.com](https://takenos-sobol-ad772e7df5e7.herokuapp.com)

## Documentación
La documentación completa de la API está disponible en la colección de Postman, que se encuentra en el directorio del proyecto. Puedes importar la colección en Postman para probar los endpoints fácilmente.

- **Colección de Postman:** [Enlace a la colección de Postman](URL_DE_TU_COLECCIÓN)

## Autenticación
La API utiliza autenticación mediante JWT. Puedes utilizar las siguientes credenciales de prueba para iniciar sesión:

- **Email:** `test@example.com`
- **Contraseña:** `test1234`

### Endpoint de Login
- **Método:** `POST`
- **Endpoint:** `https://takenos-sobol-ad772e7df5e7.herokuapp.com/auth/login`
- **Cuerpo de la Solicitud:**
  ```json
  {
    "email": "felipe@takenos.com",
    "password": "test1234"
  }
  ```
  **Respuesta:**
  ```json
  {
    "message": "Login exitoso",
    "user": {
        "id": 1,
        "email": "felipe@takenos.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhbmRlbGFyaWFzb2JvbEBnbWFpbC5jb20iLCJpYXQiOjE3MzA2OTE0MDksImV4cCI6MTczMDY5ODYwOX0.HBulMJYgBkLsLsBXOKAvUUD_PRQNihWGW-vltbTcCuA"
  }
  ```

  ### Endpoint de Login
- **Método:** `POST`
- **Endpoint:** `https://takenos-sobol-ad772e7df5e7.herokuapp.com/auth/login`
- **Cuerpo de la Solicitud:**
  ```json
  {
    "email": "felipe@takenos.com",
    "password": "test1234"
  }
  ```
  **Respuesta:**
  ```json
  {
    "message": "Login exitoso",
    "user": {
        "id": 1,
        "email": "felipe@takenos.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhbmRlbGFyaWFzb2JvbEBnbWFpbC5jb20iLCJpYXQiOjE3MzA2OTE0MDksImV4cCI6MTczMDY5ODYwOX0.HBulMJYgBkLsLsBXOKAvUUD_PRQNihWGW-vltbTcCuA"
  }
  ```

  ### Endpoint de Carga de Archivos
- **Método:** `POST`
- **Endpoint:** `https://takenos-sobol-ad772e7df5e7.herokuapp.com/transactions/upload`
- **Descripción:** Este endpoint permite a los usuarios cargar archivos CSV que contienen transacciones para su procesamiento asíncrono.
- **Autenticación:** Este endpoint requiere autenticación mediante JWT.

#### Parámetros
- **Archivo:** Se debe enviar un archivo CSV en el cuerpo de la solicitud.
- **Usuario:** El endpoint extrae el correo electrónico del usuario autenticado a partir del token JWT.

#### Respuesta
- **Código de Estado:** `202 Accepted`
- **Cuerpo de la Respuesta:**
  ```json
  {
    "message": "File received and processing started"
  }

### Endpoints de Análisis de Datos

#### 1. Obtener Volumen Total de Transacciones
- **Método:** `GET`
- **Endpoint:** `https://takenos-sobol-ad772e7df5e7.herokuapp.com/analysis/volume/:timeFrame`
- **Descripción:** Este endpoint devuelve el volumen total de transacciones para un período de tiempo específico.
- **Autenticación:** Este endpoint requiere autenticación mediante JWT.
- **Parámetros:**
  - `timeFrame`: Especifica el período de tiempo para el cual se desea obtener el volumen. Puede ser `'day'`, `'week'` o `'month'`.

  #### Respuesta
- **Código de Estado:** `200 OK`
- **Cuerpo de la Respuesta:**
  ```json
  {
    "timeFrame": "day",
    "totalVolume": 0,
    "dateFrom": "2024-11-03T02:46:37.410Z",
    "dateTo": "2024-11-04T02:46:37.410Z"
  }

#### 2. Obtener los 10 Principales Comerciantes
- **Método:** `GET`
- **Endpoint:** `https://takenos-sobol-ad772e7df5e7.herokuapp.com/analysis/top-merchants`
- **Descripción:** Este endpoint devuelve los 10 comerciantes con mayor volumen de transacciones.
- **Autenticación:** Este endpoint requiere autenticación mediante JWT.

  #### Respuesta
- **Código de Estado:** `200 OK`
- **Cuerpo de la Respuesta:**
  ```json
  {
    [
    {
        "merchant": "Tiffany & Co.",
        "totalVolume": "5000.00"
    },
    {
        "merchant": "Apple Store",
        "totalVolume": "3450.00"
    },
    {
        "merchant": "Best Buy",
        "totalVolume": "1800.00"
    },
    {
        "merchant": "Walmart",
        "totalVolume": "250.00"
    },
    {
        "merchant": "Starbucks",
        "totalVolume": "225.00"
    },
    {
        "merchant": "Amazon",
        "totalVolume": "150.00"
    },
    {
        "merchant": "Netflix",
        "totalVolume": "50.00"
    },
    {
        "merchant": "Uber",
        "totalVolume": "50.00"
    }
  ]
  }

#### 3. Obtener Volumen Total de Transacciones
- **Método:** `GET`
- **Endpoint:** `https://takenos-sobol-ad772e7df5e7.herokuapp.com/analysis/fraudulent-transactions`
- **Descripción:**  Este endpoint detecta transacciones que pueden ser fraudulentas basadas en reglas definidas.
- **Autenticación:** Este endpoint requiere autenticación mediante JWT.

  #### Respuesta
- **Código de Estado:** `200 OK`
- **Cuerpo de la Respuesta:**
  ```json
  {
    "highAmountTransactions": [
        {
            "id": 24,
            "transaction_id": 5002,
            "date": "2024-09-14T00:00:00.000Z",
            "amount": "1500.00",
            "merchant": "Best Buy",
            "user_id": "user456"
        },
        {
            "id": 29,
            "transaction_id": 5007,
            "date": "2024-09-15T00:00:00.000Z",
            "amount": "3000.00",
            "merchant": "Apple Store",
            "user_id": "user456"
        },
        {
            "id": 31,
            "transaction_id": 5009,
            "date": "2024-09-16T00:00:00.000Z",
            "amount": "5000.00",
            "merchant": "Tiffany & Co.",
            "user_id": "user123"
        }
    ],
    "rapidTransactions": [
        {
            "t1_id": 25,
            "t1_merchant": "Starbucks",
            "t1_user_id": "user789"
        },
        {
            "t1_id": 26,
            "t1_merchant": "Starbucks",
            "t1_user_id": "user789"
        }
    ]
  }
