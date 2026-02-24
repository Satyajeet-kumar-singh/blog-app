import React from "react";
import { Card, CardContent } from "./ui/card";
import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";
import { SlCalender } from "react-icons/sl";
import usericon from "@/assets/images/user.png"
import moment from "moment";
import { Link } from "react-router-dom";

export default function BlogCard({props}) {
    console.log("blog card",props)
  return (
    <Link to={`/blog/${props.category.slug}/${props.slug}`}>
    <Card className="pt-5">
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-2">
            <Avatar>
              <AvatarImage src={props.author.avatar || usericon}/>
            </Avatar>
            <span>{props.author.name}</span>
          </div>
          {props.author.role === "admin" && 
          <Badge variant="outline" className="bg-violet-100">admin</Badge>}
        </div>

        <div className="my-2">
            <img src={props.featuredImage} alt="image" className="rounded"/>
        </div>

        <div>
            <p className="flex items-center gap-2 mb-2">
              <SlCalender />
              <span>{moment(props.createAt).format("DD-MM-YY")}</span>
            </p>
            <h2 className="text-2xl font-bold line-clamp-2">{props.name}</h2>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
