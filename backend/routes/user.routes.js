const express= require('express')
const router=express.Router()
const authJwt = require("../middlewares/authjwt")
//CONTROLLER
const userCtrl = require("../controllers/user.controller")


router.get('/main',[authJwt.verifyToken],userCtrl.getMainPage);
//Obtener Imagen
router.get('/users/:userId/picture',userCtrl.getUserPicture);
// //NUEVO
// router.get("/jugadores/new",[authJwt.verifyToken,authJwt.isAdmin],playerCtrl.showCreate)
// router.post("/jugadores",[authJwt.verifyToken,authJwt.isAdmin],playerCtrl.create)
// //DETALLES
// router.get("/jugadores/:id",[authJwt.verifyToken,authJwt.isAdmin,authJwt.isAdmin],playerCtrl.findbyId) 
// //DELETE
// router.delete("/jugadores/:id",[authJwt.verifyToken,authJwt.isAdmin],playerCtrl.deleteById)
// //EDITAR
// router.get("/jugadores/:id/edit",[authJwt.verifyToken,authJwt.isAdmin],playerCtrl.loadEdit)
// router.patch("/jugadores/:id",[authJwt.verifyToken,authJwt.isAdmin],playerCtrl.edit)

module.exports = router