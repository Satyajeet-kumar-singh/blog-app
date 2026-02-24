import useFetch from '@/hooks/UseFetch';
import React from 'react'
import Loading from './Loading';
import { Link } from 'react-router-dom';

export default function RelatedBlog({props}) {
 const { data, loading, error } = useFetch(
      `${import.meta.env.VITE_API_BASE_URL}/blog/get-related-blog/${props?.category}/${props.currentBlog}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if(loading) return <Loading/>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Related Blogs</h2>
      <div>
        {data && data.relatedBlog.length > 0 
          ?
          data.relatedBlog.map(blog=>
            <Link key={blog._id} to={`/blog/${props.category}/${blog.slug}`}>
            <div className='flex items-center gap-2 mb-3'>
              <img className='w-[100px] h-[50] object-cover rounded' src={blog.featuredImage} alt="featured image" />
              <h4 className='line-clamp-2'>{blog.name}</h4>
          </div>
          </Link>
          )
        :
        <div className='flex items-center gap-2'>
            No Related Blog
        </div>
        }
      </div>
    </div>
  )
}
