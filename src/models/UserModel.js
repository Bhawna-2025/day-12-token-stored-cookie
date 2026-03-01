const mongoose=require("mongoose")
const Userschema= new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:[true,"with this email is already exist"]
    },
    password:String
})
const UserModel=mongoose.model("users",Userschema)
module.exports=UserModel