const express= require('express')
const router=express.Router()
const authJwt = require("../middlewares/authjwt")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define la carpeta donde se guardarán los archivos temporales
const checkDuplicateUser = require("../middlewares/checkDuplicateUser")


//CONTROLLER
const userCtrl = require("../controllers/user.controller")
const adminCtrl = require("../controllers/admin.controller")


//Obtener Imagen
router.get('/user/:userId/picture',[authJwt.verifyToken],userCtrl.getUserPicture);
router.get('/user/:userId/role',[authJwt.verifyToken],userCtrl.getUserRole);


// Listar todos los usuarios (solo para admin)
router.get("/admin/userList", [authJwt.verifyToken, authJwt.isAdmin], adminCtrl.findAll);

// Mostrar formulario de creación de usuario (solo para admin)
router.get("/admin/users/new", [authJwt.verifyToken, authJwt.isAdmin], adminCtrl.showCreate);

// Crear un nuevo usuario (solo para admin)
router.post("/admin/users", [authJwt.verifyToken, authJwt.isAdmin,upload.single('picture'),checkDuplicateUser.checkUserEmail], adminCtrl.create);

// Mostrar detalles de usuario (solo para el usuario actual, admin o profesor)
router.get("/:id/view", authJwt.verifyToken, userCtrl.loadView);

// Borrar un usuario (solo para admin)
router.delete("/admin/users/:id", [authJwt.verifyToken, authJwt.isAdmin], adminCtrl.deleteById);

// Mostrar formulario de edición de usuario (solo para el usuario actual, admin o profesor)
router.get("/:id/edit", authJwt.verifyToken, userCtrl.loadEdit);

// Editar un usuario (solo para el usuario actual, admin o profesor)
router.patch("/:id", [authJwt.verifyToken, upload.single('picture')], userCtrl.edit);


module.exports = router