const UserModel = require("../models/user");
const EmpresaModel = require("../models/empresa")
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

exports.findAllEmpresas = wrapAsync(async function (req, res) {
    try {
        const empresas = await EmpresaModel.find();
        res.render('companiesList.ejs', { empresas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar empresas');
    }
});

// Mostrar formulario para crear nuevo usuario
exports.showCreate = (req, res) => {
    res.render('newUser.ejs');
};

// Mostrar formulario para crear nuevo usuario
exports.showCreateEmpresa = (req, res) => {
    res.render('newCompany.ejs');
};

// Mostrar formulario para añadir un alumno a la empresa
exports.showAddStudent = (req, res) => {
    res.render('addStudent.ejs');
};




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
            console.log("no hay foto")
            const defaultImagePath = path.join(__dirname, "../../frontend/public/img/pred.jpg");
            const defaultImageData = await fs.readFile(defaultImagePath);
            const base64DefaultImage = defaultImageData.toString('base64');
            newUser.picture = base64DefaultImage;
            console.log("No se proporcionó una imagen, usando la imagen predeterminada");
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
        res.status(200).redirect(`/api/v1/users/${newUser._id}/view`); // Redirige a donde quieras después de editar

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: error.message });
    }
});


// Crear una nueva empresa
exports.createEmpresa = wrapAsync(async function (req, res) {
    try {
        // Crear una nueva empresa con los datos del formulario
        const newEmpresa = new EmpresaModel(req.body);

        // Guardar la empresa en la base de datos
        const savedEmpresa = await newEmpresa.save();
        console.log(savedEmpresa);
        res.status(200).redirect(`/api/v1/empresas/${newEmpresa._id}/view`); // Redirige a donde quieras después de crear

    } catch (error) {
        console.error('Error al crear la empresa:', error);
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

// // Eliminar un usuario por su ID
// exports.deleteById = wrapAsync(async function (req, res) {
//     const { id } = req.params;

//     try {
//         // Buscar y eliminar el usuario por su ID
//         const deletedUser = await UserModel.findByIdAndDelete(id);

//         if (!deletedUser) {
//             logger.error.fatal("Error al borrar usuario: Usuario no encontrado");
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }

//         logger.access.debug("Acceso a controller 'deleteById' ,esquema 'usuarios'");
//         return res.redirect(`/api/${version}/users/admin/userlist`);
//     } catch (error) {
//         console.error('Error al borrar usuario:', error);
//         logger.error.fatal("Error acceso a controller 'deleteById' ,esquema 'usuarios'");
//         return res.status(500).json({ error: 'Error interno del servidor' });
//     }

// });



// exports.deleteByIdEmpresas = wrapAsync(async function (req, res) {
//     const { id } = req.params;

//     try {
//         // Buscar y eliminar la empresa por su ID
//         const deletedCompany = await EmpresaModel.findByIdAndDelete(id);

//         if (!deletedCompany) {
//             logger.error.fatal("Error al borrar empresa: Empresa no encontrada");
//             return res.status(404).json({ error: 'Empresa no encontrada' });
//         }

//         logger.access.debug("Acceso a controller 'deleteById' ,esquema 'empresas'");
//         return res.redirect(`/api/${version}/empresas/admin/companylist`);
//     } catch (error) {
//         console.error('Error al borrar empresa:', error);
//         logger.error.fatal("Error acceso a controller 'deleteById' ,esquema 'empresas'");
//         return res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });


exports.deleteById = wrapAsync(async function (req, res) {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id);

        if (!user) {
            logger.error.fatal("Error al borrar usuario: Usuario no encontrado");
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await user.deleteOne();

        logger.access.debug("Acceso a controller 'deleteById' ,esquema 'usuarios'");
        return res.redirect(`/api/${version}/users/admin/userlist`);
    } catch (error) {
        console.error('Error al borrar usuario:', error);
        logger.error.fatal("Error acceso a controller 'deleteById' ,esquema 'usuarios'");
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

exports.deleteByIdEmpresas = wrapAsync(async function (req, res) {
    const { id } = req.params;

    try {
        // Buscar la empresa por su ID
        const company = await EmpresaModel.findById(id);

        if (!company) {
            logger.error.fatal("Error al borrar empresa: Empresa no encontrada");
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }

        // Eliminar las referencias de los usuarios
        await UserModel.updateMany(
            { _id: { $in: company.students } },
            { $set: { empresa: null } }
        );

        // Eliminar la empresa
        await company.deleteOne();

        logger.access.debug("Acceso a controller 'deleteByIdEmpresas' ,esquema 'empresas'");
        return res.redirect(`/api/${version}/empresas/admin/companylist`);
        
    } catch (error) {
        console.error('Error al borrar empresa:', error);
        logger.error.fatal("Error acceso a controller 'deleteByIdEmpresas' ,esquema 'empresas'");
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

