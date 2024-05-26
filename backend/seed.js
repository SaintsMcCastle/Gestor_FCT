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
        CIF:"C278918933",
        name:"PRUEBA3",
        city:"Petrer",
        personInCharge:"Federico",
        personInChargeID:"L10918917",
        type:"empresa",
        family:"coches",
        address:"Calle Inventada2",
        area:"Publica",
        postalCode:0o1300,
        phone:7027369203,
        email:"PRUEBA3@gmail.com"
    }, 
]



Empresa.insertMany(empresas)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})
