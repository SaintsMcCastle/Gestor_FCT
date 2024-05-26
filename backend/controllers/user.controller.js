const UserModel = require("../models/user");
const RoleModel = require("../models/role");
const version = "v1";
const logger = require("../logger");
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require("bcrypt")




function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


// exports.getUserPicture = wrapAsync(async (req, res, next) => {
//     try{
//         const userId = req.params.userId;
//         const user = await UserModel.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ message: 'Usuario no encontrado' });
//         }
  
//         if (!user.picture) {
//             return res.status(404).json({ message: 'El usuario no tiene una imagen asociada' });
//         }
  
//         // Decodificar la imagen base64 y enviarla en la respuesta
//         const img = Buffer.from(user.picture, 'base64');
//         res.writeHead(200, {
//             'Content-Type': 'image/jpg',
//             'Content-Length': img.length
//         });
//         res.end(img);
  
//      }  catch (error) {
//         console.error('Error al obtener la imagen del usuario:', error);
//         return res.status(500).json({ error: 'Error interno del servidor' });
//     }
// }); 

exports.getUserPicture = wrapAsync(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!user.picture) {
            return res.status(404).json({ message: 'El usuario no tiene una imagen asociada' });
        }

        // Decodificar la imagen base64 y determinar el tipo de contenido
        const img = Buffer.from(user.picture, 'base64');
        let contentType;

        // Detectar el tipo de imagen a partir del contenido base64
        if (user.picture.startsWith('data:image/jpeg;base64,')) {
            contentType = 'image/jpeg';
        } else if (user.picture.startsWith('data:image/png;base64,')) {
            contentType = 'image/png';
        } else if (user.picture.startsWith('data:image/svg+xml;base64,')) {
            contentType = 'image/svg+xml';
        } else {
            contentType = 'application/octet-stream'; // Tipo genérico para binarios desconocidos
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': img.length
        });
        res.end(img);

    } catch (error) {
        console.error('Error al obtener la imagen del usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

exports.getUserRole = wrapAsync(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const role = await RoleModel.findById(user.roles[0]); // Suponiendo que el usuario solo tiene un rol por ahora

        if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        // Enviar el nombre del rol en la respuesta
        res.status(200).json({ role: role.name });

    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Mostrar formulario para editar un usuario
exports.loadEdit = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.render('editUser.ejs', { usuario: user });
});

exports.edit = async function(req, res) {
    const { id } = req.params;
    const { username, password, firstName, direccion, email } = req.body;

    try {
        // Encriptar la contraseña si se ha proporcionado
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        // Crear un objeto con los campos a actualizar
        const updateFields = {
            username,
            firstName,
            direccion,
            email,
            ...(password && { password: hashedPassword }) // Solo incluir la contraseña si se ha proporcionado
        };

        // Manejar la carga de la imagen si se proporciona
        if (req.file) {
            const imageData = await fs.readFile(req.file.path);
            const base64Image = imageData.toString('base64');
            updateFields.picture = base64Image;
            await fs.unlink(req.file.path); // Eliminar el archivo temporal de la imagen cargada
        }

        // Actualizar el usuario solo con los campos proporcionados
        const user = await UserModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        res.redirect(`/api/v1/users/${user._id}/view`); // Redirige a donde quieras después de editar
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.loadView = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if(user){
        res.render('viewUser.ejs', { usuario: user });
    }
    else{
        console.log("Usuario no encontrado")
    }
});