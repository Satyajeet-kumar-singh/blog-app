import React, { useState } from "react";
import logo from "@/assets/images/logo-white.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import SearchBox from "./SearchBox";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from "@/assets/images/user.png"
import { FaUserAstronaut } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { removeUser } from "@/redux/user/userSlice";
import { Showtoast } from "@/helpers/Showtoast";
import { CiSearch } from "react-icons/ci";
import { IoMenuSharp } from "react-icons/io5";
import { useSidebar } from "./ui/sidebar";


export default function Topbar() {
  const {toggleSidebar} = useSidebar()
  const [showSearch,setShowSearch] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state)=>state.user)

  const handleClick=async()=>{
    // alert("hiiiii")
     try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
    
          if (!response.ok) {
            Showtoast("error", data.message);
            return;
          }
          dispatch(removeUser());
          navigate("/sign-in");
          Showtoast("success", data.message);
        } catch (error) {
          Showtoast("error", error.message);
        }
  }

  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-purple-200 px-5 border-b">
      <div className="flex justify-center items-center gap-2">
        <button onClick={toggleSidebar} className='md:hidden' type="button">
          <IoMenuSharp size={25}/>
        </button>
        <img src={logo} alt="logo" className="md:w-auto w-44" />
      </div>
      <div className="w-[500px]">
        <div className={`md:relative absolute md:block left-0 w-full md:top-0 top-12 md:p-0 p-5 ${showSearch ? "block" : "hidden"}`}>
          <SearchBox/>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button type="button" onClick={()=>{setShowSearch(!showSearch)}} className="md:hidden block">
          <CiSearch size={25}/>
        </button>

        {!user.isLoggedIn ? 
        <Button asChild className="rounded-full">
          <Link to="/sign-in">
            <IoLogIn />
            Sign-up
          </Link>
        </Button>
        :
         <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={user.user.avatar || usericon} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <p>{user.user.name}</p>
              <p className="text-xs">{user.user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
              <FaUserAstronaut />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/blog/add">
              <FaPlus />
                Create blog
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
             <DropdownMenuItem onClick={()=>{handleClick()}}>
              <CiLogout  color="red"/>
               Logout
            </DropdownMenuItem>
          </DropdownMenuContent>  
      </DropdownMenu>
      } 
        
      </div>
    </div>
  );
}
