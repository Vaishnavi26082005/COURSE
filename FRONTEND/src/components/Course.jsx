 import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import logo from "../../public/logo.png";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";



function Course() {
  const [courses, setCourses] = React.useState([])
  const[isLoggedIn,setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 
  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(" http://localhost:4000/api/v1/course/courses", {
          withCredentials: true,
        });
        // console.log(response.data.course);
        setCourses(response.data.course);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        
      }
    };
    fetchCourses();
  }, []);

   const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };


  const toggleSidebar = () => {
     setIsSidebarOpen(!isSidebarOpen);
   };
   useEffect(() => {
     const token= localStorage.getItem("user");
     if(token){
       setIsLoggedIn(true);
 
     }else{
       setIsLoggedIn(false);
     }
 
   })
  return (
    <div className="bg-gradient-to-r from-blue-950 to-blue-300 ">
      <div className="flex bg-gradient-to-r from-blue-950 to-blue-300 ">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-r from-blue-950 to-blue-400  w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4 ">
              <a href="/" className="flex items-center text-gray-300">
                <RiHome2Fill className="mr-2 " /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-300 font-bold">
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="mb-4 ">
              <a href="/purchases" className="flex items-center text-gray-300">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
           
            <li>
              {isLoggedIn ? (
                <Link to={"/"}
                  
                  className="flex items-center text-gray-300"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2 " /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center text-gray-300  ">
                  <IoLogIn className="mr-2 " /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className=" w-full bg-gradient-to-r from-blue-950 to-blue-300 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-5xl  text-white font-bold">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border text-white border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-300" />
              </button>
            </div>

            <FaCircleUser className="text-4xl text-blue-500" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh] px-4 ">
          {loading ? (
            <p className=" ml-64 text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            // Check if courses array is empty
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-blue-800 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="rounded mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2 text-shadow-indigo-600">{course.title}</h2>
                  <p className="text-gray-300 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-xl text-white">
                      <span className="text-white line-through">5999</span>
                      &nbsp;&nbsp;₹{course.price}
                    </span>
                    <span className="text-green-300 font-bold">20% off</span>
                  </div>

                  {/* Buy page */}
                  <Link
                    to={`/buy/${course._id}`} 
                    className="bg-blue-600 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-400 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
    </div>
  )
}

export default Course