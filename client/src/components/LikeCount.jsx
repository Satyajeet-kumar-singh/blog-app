import { Showtoast } from "@/helpers/Showtoast";
import useFetch from "@/hooks/UseFetch";
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function LikeCount({props}) {
  const [likeCount,setLikeCOunt] = useState(0)
  const [hasLiked,setHasLiked] = useState(false)
  const user = useSelector(state => state.user)
    const { data:blogLikeCount, loading, error } = useFetch(
      `${import.meta.env.VITE_API_BASE_URL}/blog-like/get-like/${props?.blogid}/${user && user.isLoggedIn ? user.user._id : ""}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    useEffect(()=>{
      if(blogLikeCount){
        setLikeCOunt(blogLikeCount.likeCount)
        setHasLiked(blogLikeCount.isUserLiked)
      }
    },[blogLikeCount])

    const handleClick=async()=>{
      try {
        if(!user.isLoggedIn){
          return Showtoast("error","please logged in")
        }
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog-like/do-like`,{
          method: "POST",
          credentials:"include",
          headers : {"Content-Type" : "application/json"},
          body: JSON.stringify({user:user.user._id,blogid:props.blogid})
        })

        if(!response.ok){
          Showtoast("error",response.statusText)
        }

        const responseData = await response.json()
        setLikeCOunt(responseData.likeCount)
        setHasLiked(!hasLiked)
      } catch (error) {
        Showtoast("error",error.message)
      }
    }

  return (
    <button onClick={()=>{handleClick()}} type="button" className="flex justify-between items-center gap-1">
      {!hasLiked ?
      <FaRegHeart/>
      :
      <FaRegHeart color="red"/>
      }
      {likeCount}
    </button>
  );
}
