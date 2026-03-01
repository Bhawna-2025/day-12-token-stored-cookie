const express= require("express")
const UserModel = require("../models/UserModel")
const jwt=require("jsonwebtoken")
const authRoutes=express.Router()//to allow to write code of api in another file instead of app.js

authRoutes.post("/register",async(req,res)=>{
    const{name,email,password}=req.body

    const isUserExistAlready=await UserModel.findOne({email})

    if(isUserExistAlready){
        return res.status(409).json({
            message:"account is already exist"
        })
    }

    const user =await UserModel.create({
        name,email,password
    })

    const token=jwt.sign(
        {
            id:user._id,
            email:user.email
        },
        process.env.JWT_SECRET
    )
    res.cookie("jwt_token",token)
    res.status(201).json({
        message:"user registered successfully",
        user,
        token
    })
})

module.exports=authRoutes