const UserModel = require("../models/user");
const version = "v1";
const logger = require("../logger");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt")



function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


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
  
        // Decodificar la imagen base64 y enviarla en la respuesta
        const img = Buffer.from(user.picture, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/jpg',
            'Content-Length': img.length
        });
        res.end(img);
  
    } catch (error) {
        console.error('Error al obtener la imagen del usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });  


// Mostrar formulario para editar un usuario
exports.loadEdit = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.render('editUser.ejs', { usuario: user });
});

// // Editar un usuario por su ID
// exports.edit = wrapAsync(async function(req, res) {

//     try {
//         const { id } = req.params;

//         const { username, firstName, direccion, email, password } = req.body;
//         let userData = { username, firstName, direccion, email };

//         if (req.file) {

//             // Leer el archivo de la imagen de manera asíncrona
//             const imageData = await fs.readFile(req.file.path);
//             // Convertir la imagen a base64
//             const base64Image = imageData.toString('base64');
//             // Asignar la imagen al campo 'picture' del usuario
//             userData.picture = base64Image;
//             // Eliminar el archivo temporal de la imagen cargada
//             await fs.unlink(req.file.path); // Usar await para esperar a que fs.unlink se complete
//         }

//         // Si se proporciona una nueva contraseña, encriptarla y actualizarla
//         if (password) {
//             const hashedPassword = await bcrypt.hash(password, 12);
//             userData.password = hashedPassword;
//         }

//         // Actualizar el usuario
//         const uActualizado = await UserModel.findByIdAndUpdate(id, userData, { runValidators: true, new: true });

//         res.redirect(`/api/${version}/home/main?userId=${uActualizado._id}`);
//     } catch (error) {
//         console.error('Error al editar el usuario:', error);
//         res.status(500).json({ error: error.message });
//     }
// });