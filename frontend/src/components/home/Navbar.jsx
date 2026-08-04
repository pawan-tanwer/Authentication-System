import React, { useContext, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { Link, NavLink } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {type,setType,isAuthentication,user,profileImage,allUsers} = useContext(StoreContext);
  useEffect(()=>{
    console.log("user:",user);
  },[])
  return (
    <div className=" w-full h-auto bg-[#090D16]  text-white px-12 py-3 flex items-center justify-between">
      <div className="flex  items-center ">
        <Link to='/'>
          <img src={`/logo.png`} className="h-14 cursor-pointer" alt="" />
        </Link>
        <h1 className="font-medium text-lg">SecureAuth</h1>
      </div>
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
         max-md:text-lg z-50 flex flex-col md:flex-row items-center
         max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
         min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
         border-gray-300/20 overflow-hidden transition-[width] duration-300 
         ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}
      >
        <RxCross2
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <NavLink
          to="/"
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          className={({ isActive }) =>
            `relative pb-1 transition-all duration-300 ${
              isActive
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-300 hover:text-white border-b-2 border-transparent"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          onClick={() => {
            (scrollTo(0, 0), setIsOpen(!isOpen));
          }}
          to="/features"
          className={({ isActive }) =>
            `relative pb-1 transition-all duration-300 ${
              isActive
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-300 hover:text-white border-b-2 border-transparent"
            }`
          }
        >
          Features
        </NavLink>
        <NavLink
          onClick={() => {
            (scrollTo(0, 0), setIsOpen(!isOpen));
          }}
          to="/security"
          className={({ isActive }) =>
            `relative pb-1 transition-all duration-300 ${
              isActive
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-300 hover:text-white border-b-2 border-transparent"
            }`
          }
        >
          Security
        </NavLink>
        <NavLink
          onClick={() => {
            (scrollTo(0, 0), setIsOpen(!isOpen));
          }}
          to="/about"
          className={({ isActive }) =>
            `relative pb-1 transition-all duration-300 ${
              isActive
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-300 hover:text-white border-b-2 border-transparent"
            }`
          }
        >
          About
        </NavLink>
      </div>
      <div className="max-md:hidden flex gap-3">
        {
          isAuthentication? <Link to="/profile"><img className="size-10 rounded-full outline-none cursor-pointer" src={profileImage} alt="" /></Link>
          :<div className="flex gap-2">
            <Link to='/' onClick={()=>setType("Login")} className="border rounded-2xl border-blue-600 py-2 px-5 cursor-pointer">Login</Link>
        <Link to='/' onClick={()=>setType("Register")} className=" rounded-2xl bg-blue-600 py-2 px-5 text-amber-50 cursor-pointer ">
          Get Started
        </Link>
          </div>
        }
      </div>
      <div className="md:hidden">
        <TiThMenu
          className="max-md:ml-4 w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
};

export default Navbar;
