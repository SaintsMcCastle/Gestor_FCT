const EmpresaModel = require("../models/empresa");
const version = "v1";
const logger = require("../logger");
const fs = require('fs');

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

exports.findAll = wrapAsync(async function (req, res) {
    try {
        const empresas = await EmpresaModel.find();
        res.render('companiesList.ejs', { empresas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar empresas');
    }
});

exports.loadView = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const company = await EmpresaModel.findById(id);
    if (company) {
        res.render('viewCompany.ejs', { empresa: company });
    } else {
        console.log("Empresa no encontrada");
    }
});

// Mostrar formulario para editar una empresa
exports.loadEdit = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const empresa = await EmpresaModel.findById(id);
    res.render('editCompany.ejs', { empresa: empresa });
});

// Editar una empresa
exports.edit = async function (req, res) {
    const { id } = req.params;
    const { name, address, email, phone } = req.body;

    try {
        // Crear un objeto con los campos a actualizar
        const updateFields = {
            name,
            address,
            email,
            phone
        };

        // Actualizar la empresa solo con los campos proporcionados
        const empresa = await EmpresaModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!empresa) {
            return res.status(404).send({ message: "Empresa no encontrada" });
        }

        res.redirect(`/api/v1/empresas/${empresa._id}/view`); // Redirige a donde quieras después de editar
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getEmpresas = wrapAsync(async (req, res, next) => {
    try {
        const empresas = await EmpresaModel.find(); 
        res.json(empresas); // 
  
    } catch (error) {
        console.error("Error al obtener empresas:", err);
        res.status(500).json({ error: 'Error al obtener empresas' });
    }
  });  


exports.getCitys = wrapAsync(async (req, res, next) => {
    try {
        const ciudades = await EmpresaModel.distinct('city');
        res.json(ciudades);
    } catch (err) {
        console.error("Error al obtener ciudades:", err);
        res.status(500).json({ error: 'Error al obtener ciudades' });
    }
});  


exports.getFamilys = wrapAsync(async (req, res, next) => {
    try {
        const familias = await EmpresaModel.distinct('family');
        res.json(familias);
    } catch (err) {
        console.error("Error al obtener familias:", err);
        res.status(500).json({ error: 'Error al obtener familias' });
    }
});  

exports.getAreas = wrapAsync(async (req, res, next) => {
    try {
        const areas = await EmpresaModel.distinct('area');
        res.json(areas);
    } catch (err) {
        console.error("Error al obtener áreas:", err);
        res.status(500).json({ error: 'Error al obtener áreas' });
    }
});  






exports.findEmpresas = wrapAsync(async (req, res, next) => {
    const { city, family, area } = req.query; // Obtener los filtros de la URL

    try {
        let query = {};
        if (city) query.city = city;
        if (family) query.family = family;
        if (area) query.area = area;

        const empresas = await EmpresaModel.find(query); // Buscar empresas con los filtros
        res.json(empresas); // Enviar las empresas encontradas como respuesta en formato JSON
    } catch (err) {
        console.error("Error al buscar empresas:", err);
        res.status(500).json({ error: 'Error al buscar empresas' });
    }
}); 
