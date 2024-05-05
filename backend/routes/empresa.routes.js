const express= require('express')
const router=express.Router()
const authJwt = require("../middlewares/authjwt")

const empresaCtrl = require("../controllers/empresa.controller")

router.get("/listadoEmpresas",[authJwt.verifyToken],empresaCtrl.getEmpresas)
router.get("/citys",[authJwt.verifyToken],empresaCtrl.getCitys)
router.get("/familys",[authJwt.verifyToken],empresaCtrl.getFamilys)
router.get("/areas",[authJwt.verifyToken],empresaCtrl.getAreas)

router.get("/buscar-empresas",[authJwt.verifyToken],empresaCtrl.findEmpresas)


module.exports = router