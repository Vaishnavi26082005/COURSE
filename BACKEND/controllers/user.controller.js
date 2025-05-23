import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {z} from "zod";

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