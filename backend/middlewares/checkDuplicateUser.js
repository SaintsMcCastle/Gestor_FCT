const UserModel = require("../models/user");

exports.checkUserEmail = async (req, res, next) => {
  // Verificar si ya existe un usuario con el mismo nombre de usuario
  const usernameExists = await UserModel.findOne({ username: req.body.username });
  if (usernameExists) {
    return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
  }

  // Verificar si ya existe un usuario con el mismo correo electrónico
  const emailExists = await UserModel.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
  }

  // Si no hay duplicados, continuar con el registro
  next();
}