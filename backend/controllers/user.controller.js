const UserModel = require("../models/user");
const version = "v1";
const logger = require("../logger");
const fs = require('fs');
const path = require('path');

// const imageCache = {}; // Cache para almacenar imágenes decodificadas

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

// Determine el tipo de contenido de la imagen basándose en la extensión del archivo o en metadatos
// function getImageContentType(filename) {
//     const extension = filename.split('.').pop().toLowerCase();
//     switch (extension) {
//         case 'jpg':
//         case 'jpeg':
//             return 'image/jpeg';
//         case 'png':
//             return 'image/png';
//         case 'gif':
//             return 'image/gif';
//         default:
//             return 'image/jpeg'; // Tipo de contenido predeterminado
//     }
// }

// Enviar la imagen con el tipo de contenido determinado
// function sendImageResponse(res, img, contentType) {
//     res.writeHead(200, {
//         'Content-Type': contentType,
//         'Content-Length': img.length
//     });
//     res.end(img);
// }

// En user.controller.js
exports.getMainPage = function(req, res) {
    const filePath = path.resolve(__dirname, '../../frontEnd/public/main.html');
    res.sendFile(filePath);
};


// exports.getUserPicture = wrapAsync(async (req, res, next) => {
//     try {
//         const userId = req.params.userId;

//         // Verifica si la imagen está en caché
//         if (imageCache[userId]) {
//             const cachedImage = imageCache[userId];
//             return sendImageResponse(res, cachedImage.img, cachedImage.contentType);
//         }

//         const user = await UserModel.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'Usuario no encontrado' });
//         }

//         if (!user.picture) {
//             return res.status(404).json({ message: 'El usuario no tiene una imagen asociada' });
//         }

//         // Decodifica la imagen base64
//         const img = Buffer.from(user.picture, 'base64');

//         // Determinar el tipo de contenido de la imagen
//         const contentType = getImageContentType(user.pictureFilename);

//         // Almacena la imagen decodificada en caché
//         imageCache[userId] = { img, contentType };

//         // Envía la imagen en la respuesta con el tipo de contenido determinado
//         sendImageResponse(res, img, contentType);
//     } catch (error) {
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