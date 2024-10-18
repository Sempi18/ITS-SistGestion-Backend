const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Login = sequelize.define(
  "Login",
  {
    usuarioId: {
      type: DataTypes.INTEGER,
      references: { model: "Usuario", key: "id" },
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "login",
    timestamps: false,
  }
);

Login.associate = (models) => {
  Login.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
};

module.exports = Login;
