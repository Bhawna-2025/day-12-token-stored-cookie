const express= require("express")
const UserModel = require("../models/UserModel")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const authRoutes=express.Router()//to allow to write code of api in another file instead of app.js

authRoutes.post("/register",async(req,res)=>{
    const{name,email,password}=req.body

    const isUserExistAlready=await UserModel.findOne({email})

    if(isUserExistAlready){
        return res.status(409).json({
            message:"account is already exist"
        })
    }
    const hash=crypto.createHash("md5").update(password).digest("hex")
    const user =await UserModel.create({
        name,email,password:hash
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

authRoutes.post("/protected",(req,res)=>{
    console.log(req.cookies)
    res.status(200).json({
        message:"token is saved succesfully"
    })
})

authRoutes.post("/login",async(req,res)=>{
    const{email,password}=req.body
    const user= await UserModel.findOne({email})
    if(!user){
        res.status(409).json({
            message:"user not exist with this email"
        })
    }
    const isPasswordCorrect=user.password==crypto.createHash("md5").update(password).digest("hex")
    if(!isPasswordCorrect){
        res.status(400).json({
            message:"invalid password"
        })
    }

    const token=jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("jwt_token",token)

    res.status(200).json({
        message:"user logged in successfully",
        user,
        token
    })
})

module.exports=authRoutes