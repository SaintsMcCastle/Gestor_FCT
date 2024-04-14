const UserModel = require("../models/user")
const RoleModel = require("../models/role")
const version="v1"
const logger = require("../logger");
const fs = require('fs').promises; // Importar el módulo fs.promises
const path = require('path');
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const claveJWT='users-api'

//const extractToken = require('../middlewares/authJwt');
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e))
    }
  }
const extractToken = function(req) {
    if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
        //Bearer kalñsdjkfalñksdjflñaksjdflñkajsdflñkajsdñfkl
        return req.headers.authorization.split(" ")[1]        
    }else if (req.session && req.session.token){
        return req.session.token
    } else if (req.query && req.query.token){
        return req.query.token
    }
    return null 
}


exports.showLogin = function(req,res){
    const { msg="" } = req.query 
    res.render("login.ejs",{ msg })
}

exports.showRegister = function(req,res){
    res.render("register.ejs")
}


exports.register = wrapAsync(async function(req, res) {
    try {   
        const newUser = new UserModel(req.body); // Crear un nuevo usuario con los datos del formulario
        newUser.password = await bcrypt.hash(newUser.password, 12); // Encriptar la contraseña

        // Manejar la carga de la imagen si se proporciona
        if (req.file) { 
            // Leer el archivo de la imagen de manera asíncrona
            const imageData = await fs.readFile(req.file.path);
            // Convertir la imagen a base64
            const base64Image = imageData.toString('base64');
            // Asignar la imagen al campo 'picture' del usuario
            newUser.picture = base64Image;
            // Eliminar el archivo temporal de la imagen cargada
            await fs.unlink(req.file.path); // Usar await para esperar a que fs.unlink se complete
        }else{
            console.log("no hay foto")
        }

        // Buscar y asignar roles si se proporcionan
        const {roles} = req.body

        if (roles) { // Si el usuario elige un rol, buscarlo en el modelo de roles
            const foundRoles = await RoleModel.find({ name: {$in: roles}});
            newUser.roles = foundRoles.map(role => role._id);
        } else { // Si el usuario no elige ningún rol, asignar el rol de invitado de forma predeterminada
            const role = await RoleModel.findOne({ name: "alumno" });
            newUser.roles = [role._id];
        }         

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        console.log(savedUser);
        return res.status(200).redirect(`/api/${version}/auth/login`);
    } catch (e) {
        console.error('Error al registrar el usuario:', e);
        return res.status(500).json({ error: e.message });
    }
});

exports.login=wrapAsync(async function(req,res){
    const { username, password } = req.body   
    const pwd_textoPlano = password                            // El pwd_texto plano es la contraseña que introducimos en el formulario tal cual
    let userFoundData = null

    await UserModel.findByUsername(username,function(userFound,err){
        if(err){
            res.status(500).json(err)
        }else{
            userFoundData = userFound
            console.log(userFoundData)
        }
    })
    
    if(userFoundData){
        const validado = await bcrypt.compare(pwd_textoPlano,userFoundData.password) //Si el usuario existe se compara la contraseña de texto plano con la contraseña encriptada de la base de datos
        if(validado){
            const token = jwt.sign({ id: userFoundData._id},claveJWT,{
                expiresIn: 86400 //24h
            })
            // req.session.user=userFoundData
            req.session.token = token

            console.log(token)
            res.status(200).set('x-auth-token', token).redirect(`/api/${version}/home/main?userId=${userFoundData._id}`);
        }else{
            res.status(401).json({"err":"Usuario y/o contraseña no correctos"})
        }
    }
})

exports.logout=(req,res)=>{
    console.log("Estoy dentro")
    const token = extractToken(req)
    if(token){
        jwt.sign(token,claveJWT,{ expiresIn: 1}, (logout,err)=>{
            if(logout){
                if(req.session && req.session.token){
                    req.session.destroy() //Eliminar todo el objeto session
                    //req.session.token = null
                }                
                //res.status(200).json({msg:"Desconectado con éxito"})
                res.redirect("/api/v1/auth/login?msg=Desconectado con éxito")
            }else{
                res.status(500).json({msg:err})
            }
        })
    }else{
        res.status(401).json({msg:"No existe el token"})
    }
}