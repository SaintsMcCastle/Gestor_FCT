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
        CIF:"C878908913",
        name:"Delfin",
        city:"Villena",
        personInCharge:"Jorge",
        personInChargeID:"L00908977",
        type:"empresa",
        family:"coches",
        address:"Calle Inventada",
        area:"Publica",
        postalCode:0o3400,
        phone:7007369301,
        email:"delfin@gmail.com"
    }, 
]



Empresa.insertMany(empresas)
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})
