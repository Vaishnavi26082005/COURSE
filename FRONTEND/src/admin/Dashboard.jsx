import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo.png";
import toast from "react-hot-toast";
import axios from "axios";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";  

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await axios.post("https://course-4h17.onrender.com/api/v1/admin/logout", {},
       { withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
  return (
     <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-950 to-blue-300">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 flex justify-between items-center bg-gray-900 text-white">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-200 border-4 border-gray-900 rounded-2xl p-5 transition-all duration-300 
        ${sidebarOpen ? "block" : "hidden"} md:block md:w-64`}
      >
        <div className="flex items-center flex-col mb-10">
          <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 hover:scale-105 text-white py-2 rounded transition">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 hover:scale-105 text-white py-2 rounded transition">
              Create Course
            </button>
          </Link>
          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 text-white py-2 rounded transition">
              Home
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-white py-2 rounded transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center text-white font-extrabold text-3xl p-4 text-center">
        Welcome!!!
      </div>
    </div>
  );
}


export default Dashboard;