import Loading from "@/components/Loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { useParams } from "react-router-dom";
import usericon from "@/assets/images/user.png"
import { decode } from "entities";
import Comment from "@/components/Comment";
import useFetch from "@/hooks/UseFetch";
import moment from "moment";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import RelatedBlog from "@/components/RelatedBlog";

export default function SingleBlogDetails() {
  const { blog,category } = useParams();
  const { data, loading, error } = useFetch(`http://localhost:3000/api/blog/get-blog/${blog}`,{
      method: "GET",
      credentials: "include",
    },[blog,category]);

  console.log("singleblogdetails",data)

  if(loading) return <Loading/>

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
        {
            data && data.blog && 
            <>
            <div className="border rounded md:w-[70%] w-full p-5">
                <h1 className="text-2xl font-bold mb-5">{data.blog.name}</h1>
                <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center gap-5">
                        <Avatar>
                            <AvatarImage src={data?.blog?.auhtor?.avatar || usericon}/>
                        </Avatar>
                        <div>
                            <p>{data?.blog?.author?.name}</p>
                            <p>{moment(data?.blog?.createdAt).format("DD-MM-YY")}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-5">
                        <LikeCount props={{blogid:data.blog._id}}/>
                        <CommentCount props={{blogid:data.blog._id}}/>
                    </div>
                </div>
                <div className="my-3">
                    <img src={data.blog.featuredImage} alt="featured image" className="rounded"/>
                </div>
                <div dangerouslySetInnerHTML={{__html:decode(data.blog.blogContent) || ``}}>

                </div>
                <div>
                    <Comment props={{blogid:data.blog._id}}/>
                </div>
            </div>
            </>
        }
        <div className="border rounded md:w-[30%] w-full p-5">
            <RelatedBlog props={{category:category,currentBlog:blog}}/>
        </div>
    </div>
  )
}
