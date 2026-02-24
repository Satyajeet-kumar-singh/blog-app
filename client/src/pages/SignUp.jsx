import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Showtoast } from "@/helpers/Showtoast";
import GoogleLogin from "@/components/GoogleLogin";  


export default function SignUp() {
  const navigate = useNavigate()

  const formSchema = z.object({
    name: z.string().min(3,"must be atleast 3 character long"),
    email: z.string().email(),
    password: z.string().min(8, "passwors must be atleast 8 character long"),
    confirmPassword : z.string().refine(data=> data.password === data.confirmPassword,"password and confirmPassword should be same"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirmPassword:""
    },
  });

  const onSubmit = async(values) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/register`,{
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body:JSON.stringify(values)
      })
      const data = await response.json()
      if(!response.ok){
        Showtoast("error",data.message)
        return
      }

      navigate("/sign-in")
      Showtoast("success",data.message)
    } catch (error) {
      Showtoast("error",error.message)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-100 p-5">
        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        <div>
        <GoogleLogin/>
        <div className="border-2 my-5 flex justify-center items-center">
          <span className="absolute bg-white text-sm">Or</span>
        </div>
        </div>
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
                      <Input placeholder="enter your name" {...field} />
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
                      <Input placeholder="enter your email" {...field} />
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
                      <Input placeholder="enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>confirm password</FormLabel>
                    <FormControl>
                      <Input placeholder="enter your confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
           <div className="mt-5">
             <Button type="submit" className="w-full">
              Sign up
            </Button>
            <div className="mt-5 text-sm flex justify-center items-center gap-2">
                <p>Already have account</p>
                <Link className="hover:underline" to="/sign-in">Sign in</Link>
            </div>
           </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
