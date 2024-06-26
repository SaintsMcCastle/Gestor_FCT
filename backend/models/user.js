const mongoose = require("mongoose") //npm i mongoose
const userSchema = new mongoose.Schema({
    //_id --> ObjectID (va de serie, no hay que añadirlo - similar a PK)
    username:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    firstName:{
        type:String,
        required: true
    },
    direccion:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    picture:{
        type:String, // Cambiado a String en lugar de Image
        required: false, // Cambiado a false para hacerlo opcional
        default: null
    },
    roles: [
        {
            ref: "Role",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        default: null
    }
},

{
    timestamps: true, //Esto sirve para que automaticamente mongoose añada cretedAt y updatedAt
    versionKey: false,
});

// Hook pre para eliminar referencia de usuario en empresa
userSchema.pre('remove', async function(next) {
    if (this.empresa) {
        await this.model('Empresa').updateOne(
            { _id: this.empresa },
            { $pull: { students: this._id } }
        );
    }
    next();
});

const User = mongoose.model("User", userSchema)

//Registrar Usuarios    
User.create = async function(newUser,result){
    await newUser.save()
    .then(function(data){
        result(data,null)
    })
    .catch(function(err){
        result(null, err)
    })
}

User.findByUsername = async function(username_param, result) {
    try {
        const userFound = await User.findOne({ username: username_param });
        if (userFound) {
            result(userFound, null);
        } else {
            result(null, { err: "No hay usuarios con ese username" });
        }
    } catch (error) {
        result(null, { err: "Error interno del servidor" });
    }
};

// Hook pre para eliminar referencia de empresa
userSchema.pre('remove', async function(next) {
    if (this.empresa) {
        await this.model('Empresa').updateOne(
            { _id: this.empresa },
            { $pull: { students: this._id } }
        );
    }
    next();
});


module.exports = User