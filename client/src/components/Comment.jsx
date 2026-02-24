import React, { useState } from "react";
import { FaComments } from "react-icons/fa6";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Showtoast } from "../helpers/Showtoast";
import CommentList from "./CommentList";

export default function Comment({props}) {
  const[newComment,setNewComment] = useState()
  const user = useSelector(state => state.user)
  const formSchema = z.object({
    comment: z.string().min(3, "must be atleast 3 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const newValues = {...values,blogid:props.blogid,author:user.user._id}
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comment/add`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newValues),
      });
      const data = await response.json();
      if (!response.ok) {
        Showtoast("error", data.message);
        return;
      }
      setNewComment(data.comment)
      form.reset();
      Showtoast("success", data.message);
    } catch (error) {
      Showtoast("error", error.message);
    }
  };
  
  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold">
        <FaComments className="text-violate-500" />
        Comment
      </h4>
      {
        user &&user.isLoggedIn ?
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-3">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="type your comment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      :
      <Button asChild>
        <Link to="/sign-in">Sign In</Link>
      </Button>
      }
       <div className="mt-3">
          <CommentList props={{blogid:props?.blogid,newComment:newComment}}/>
      </div>
    </div>
  );
}

