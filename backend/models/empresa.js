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
    },
    students: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        firstName: String,
        email: String
    }]
},
{
    timestamps: true, //Esto sirve para que automaticamente mongoose añada cretedAt y updatedAt
    versionKey: false,
});


// Hook pre para establecer empresa a null en usuarios
empresaSchema.pre('remove', async function(next) {
    await this.model('User').updateMany(
        { _id: { $in: this.students } },
        { $set: { empresa: null } }
    );
    next();
});

// Método personalizado en el modelo de Empresa para desvincular un estudiante
empresaSchema.statics.desvincularEstudiante = async function(empresaId, estudianteId) {
    // Encuentra la empresa por su ID
    const empresa = await this.findById(empresaId);
    if (!empresa) {
        throw new Error("Empresa no encontrada");
    }

    // Encuentra el índice del estudiante en la lista de estudiantes de la empresa
    const index = empresa.students.findIndex(student => student._id.toString() === estudianteId);
    if (index === -1) {
        throw new Error("Estudiante no encontrado en la lista de estudiantes de la empresa");
    }

    // Elimina al estudiante de la lista de estudiantes de la empresa
    empresa.students.splice(index, 1);

    // Guarda los cambios en la empresa
    await empresa.save();

    // Actualiza el campo de empresa a null en el usuario correspondiente
    await mongoose.model('User').findByIdAndUpdate(estudianteId, { empresa: null });
};

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

Empresa.findByName = async function(name_param, result){
    const empresaFound = await Empresa.findOne({ name: name_param})
    if(empresaFound){
        result(empresaFound,null)
    }else{
        result(null, {"err":"No hay empresas con ese nombre"})
    }
}



module.exports = Empresa