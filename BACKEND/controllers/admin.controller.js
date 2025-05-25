import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import jwt from 'jsonwebtoken'
import config from "../config.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
     const adminSchema = z.object({
        firstName: z.string().min(2, { message: "First name is required" }),
        lastName: z.string().min(2, { message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),})

    const validation = adminSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.issues.map(err=>err.message),
        });
    }

    //hashed passsword
    const hashedPassword= await bcrypt.hash(password, 10);

   try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({
            message: "admin already exists",
        });
    }
    const newAdmin= new Admin ({firstName,lastName,email,
    password: hashedPassword});
    await newAdmin.save();
    res.status(201).json({message:"admin created successfully",newAdmin});
   } catch (error) {
    res.status(500).json({
        message: "internal server error",
        error: error.message,
    });
   }

}

                                 
export const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(404).json({
                message:"admin not found",
            });
        }
        const isPass= await bcrypt.compare(password,admin.password);
    if(!isPass){
        return res.status(403).json({
            message:"invalid credentials",
        });
    }

//jwt code 
    const token= jwt.sign({id:admin.id},
        config.JWT_ADMIN_PASSWORD,
        {
            expiresIn:"1d"
        }
        
    )
    const cookieOptions = {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Helps prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };
     
    res.cookie("jwt",token,cookieOptions);
    res.status(200).json({message:"login success",admin,token})
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
        
    }
}



export const logout= async(req,res)=>{
  try {
    if(!req.cookies?.jwt){
        return res.status(400).json({
            message:"you are not logged in",
        })}
    res.clearCookie("jwt");
    res.status(200).json({
        message:"logout success",
    })
  } catch (error) {
    res.status(500).json({
        message: "internal server error",
        error: error.message,
    });
    
  }
}