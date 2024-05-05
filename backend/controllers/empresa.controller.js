const EmpresaModel = require("../models/empresa");
const version = "v1";
const logger = require("../logger");
const fs = require('fs');

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

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
