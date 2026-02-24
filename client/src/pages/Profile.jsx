import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Showtoast } from "@/helpers/Showtoast";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import UseFetch from "@/hooks/UseFetch";
import Loading from "@/components/Loading";
import { FaCamera } from "react-icons/fa";
import Dropzone from "react-dropzone";
import usericon from "@/assets/images/user.png"
import { setUser } from "@/redux/user/userSlice";

export default function Profile() {
  const user = useSelector((state) => state.user);
  const[filePreview,setFilePreview] = useState()
  const[file,setFile] = useState()
  //custom hook
  const {
    data: userData,
    loading,
    error,
  } = UseFetch(`${import.meta.env.VITE_API_BASE_URL}/user/get-user/${user.user._id}`, {
    method: "GET",
    credentials: "include", 
  });

  console.log(userData);

  const dispatch = useDispatch();

  const formSchema = z.object({
    name: z.string().min(3, "name must be 3 character long."),
    email: z.string().email(),
    bio: z.string().min(3, "bio must be 3 character long"),
    password: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio,
      });
    }
  }, [userData]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData()
      formData.append("file",file)
      formData.append("data",JSON.stringify(values))
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/update-user/${userData.user._id}`, {
        method: "PUT", 
        credentials: "include",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        Showtoast("error", data.message);
        return;
      }
      dispatch(setUser(data.user));
      Showtoast("success", data.message);
    } catch (error) {
      Showtoast("error", error.message);
    }
  };

  const handleFileSelection=(files)=>{
    const file = files[0]
    const preview = URL.createObjectUrl(file)
    setFile(file)
    setFilePreview(preview)
  }

  if (loading) return <Loading />;

  return (
    <Card className="max-w-screen-md mx-auto">
      <CardContent>
        <div className="flex justify-center items-center mt-10">
          <Dropzone onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group">
                  <AvatarImage
                    className="rounded-full size-28"
                    src={filePreview ? filePreview : userData?.user?.avatar || usericon}
                  />
                  <div
                    className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 
          -translate-y-1/2  flex justify-center items-center 
          bg-black bg-opacity-10 border-2 border-violet-500 rounded-full 
          group-hover:flex hidden"
                  >
                    <FaCamera color="#7c3aed" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>name</FormLabel>
                      <FormControl>
                        <Input placeholder="enter your name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>email</FormLabel>
                      <FormControl>
                        <Input placeholder="enter your email..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="enter your bio..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter your password..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Save chnages
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
