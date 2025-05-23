import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
   try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "user already exists",
        });
    }
    const newUser= new User ({firstName,lastName,email,password});
    await newUser.save();
    res.status(201).json({message:"user created successfully",newUser});
   } catch (error) {
    res.status(500).json({
        message: "internal server error",
        error: error.message,
    });
   }

}