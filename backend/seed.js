const mongoose = require("mongoose")
const Empresa = require("./models/empresa")
mongoose.connect("mongodb://127.0.0.1:27017/EMPRESAS_FCT")
.then(()=>{
    console.log("Conectado")
})
.catch((err)=>{
    console.log(err)
})

const empresas = [
    {
        CIF:"Empresa1234",
        name:"prueba",
        city:"Villena",
        personInCharge:"Santos",
        personInChargeID:"S4837423239237",
        type:"familiar",
        family:"Agricola",
        address:"Calle nueva",
        area:"Publica",
        postalCode:0o3400,
        phone:799529416,
        email:"prueba@gmail.com"
    }, 
]



Empresa.insertMany(empresas)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})
