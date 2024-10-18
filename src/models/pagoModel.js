const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Definición del modelo Pago.
 */
const Pago = sequelize.define(
  "Pago",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Autoincrementable
      primaryKey: true, // Clave primaria
    },
    fechaCarga: {
      type: DataTypes.DATEONLY, // Solo fecha
      allowNull: false, // Campo obligatorio
    },
    fechaPago: {
      type: DataTypes.DATEONLY, // Solo fecha
      allowNull: false, // Campo obligatorio
    },
    descripcion: {
      type: DataTypes.STRING(100), // Cadena de hasta 100 caracteres
      allowNull: true, // Campo opcional
    },
    registradoPor: {
      type: DataTypes.INTEGER, // ID del usuario que registra el pago
      allowNull: false, // Campo obligatorio
    },
    formaPagoId: {
      type: DataTypes.INTEGER, // ID de la forma de pago
      allowNull: false, // Campo obligatorio
    },
    usuarioId: {
      type: DataTypes.INTEGER, // ID del usuario al que pertenece el pago
      allowNull: false, // Campo obligatorio
    },
    recibo: {
      type: DataTypes.STRING(255), // Ruta del recibo
      allowNull: true, // Campo opcional
    },
    monto: {
      type: DataTypes.FLOAT, // Monto del pago
      allowNull: false, // Campo obligatorio
    },
    activo: {
      type: DataTypes.BOOLEAN, // Estado activo/inactivo
      allowNull: false, // Campo obligatorio
      defaultValue: true, // Valor por defecto
    },
  },
  {
    tableName: "pago", // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva timestamps
  }
);

/**
 * Asociaciones del modelo Pago.
 * @param {object} models - Modelos de la aplicación.
 */
Pago.associate = (models) => {
  Pago.belongsTo(models.Usuario, { foreignKey: "registradoPor" }); // Asociación con el usuario que registra el pago
  Pago.belongsTo(models.FormaPago, { foreignKey: "formaPagoId" }); // Asociación con la forma de pago
  Pago.belongsTo(models.Usuario, { foreignKey: "usuarioId" }); // Asociación con el usuario al que pertenece el pago
};

module.exports = Pago;
