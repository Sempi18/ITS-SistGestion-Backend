const jwt = require("jsonwebtoken");

/**
 * Generar un token JWT para el usuario dado.
 * @param {object} user - El objeto del usuario.
 * @returns {string} - El token JWT generado.
 */
function generarToken(user) {
  const payload = {
    id: user.id,
    usuario: user.nombre,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
}

/**
 * Middleware para validar el token JWT de la solicitud.
 * @param {object} req - El objeto de la solicitud.
 * @param {object} res - El objeto de la respuesta.
 * @param {function} next - La siguiente función middleware.
 */
function validarToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authorization.split(" ")[1]; // Separar para obtener la parte del token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Formato de token inválido. Use: Bearer <token>" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = user; // Adjuntar el usuario al objeto de la solicitud para su uso posterior
    next();
  });
}

// Exportar las funciones para usarlas en otras partes de la aplicación
module.exports = {
  generarToken,
  validarToken,
};
