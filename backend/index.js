//Inicializar servicio MONGODB
//npm init -y (package.json)
const express = require("express") //npm i express
const rolesInit = require("./libs/initialSetUp") // importamos el iniciador de los roles
const app = express()
const database="EMPRESAS_FCT"
const morgan=require("morgan") //npm i morgan
const path = require("path") //npm i path
const methodOverride = require("method-override") //npm i method-override
const port = process.env.port || 3000
const version = "v1";
const mongoose = require("mongoose")
const fs = require("fs");
const AppError = require("./appError");
const logger = require("./logger");

const session = require("express-session")


//IMPORTAMOS LAS RUTAS NECESARIAS PARA SU USO
const authRoutes = require("./routes/auth.routes")
const mainRoutes = require("./routes/main.routes")
const userRoutes = require("./routes/user.routes")
const empresasRoutes = require("./routes/empresa.routes")
//MW
const cors=require("cors")


const whitelist = ["http://localhost:3000/"]
const corsOptions={
    origin: (origin,callback)=>{
        console.log(origin)
        if(whitelist.indexOf(origin)!=1){
            callback(null,true)
        }else{
            callback(new Error())
        }
    },
    credentials:true

}



app.use(cors(corsOptions))
app.use(methodOverride("_method"))  
app.use(express.urlencoded({extended:true})) //recuperar request.body
app.use(session({secret:"mipwddesession"}))
app.use(express.json()) //usaremos JSON para los request.body
app.use(express.static(path.join(__dirname, '../frontend/public')));


app.set("views",path.join(__dirname,"views")) //localizamos el directorio de vistas
app.set("view engine","ejs") //npm i ejs -- configurar motor de vistas como EJS



const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
  );
  const errorLogStream = fs.createWriteStream(
    path.join(__dirname, "error.log"),
    { flags: "a" }
  );



  const anyadirMorgan = morgan("combined", {
    stream: accessLogStream,errorLogStream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  });
 

async function conectarMongoDB(){
    return mongoose.connect(`mongodb://127.0.0.1:27017/${database}`)    
}  


//RUTAS DE LOS USUARIOS PARA AUTENTICARSE

app.use(`/api/${version}/auth`,authRoutes)
app.use(`/api/${version}/home`,mainRoutes)
app.use(`/api/${version}/users`,userRoutes)
app.use(`/api/${version}/empresas`,empresasRoutes)


/* CONTROLADORES - RUTAS DE USERS */
app.get("/",(req,res)=>{
    res.redirect(`/api/${version}/auth/register`,)
})




//Controlar rutas no existentes
app.use(anyadirMorgan,(req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..','frontend','public','pag404','dist','index.html'))
    logger.error.error("Se ha accedido a una ruta que no existe en el servidor");
    new AppError("Ruta no existente", 404);
});


//Middleware para el trato general de errores
app.use(anyadirMorgan,(err, req, res, next) => {
    const { status = 500, message = "FALLO GENERAL" } = err;
    console.log("FALLO GENERAL");
    res.status(status).send(message);
    logger.error.fatal("ERROR GENERAL, ERROR INDEX /", err);
});

/* LEVANTAR SERVIDOR */
app.listen(port,async()=>{
    console.log(`Escuchando en http://localhost:${port}`)    
    try{
        //Una vez levantado el servidor, intentamos conectar con MongoDB
        await conectarMongoDB()
        .then(function(){
            console.log("Conectado con MongoDB...")
            rolesInit.initializeData(); //CREAMOS ROLES AL INICIAR LA APP si no existen en la base de datos mongo,ademas de crear el usuario admin
        })
        .catch(function(err){
            //Si no conectamos con MongoDB, debemos tumbar el servidor
            console.log(`Error al conectar. Desc: ${err}`)        
            process.exit(0)
        })
    } catch(err){
        //Si no conectamos con MongoDB, debemos tumbar el servidor
        process.exit(0)
    }  
})