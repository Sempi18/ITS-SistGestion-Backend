const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Definición del modelo Usuario.
 */
const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Autoincrementable
      primaryKey: true, // Clave primaria
    },
    nombre: {
      type: DataTypes.STRING(100), // Cadena de hasta 100 caracteres
      allowNull: false, // Campo obligatorio
    },
    correo: {
      type: DataTypes.STRING(100), // Cadena de hasta 100 caracteres
      allowNull: true, // Campo opcional
    },
    password: {
      type: DataTypes.STRING(100), // Cadena de hasta 100 caracteres para la contraseña
      allowNull: true, // Campo opcional
    },
    rolId: {
      type: DataTypes.INTEGER, // ID del rol del usuario
      allowNull: false, // Campo obligatorio
    },
  },
  {
    tableName: "usuario", // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva timestamps
  }
);

module.exports = Usuario; // Exporta el modelo Usuario
