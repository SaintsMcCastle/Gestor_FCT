const jwt = require("jsonwebtoken")
const claveJWT = 'users-api'
const path = require("path") //npm i path

//MODELOS 
const UserModel= require("../models/user")
const RoleModel= require("../models/role")


//FUNCIONES 
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e))
    }
}
const extractToken= function(req){
    if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
        //Bearer kalñksdjflñaksjdflñkajsdflñkajsdñfkl
        return req.headers.authorization.split(" ")[1]        
    }else if (req.session && req.session.token){
        return req.session.token
    } else if (req.query && req.query.token){
        return req.query.token
    }
    return null 
}

exports.verifyToken=wrapAsync(async function (req,res,next) {
    try {
        const token = extractToken(req) // recoge el token mediante la funcion extractToken
        console.log(token)                                  
        if(!token)return res.status(401).json({message: "No token provided"})

        const decoded=jwt.verify(token,claveJWT)                                     // Le pasamos el token para que lo verifique y compruebe de que esta asignado a algun usuario
        req.userId=decoded.id
        console.log(decoded)

        const user = await UserModel.findById(req.userId,{password:0})
        if(!user) return res.status(404).json({message: "no user found"})
        next()
    } catch (e) {
        return res.status(403).json({msg:"forbidden"}) 
    }
    
})

exports.isAdmin= wrapAsync(async function (req,res,next) {
    const user = await UserModel.findById(req.userId)
    const roles = await RoleModel.find({_id: {$in: user.roles}})

    console.log(roles)

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name ==="admin"){
            next()
            return
        }
    }
    return res.status(403).sendFile(path.join(__dirname, '../public','./pag403','./dist','index.html'))
})

exports.isUser= wrapAsync(async function (req,res,next) {
    const user = await UserModel.findById(req.userId)
    const roles = await RoleModel.find({_id: {$in: user.roles}})

    console.log(roles)

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name ==="user"){
            next()
            return
        }
    }
    return res.status(403).sendFile(path.join(__dirname, '../public','./pag403','./dist','index.html'))
})
