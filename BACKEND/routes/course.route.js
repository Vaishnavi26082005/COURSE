import express from 'express';
import { buyCourses, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from '../controllers/course.controller.js';
import userMiddleware from '../middleware/user.mid.js';
 
const router=express.Router();

router.post("/create",createCourse);
router.put("/update/:courseId",updateCourse);
router.delete("/delete/:courseId",deleteCourse);
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails);

router.post("/buy/:courseId",userMiddleware,buyCourses)

export default router;