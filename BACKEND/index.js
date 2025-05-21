import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js'

import courseRoute from './routes/course.route.js'
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
 
const app= express();
dotenv.config();

//middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const port = process.env.PORT||3001;
connectDB();
app.get("/",(req,res)=>{
    res.send("hi youll be fine");
})
//defining routes
app.use("/api/v1/course",courseRoute);

//cloudinary config
 cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
});




app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
});