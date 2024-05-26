const mongoose = require("mongoose") //npm i mongoose
const ROLES = ["alumno", "profesor", "admin"];
const roleSchema = new mongoose.Schema(
    {
    //_id:("63e62459f19caa150e202661")
    name:String,
    },
    {
    versionKey:false
    },
);


const Role = mongoose.model("Role",roleSchema)
module.exports = Role
