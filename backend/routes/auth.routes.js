const express= require('express')
const router=express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define la carpeta donde se guardarán los archivos temporales

const authCtrl = require("../controllers/auth.controller")
const checkDuplicateUser = require("../middlewares/checkDuplicateUser")

//Cargar la vista de registro
router.get("/register", authCtrl.showRegister)
//Crear/Registrar usuario
router.post("/register",[upload.single('picture'),checkDuplicateUser.checkUserEmail],authCtrl.register)

//Cargar la vista de login
router.get("/login", authCtrl.showLogin)
//Autenticar
router.post("/login",authCtrl.login)

router.post("/logout",authCtrl.logout)

module.exports = router