import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


//course create
export const createCourse = async (req, res) => {
   const adminId = req.adminId;


   const { title, description, price } = req.body;
   try {
      if (!title || !description || !price) {
         return res.status(400).json({ message: "All fields are required!" });
      }
      const { image } = req.files;
      if (!req.files || Object.keys(req.files).length === 0) {
         return res.status(400).json({ message: "No files uploaded" });

      }
      const allowedFormat = ["image/png", "image/jpeg"];
      if (!allowedFormat.includes(image.mimetype)) {
         return res.status(400).json({ message: "Invalid file format" });

      }
      //cloudinary code
      const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
      if (!cloud_response) {
         {
            return res.status(500).json({ message: "Error uploading file to cloudinary " });
         }
      }


      const courseData = {
         title,
         description,
         price,
         image: {
            public_id: cloud_response.public_id,
            url: cloud_response.url,
         },
         creatorId:adminId, // Assuming you have the adminId from the request context
      }

      const course = await Course.create(courseData);
      res.json({
         message: "Course created successfully",
         course,
      });

   } catch (error) {
      console.log(error)
      res.status(500).json({
         error: "Error creating course",
      })
   }
}

export const updateCourse = async (req, res) => {
   const adminId  = req.adminId; // Assuming you have the adminId from the request context
   const { courseId } = req.params;
   const { title, description, price, image } = req.body;
   try {

const search = await Course.findOne({ _id: courseId, creatorId: adminId });search

      if(!search) {
         return res.status(404).json({ message: "Course Not Found" });
      }
      const course = await Course.updateOne({
         _id: courseId,
         creatorId: adminId, // Ensure the course belongs to the admin
      }, {
         title,
         description,
         price,
         image: {
            public_id: image.public_id,
            url: image.url,
         },

      }
      )
      res.status(201).json({
         message: "Course updated successfully",
         course,
      })

   } catch (error) {
      res.status(500).json({ error: "Error in course updating" });
      console.log(error);
   }
}

export const deleteCourse = async (req, res) => {
   const adminId  = req.adminId; // Assuming you have the adminId from the request context
   const { courseId } = req.params;
   try {
      const course = await Course.findOneAndDelete({ _id: courseId,
         creatorId: adminId, // Ensure the course belongs to the admin
       })
         ;
      if (!course) {
         return res.status(404).json({ message: "Course Not Found" });
      }
      res.status(200).json({message:"Coourse delete successfully"});;

   } catch (error) {
      res.status(500).json({errors:"Error in course deleting" });

   }
}

export const getCourses=async(req,res)=>{
   try {
      const course=await Course.find({});
      res.status(200).json({
         course,
      })
     if(!course){
      return res.status(404).json({message:"Course not found"});
     }      
   } catch (error) {
      
      res.status(500).json({error:"Error in getting courses"});
      console.log(error);
   }
}

export const courseDetails=async(req,res)=>{
   const {courseId}=req.params;
   try {
      const course=await Course.findById(courseId);
      if(!course){
         return res.status(404).json({message:"Course not found"});
      }
      res.status(201).json({
         course,
      })
      
   } catch (error) {
      res.status(500).json({error:"Error in getting course details"});
      console.log(error);
      
   }
}
 
import Stripe from 'stripe';

import config from '../config.js';
const stripe = new Stripe(config.STRIPE_SECRET_KEY);


console.log(config.STRIPE_SECRET_KEY)
export const buyCourses= async(req,res)=>{
   const {userId}=req;
   const {courseId}=req.params;
   try {
      const course= await Course.findById(courseId);
      if(!course){
         return res.status(404).json({erros:"Course not Found!!"});
      }
      const existingPurchase=await Purchase.findOne({
         userId,
         courseId,
      });
      if(existingPurchase){
         return res.status(400).json({errors:"You have already purchased this course"});
      }

      // Create a payment intent with the course price
        const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
      const newPurchase = await Purchase.create({
         userId,
         courseId,
      });
      newPurchase.save();
      res.status(201).json({
         message: "Course purchased successfully",
      course,
       clientSecret: paymentIntent.client_secret
      });

      
   } catch (error) {
         res.status(500).json({ errors: "Error in course buying" });
         console.log("error in course buying ", error);
   }
}