import React,{useState} from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { LogIn, Menu, Search, X } from "lucide-react";
import {useClerk, UserButton, useUser } from "@clerk/react";



const Navbar = () => {

  const [isOpen,setIsOpen]=useState(false);
  const {user}=useUser();
  const {openSignIn}=useClerk()
  
  return (
    <div className="fixed top-0 left-0 z-50 w-full  p-5 justify-between flex items-center md:px-16 lg:px-36 ">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
                    max-md:text-lg z-50 flex flex-col md:flex-row items-center
                     max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen
                      md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
                      border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full': 'max-md:w-0' } `}
      >
        <X className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" onClick={()=>setIsOpen(!isOpen)} />
         {/* now for clickable link */}
        <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/">Home</Link>
        <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/movies">Movies</Link>
        <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/">Theaters</Link>
        <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/">Releases</Link>
        <Link onClick={()=>{scrollTo(0,0);setIsOpen(false)}} to="/favorite">Favorites</Link>
      </div>

    {/* for search and button */}
      <div className="flex items-center gap-8">
        <Search className="max-md:hidden  w-8 h-8 cursor-pointer" />

        {/* we r going to use clerk */}
        {
          !user ? (
            <button onClick={openSignIn} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">
          Login

        </button>

          ):(

          <UserButton/>


          )
        }



        
      </div>

      <Menu className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer " onClick={()=> setIsOpen(!isOpen)} /> 
        
    </div>
  );
};

export default Navbar;
