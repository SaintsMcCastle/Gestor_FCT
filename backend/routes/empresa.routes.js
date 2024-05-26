const express= require('express')
const router=express.Router()
const authJwt = require("../middlewares/authjwt")

const empresaCtrl = require("../controllers/empresa.controller")
const adminCtrl = require("../controllers/admin.controller")


router.get("/listadoEmpresas",[authJwt.verifyToken],empresaCtrl.getEmpresas)
router.get("/citys",[authJwt.verifyToken],empresaCtrl.getCitys)
router.get("/familys",[authJwt.verifyToken],empresaCtrl.getFamilys)
router.get("/areas",[authJwt.verifyToken],empresaCtrl.getAreas)

router.get("/buscar-empresas",[authJwt.verifyToken],empresaCtrl.findEmpresas)




router.get("/admin/companylist", [authJwt.verifyToken, authJwt.isAdminOrProfesor], adminCtrl.findAllEmpresas);

router.get("/:id/view", [authJwt.verifyToken, authJwt.isAdminOrProfesor], empresaCtrl.loadView);


// Mostrar formulario de edición de empresa (solo para el usuario actual, admin o profesor)
router.get("/:id/edit", [authJwt.verifyToken, authJwt.isAdminOrProfesor], empresaCtrl.loadEdit);

// Editar una empresa (solo para el usuario actual, admin o profesor)
router.patch("/:id", [authJwt.verifyToken, authJwt.isAdminOrProfesor], empresaCtrl.edit);

// Mostrar formulario de creación de empresa (solo para admin)

router.get("/admin/empresas/new", [authJwt.verifyToken, authJwt.isAdminOrProfesor,], adminCtrl.showCreateEmpresa);

// Crear una nueva empresa (solo para admin)
router.post("/admin/empresas", [authJwt.verifyToken, authJwt.isAdminOrProfesor], adminCtrl.createEmpresa);

// Borrar una empresa (solo para admin)
router.delete("/admin/empresas/:id", [authJwt.verifyToken, authJwt.isAdminOrProfesor], adminCtrl.deleteByIdEmpresas);


// Agregar una nueva ruta para manejar la adición de alumnos a una empresa
router.get("/admin/:id/addStudents", [authJwt.verifyToken, authJwt.isAdminOrProfesor], adminCtrl.showAddStudent);


module.exports = router