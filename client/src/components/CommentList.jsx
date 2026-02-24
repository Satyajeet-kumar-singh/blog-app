import useFetch from "@/hooks/UseFetch";
import React from "react";
import Loading from "./Loading";
import { Avatar, AvatarImage } from "./ui/avatar";
import usericon from "../assets/images/user.png"
import moment from "moment";
import { useSelector } from "react-redux";

export default function CommentList({ props }) {
  const user = useSelector(state => state.user)
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/comment/get/${props.blogid}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  console.log("comment list", data);

  if (loading) return <Loading />;

  return (
    <div>
      <h4 className="text-2xl font-bold">
        {
          props.newComment ? 
          <>
          {data && data.comments.length + 1}
          </>
          :
          <>
          {data && data.comments.length}
          </>
        } Comments
      </h4>
      <div className="mt-5">
        {props.newComment &&
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={user?.user?.avata4r || usericon} />
          </Avatar>
          <div>
            <p className="font-bold">{user?.user?.name}</p>
            <p>{moment(props?.newComment?.createdAt).format("DD-MM-YY")}</p>
            <div className="py-2">{props?.newComment?.comment}</div>
          </div>
        </div>
      }

      {data && data.comments.length > 0 &&
        data.comments.map(comment =>
          <div key={comment._id} className="flex gap-2">
          <Avatar>
            <AvatarImage src={comment?.author?.avatar || usericon} />
          </Avatar>
          <div>
            <p className="font-bold">{comment?.auhtor?.name}</p>
            <p>{moment(comment?.createdAt).format("DD-MM-YY")}</p>
            <div className="py-2">{comment?.comment}</div>
          </div>
        </div>
        )
      }

      </div>
    </div>
  );
}
