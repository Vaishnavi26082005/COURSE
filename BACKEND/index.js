import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js'

import courseRoute from './routes/course.route.js'
import userRoute from './routes/user.route.js'
import adminRoute from './routes/admin.route.js'
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
 
const app= express();
dotenv.config();

//middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]

}))

const port = process.env.PORT||3001;
connectDB();
app.get("/",(req,res)=>{
    res.send("hi youll be fine");
})
//defining routes
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",adminRoute);

//cloudinary config
 cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
});


//listening to the server hehe

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
});