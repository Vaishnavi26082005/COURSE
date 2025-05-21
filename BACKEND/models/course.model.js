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
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            reuired:true,
        }
    }

})

export const Course=mongoose.model("Course",courseSchema);

