import useFetch from "@/hooks/UseFetch";
import React, { useEffect, useState } from "react";
import { FaRegCommentAlt } from "react-icons/fa";

export default function CommentCount({ props }) {
  const { data, loading, error } = useFetch(
    `http://localhost:3000/api/comment/get-count/${props?.blogid}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  
  

  return (
    <button type="button" className="flex justify-between items-center gap-1">
        <FaRegCommentAlt />
        {data && data.commentCount}
    </button>
  );
}
