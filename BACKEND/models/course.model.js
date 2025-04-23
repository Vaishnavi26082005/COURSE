import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        reuired:true,

    }
    ,description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true,
    }

})

export const Course=mongoose.model("Course",courseSchema);

