# Sistema de Gestión de Usuarios y Pagos - Backend ITS

Esta aplicación, desarrollada con Node.js, facilita la gestión de usuarios y pagos. Permite la creación de administradores a partir de un superadministrador, quienes a su vez pueden gestionar usuarios, subir archivos y registrar pagos. Los usuarios estándar tienen acceso a sus pagos y pueden descargar recibos en formato PDF.

## Características Principales

- Gestión de usuarios con roles diferenciados (administradores y usuarios comunes).
- Subida y almacenamiento de archivos.
- Registro y actualización de pagos.
- Visualización y descarga de recibos en PDF.
- Capacidad de desactivar pagos en lugar de eliminarlos.

## Endpoints Disponibles

### **Autenticación**

#### **Iniciar Sesión**

**POST** `/auth`

Este endpoint permite a los usuarios autenticarse en el sistema y obtener un token de acceso.

**Ejemplo de request:**

```json
{
    "nombre": "ElenaMartinez",
    "password": "896729"
}
```

```json
{
    "nombre": "DavidLopez",
    "password": "728910"
}
```

### **Gestión de Usuarios**

#### **Crear Usuario**

**POST** `/usuario`

Permite a los administradores crear nuevos usuarios.

**Ejemplo de request:**

```json
{
    "nombre": "DavidLopez",
    "correo": "davidlopez@gmail.com",
    "password": "728910",
    "rolId": 1
}
```

#### **Actualizar Usuario**

**PUT** `/usuario/:id`

Permite actualizar la información de un usuario existente.

**Ejemplo de request:**

```json
{
    "nombre": "DavidLopez",
    "correo": "davidlopez@gmail.com",
    "password": "728910",
    "rolId": 1
}
```

### **Gestión de Pagos**

#### **Ver Pagos (Usuarios Comunes)**

**GET** `/usuario/pagos`

Obtiene la lista de pagos asociados al usuario autenticado.

#### **Descargar Recibo**

**GET** `/usuario/:id/recibo`

Permite a un usuario descargar su recibo en formato PDF.

### **Gestión de Pagos (Administradores)**

#### **Listar Todos los Pagos**

**GET** `/pago`

Obtiene un listado completo de los pagos registrados en el sistema.

#### **Ver Detalles de un Pago**

**GET** `/pago/:id`

Muestra la información de un pago específico.

#### **Registrar un Nuevo Pago**

**POST** `/pago`

Permite crear un nuevo registro de pago.

**Ejemplo de request:**

```json
{
    "fechaCarga": "2024-09-10",
    "fechaPago": "2024-09-10",
    "descripcion": "Pago Elena",
    "registradoPor": 2,
    "formaPagoId": 1,
    "usuarioId": 3,
    "recibo": "2ba35e57-7ed1-44bb-88e5-66c23c81cd37.pdf",
    "monto": 5000,
    "activo": true
}
```

#### **Modificar un Pago**

**PUT** `/pago/:id`

Actualiza los detalles de un pago existente.

**Ejemplo de request:**

```json
{
    "fechaCarga": "2024-09-11",
    "fechaPago": "2024-09-11",
    "descripcion": "Pago Elena 2",
    "registradoPor": 2,
    "formaPagoId": 2,
    "usuarioId": 3,
    "monto": 25000
}
```

#### **Desactivar un Pago**

**DELETE** `/pago/:id`

Este endpoint marca un pago como inactivo en lugar de eliminarlo.

---

### Funcionalidades Adicionales

#### **Paginación y Ordenamiento de Pagos**

**GET** `/pago`

Este endpoint permite listar pagos con opciones de paginación y ordenamiento. Ejemplo:

```url
/pago?page=1&limit=10&order=desc&sortBy=fechaCarga
```

**Parámetros opcionales:**

- `page`: número de página.
- `limit`: cantidad de resultados por página.
- `order`: orden ascendente (`asc`) o descendente (`desc`).
- `sortBy`: campo por el cual ordenar.

### Notas:

- Los pagos desactivados permanecen en la base de datos, solo se marcan como inactivos.
- La autenticación utiliza tokens JWT, que deben incluirse en las peticiones protegidas.

