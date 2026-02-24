import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import useFetch from "@/hooks/UseFetch";
import React from "react";
import { useParams } from "react-router-dom";
import { BiCategory } from "react-icons/bi";

export default function BlogByCategory() {
    const category = useParams()
    console.log("params",category)
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(`http://localhost:3000/api/blog/get-blog-by-category/${category.category}`, {
    method: "GET",
    credentials: "include",
  },[category.category]);

  if (loading) return <Loading />;
  return (
    <>
    <div className="flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-3">
        <BiCategory />
        <h4>{blogData && blogData.categoryData?.name}</h4>
    </div>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
      {blogData && blogData.blog.length > 0 ? (
        blogData.blog.map((blog) => <BlogCard key={blog._id} props={blog} />)
      ) : (
        <div>Data not found</div>
      )}
    </div>
    </>
  );
}
