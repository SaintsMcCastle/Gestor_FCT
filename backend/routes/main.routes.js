const express= require('express')
const router=express.Router()
const authJwt = require("../middlewares/authjwt")
//CONTROLLER
const mainCtrl = require("../controllers/main.controller")


router.get('/main',[authJwt.verifyToken],mainCtrl.getMainPage);

//Obtener pagina contact
router.get('/contact',[authJwt.verifyToken],mainCtrl.getContactPage);

module.exports = router