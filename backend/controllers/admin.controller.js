const UserModel = require("../models/user");
const RoleModel = require('../models/role');
const version ="v1"
const logger = require('../logger');
const bcrypt = require('bcrypt');
const fs = require('fs').promises; // Para operaciones de archivos de forma asíncrona
const path = require('path');



// Función para envolver las funciones asíncronas y manejar los errores
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}




// Buscar todos los usuarios
exports.findAll = wrapAsync(async function (req, res) {
    try {
        const usuarios = await UserModel.find();
        res.render('userList.ejs', { usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar usuarios');
    }
});

// Mostrar formulario para crear nuevo usuario
exports.showCreate = (req, res) => {
    res.render('newUser.ejs');
};


// res.redirect(`/api/${version}/admin/users/${newUser._id}`);

// Crear un nuevo usuario
exports.create = wrapAsync(async function (req, res) {
    try {
        // Crear un nuevo usuario con los datos del formulario
        const newUser = new UserModel(req.body);

        // Encriptar la contraseña
        newUser.password = await bcrypt.hash(newUser.password, 12);

        // Manejar la carga de la imagen si se proporciona
        if (req.file) { 
            // Leer el archivo de la imagen de manera asíncrona
            const imageData = await fs.readFile(req.file.path);
            // Convertir la imagen a base64
            const base64Image = imageData.toString('base64');
            // Asignar la imagen al campo 'picture' del usuario
            newUser.picture = base64Image;
            // Eliminar el archivo temporal de la imagen cargada
            await fs.unlink(req.file.path); // Usar await para esperar a que fs.unlink se complete
        } else {
            console.log("No hay foto proporcionada");
        }

        // Buscar y asignar roles si se proporcionan
        const { roles } = req.body;

        if (roles) { // Si el usuario elige un rol, buscarlo en el modelo de roles
            const foundRoles = await RoleModel.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map(role => role._id);
        } else { // Si el usuario no elige ningún rol, asignar el rol de alumno de forma predeterminada
            const role = await RoleModel.findOne({ name: "alumno" });
            newUser.roles = [role._id];
        }

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(200).json({ message: "Usuario creado correctamente", user: savedUser });


    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mostrar detalles de un usuario por su ID
exports.findbyId = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const uEncontrado = await UserModel.findById(id);
    if (uEncontrado) {
        res.render('showUser.ejs', { usuario: uEncontrado });
        logger.access.debug("Acceso a controller 'findbyId' ,esquema 'usuarios'");
    } else {
        console.log('Usuario no encontrado');
        logger.error.fatal("Error al acceder al controller 'findbyId', esquema 'usuarios'");
    }
});

// Eliminar un usuario por su ID
exports.deleteById = wrapAsync(async function (req, res) {
    const { id } = req.params;

    try {
        // Buscar y eliminar el usuario por su ID
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            logger.error.fatal("Error al borrar usuario: Usuario no encontrado");
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        logger.access.debug("Acceso a controller 'deleteById' ,esquema 'usuarios'");
        return res.redirect(`/api/${version}/users/admin/userlist`);
    } catch (error) {
        console.error('Error al borrar usuario:', error);
        logger.error.fatal("Error acceso a controller 'deleteById' ,esquema 'usuarios'");
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

});

// // Mostrar formulario para editar un usuario
// exports.loadEdit = wrapAsync(async function (req, res) {
//     const { id } = req.params;
//     const user = await UserModel.findById(id);
//     res.render('editUser.ejs', { usuario: user });
// });

// // Editar un usuario por su ID
// exports.edit = wrapAsync(async function (req, res) {
//     const { id } = req.params;
//     const uActualizado = await UserModel.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
//     res.redirect(`/api/${version}/admin/users/${uActualizado._id}`);
// });