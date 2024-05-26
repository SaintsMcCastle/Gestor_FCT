const EmpresaModel = require("../models/empresa");
const UserModel = require("../models/user");
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

// exports.loadView = wrapAsync(async function (req, res) {
//     const { id } = req.params;
//     const company = await EmpresaModel.findById(id);
//     if (company) {
//         res.render('viewCompany.ejs', { empresa: company });
//     } else {
//         console.log("Empresa no encontrada");
//     }
// });

exports.loadView = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const company = await EmpresaModel.findById(id);
    if (company) {
        const estudiantes = await UserModel.find({ empresa: company._id });
        res.render('viewCompany.ejs', { empresa: company, estudiantes: estudiantes });
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



exports.loadLinkStudents = wrapAsync(async function (req, res) {
    const companies = await EmpresaModel.find();
    const students = await UserModel.find();
    res.render('linkStudents.ejs', { companies, students });
});

// exports.linkStudents = wrapAsync(async function (req, res) {
//     const { companyId, studentIds } = req.body;

//     try {
//         const company = await EmpresaModel.findById(companyId);
//         if (!company) {
//             return res.status(404).send({ message: "Company not found" });
//         }

//         // Asegurarse de que studentIds es un array
//         const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

//         // Verificar si alguno de los estudiantes ya está vinculado a una empresa
//         const studentsWithCompany = await UserModel.find({
//             _id: { $in: studentIdsArray },
//             empresa: { $ne: null }
//         });

//         if (studentsWithCompany.length > 0) {
//             return res.status(400).send({
//                 message: "Algunos estudiantes ya están vinculados a una empresa.",
//                 students: studentsWithCompany.map(student => student.username)
//             });
//         }

//         // Agregar los estudiantes al array de students sin duplicados
//         await EmpresaModel.findByIdAndUpdate(
//             companyId,
//             { $addToSet: { students: { $each: studentIdsArray } } }
//         );

//         // Actualizar el campo empresa en cada usuario
//         await UserModel.updateMany(
//             { _id: { $in: studentIdsArray } },
//             { empresa: companyId }
//         );

//         res.redirect(`/api/v1/empresas/${company._id}/view`); // Redirigir después de vincular
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// });

exports.linkStudents = wrapAsync(async function (req, res) {
    const { companyId, studentIds } = req.body;

    try {
        const company = await EmpresaModel.findById(companyId);
        if (!company) {
            return res.status(404).send({ message: "Company not found" });
        }

        // Asegurarse de que studentIds es un array
        const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

        // Verificar si alguno de los estudiantes ya está vinculado a una empresa
        const studentsWithCompany = await UserModel.find({
            _id: { $in: studentIdsArray },
            empresa: { $ne: null }
        });

        if (studentsWithCompany.length > 0) {
            return res.status(400).send({
                message: "Algunos estudiantes ya están vinculados a una empresa.",
                students: studentsWithCompany.map(student => student.username)
            });
        }

        // Obtener la información completa de los estudiantes seleccionados
        const studentsInfo = await UserModel.find({ _id: { $in: studentIdsArray } });

        // Mapear la información de los estudiantes para guardarla en el array de estudiantes de la empresa
        const mappedStudents = studentsInfo.map(student => ({
            _id: student._id,
            username: student.username,
            firstName: student.firstName,
            email: student.email
        }));

        // Agregar los estudiantes al array de students sin duplicados
        await EmpresaModel.findByIdAndUpdate(
            companyId,
            { $addToSet: { students: { $each: mappedStudents } } }
        );

        // Actualizar el campo empresa en cada usuario
        await UserModel.updateMany(
            { _id: { $in: studentIdsArray } },
            { empresa: companyId }
        );

        res.redirect(`/api/v1/empresas/${company._id}/view`);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});