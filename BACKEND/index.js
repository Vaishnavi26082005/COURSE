import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js'

import courseRoute from './routes/course.route.js'
 
const app= express();
dotenv.config();

const port = process.env.PORT||3001;
connectDB();
app.get("/",(req,res)=>{
    res.send("hi youll be fine");
})

app.use("api/v1/course",courseRoute);
app.listen(port,()=>[
    console.log(`server is listening on port ${port}`)
]);