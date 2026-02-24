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
import logo from "@/assets/images/logo-white.png";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Showtoast } from "@/helpers/Showtoast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import GoogleLogin from "@/components/GoogleLogin";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "passwors must be atleast 8 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        Showtoast("error", data.message);
        return;
      }
      dispatch(setUser(data.user));
      navigate("/");
      Showtoast("success", data.message);
    } catch (error) {
      Showtoast("error", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-100 p-5">
        <div className="flex items-center justify-center mb-2">
          <Link to='/'><img src={logo} alt="logo" /></Link>
        </div>
        <h1 className="text-2xl font-bold text-center mb-5">
          log into account
        </h1>
        <div>
          <GoogleLogin />
          <div className="border-2 my-5 flex justify-center items-center">
            <span className="absolute bg-white text-sm">Or</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input placeholder="enter your password..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <div className="mt-5 text-sm flex justify-center items-center gap-2">
                <p>Don&apos;t have account</p>
                <Link className="hover:underline" to="/sign-up">
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
