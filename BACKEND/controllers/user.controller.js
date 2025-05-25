import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {z} from "zod";
import jwt from 'jsonwebtoken'
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
     const userSchema = z.object({
        firstName: z.string().min(2, { message: "First name is required" }),
        lastName: z.string().min(2, { message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),})

    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: validation.error.issues.map(err=>err.message),
        });
    }

    //hashed passsword
    const hashedPassword= await bcrypt.hash(password, 10);

   try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "user already exists",
        });
    }
    const newUser= new User ({firstName,lastName,email,
    password: hashedPassword});
    await newUser.save();
    res.status(201).json({message:"user created successfully",newUser});
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
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"user not found",
            });
        }
        const isPass= await bcrypt.compare(password,user.password);
    if(!isPass){
        return res.status(403).json({
            message:"invalid credentials",
        });
    }

//jwt code 
    const token= jwt.sign({id:user.id},
        config.JWT_USER_PASSWORD,
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
    res.status(200).json({message:"login success",user,token})
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
        
    }
}



export const logout= async(req,res)=>{
  try {
     if(!req.cookies.jwt){
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


export const purchases=async(req,res)=>{
    try {
        const userId=req.userId;
        const purchases=await Purchase.find({ userId });
        let purchasedCourses = [];
        for(let i=0;i<purchases.length;i++){
            purchasedCourses.push(purchases[i].courseId);

           
        }
        const courseDetails = await Course.find({
                _id:{ $in: purchasedCourses}
            })
        res.status(200).json({
            purchases,courseDetails
        })
        
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
        
    }
}