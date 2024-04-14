const mongoose = require("mongoose") //npm i mongoose
const empresaSchema = new mongoose.Schema({
    //_id --> ObjectID (va de serie, no hay que añadirlo - similar a PK)
    CIF:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    personInCharge:{
        type:String,
        required: true
    },
    personInChargeID:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required: true
    },
    family:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    area:{
        type:String,
        required: true
    },
    postalCode:{
        type:Number,
        required: true
    },
    phone:{
        type:Number,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    }
},
{
    timestamps: true, //Esto sirve para que automaticamente mongoose añada cretedAt y updatedAt
    versionKey: false,
});

const Empresa = mongoose.model("Empresa", empresaSchema)

//Registrar Usuarios    
Empresa.create = async function(newEmpresa,result){
    await newEmpresa.save()
    .then(function(data){
        result(data,null)
    })
    .catch(function(err){
        result(null, err)
    })
}

Empresa.findByUsername = async function(name_param, result){
    const empresaFound = await Empresa.findOne({ name: name_param})
    if(empresaFound){
        result(empresaFound,null)
    }else{
        result(null, {"err":"No hay empresas con ese nombre"})
    }
}


module.exports = Empresa