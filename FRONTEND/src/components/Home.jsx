import React, { use, useEffect, useRef } from 'react'
import * as THREE from 'three'
import HALO from 'vanta/dist/vanta.halo.min'
import logo from '../../public/logo.png'
import { Link } from 'react-router'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from 'axios'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
function Home() {
  const vantaRef = useRef(null)
  const vantaEffect = useRef(null)

  useEffect(() => {

    if (!vantaEffect.current) {
      vantaEffect.current = HALO({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: 0x000000,
        baseColor: 0x5c7bc6
      })
    }

    // Handle window resize
    const handleResize = () => {
      if (vantaEffect.current) {
        vantaEffect.current.resize()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const [courses, setCourses] = React.useState([])
  const[isLoggedIn,setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    const token= localStorage.getItem("user");
    if(token){
      setIsLoggedIn(true);

    }else{
      setIsLoggedIn(false);
    }

  })
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
    
  },[])

const handleLogout = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/v1/user/logout", {
      withCredentials: true,
    });
    toast.success(response.data.message);
    setIsLoggedIn(false);
    localStorage.removeItem("user"); // Optional: clear token
  } catch (error) {
    console.log("error in handleLogout ", error);
    toast.error(error.response?.data?.errors || "Logout failed");
  }
};

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(" http://localhost:4000/api/v1/course/courses", {
          withCredentials: true,
        });
        // console.log(response.data.course);
        setCourses(response.data.course);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);


 
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div
      className='bg'
      ref={vantaRef}
      style={{
        height: '100vh',
        width: '100%',
       
        top: 0,
        left: 0
      }}
    >
      {/* <div className='bg-gradient-to-r from-blue-950 to-blue- '> */}
      <div className="h-screen text-white mx-auto container relative z-10">
        {/* Header */}
        <header className='flex items-center justify-between  p-6'>
          <div className='flex items-center gap-2'>
            <img src={logo} className="w-10 h-10 rounded-full" />
            <h1 className='text-2xl text-blue-400 font-bold'>Skill-Nest</h1>
          </div>
          <div className='flex items-center gap-4'>
            {
              isLoggedIn?(<button onClick={handleLogout}
                className='w-full bg-blue-500 hover:bg-blue-300  hover:text-black text-white py-1.5 px-5 rounded-md transition'>Logout</button>
              
            ):(
              <>
              <Link to={"/login"} className='w-full bg-blue-500 hover:bg-blue-300  hover:text-black hover:scale-105 text-white py-1.5 px-5 rounded-md transition'
              >Login
              </Link>
            <Link to={"/signup"} className='w-full bg-blue-500  hover:bg-blue-300  hover:text-black hover:scale-105 text-white py-1.5 px-5 rounded-md transition'>
              Signup
              </Link>
            </>
            )
            }
          </div>
        </header>

        {/* Main Content */}
        <section className='text-center mx-auto container mb-28 '>
          <h1 className='text-4xl font-semibold text-blue-400 mb-1.5'>Skill-Nest</h1>
         
          
          <p className="text-gray-400 ">Sharpen your skills with expertly crafted courses at Skill Nest—your destination to learn, grow, and achieve more.</p>
         
          <div className='space-x-4 mt-8'>
            <Link to={"/courses"} className='bg-green-500 text-white  py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'> Explore Courses</Link>
            <Link to={"https://www.youtube.com/results?search_query=full+stack+playlist"}className='bg-white text-black rounded py-3 px-6 font-semibold hover:bg-green-500 duration-300 hover:text-white'> Course Videos</Link>
          </div>
        </section>
        <section className='mb-6'>
          <Slider {...settings}>
           {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0  transition-transform duration-300 transform hover:scale-105 ">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image?.url}
                      alt=""
                    />
                    <div className="p-6 text-center ">
                      <h2 className="text-xl font-bold text-white mb-2">
                        {course.title}
                      </h2>
                      <Link to={`/buy/${course._id}`} className="mt-8 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-200 hover:text-black duration-300">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
  
          </Slider>
        </section>


        <hr />
        {/* Footer */}
        <footer className='grid grid-cols-1 mx-auto container md:grid-cols-3 my-12'>

          <div className='flex flex-col  items-center md:items-start'>
            <div className='flex items-center gap-2 mx-auto container'>
              <img src={logo} className="w-8 h-8 rounded-full" />
              <h1 className='text-lg text-blue-400 font-semibold'>Skill-Nest</h1>
            </div>
            <div className='mt-3 ml-2 md:ml-8'>
              <p className='mb-2'>Follow us </p>
              <div className='flex items-center gap-4 mt-2'>
                <a href="">
                  <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                </a>
                <a href="">
                  <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                </a>
                <a href="">
                  <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4 text-blue-300">Connects</h3>
              <ul className=" space-y-2 text-gray-200">
                <li href="" className="hover:text-white cursor-pointer duration-300">
                  <a
                    href="https://www.youtube.com/results?search_query=web+development"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white cursor-pointer duration-300"
                  >
                    YouTube – Learn Development
                  </a>
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  <a
                    href="https://t.me/jobs_and_internships_updates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white cursor-pointer duration-300"
                  >
                    Telegram – About Job and Internship Updates
                  </a>
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  <a
                    href="https://github.com/Vaishnavi26082005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white cursor-pointer duration-300"
                  >
                    Github-Vaishnavi Sharma!
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                copyrights &#169; 2024
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
    // </div>
  )
}

export default Home
