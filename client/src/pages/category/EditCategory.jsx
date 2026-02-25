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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import { Showtoast } from "@/helpers/Showtoast";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/UseFetch";

export default function EditCategory() {
  const { category_id } = useParams()

  const {
        data: categoryData, 
        loading,
        error,
      } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/category/show/${category_id}`, {
        method: "GET",
        credentials: "include",
      },[category_id]);

  console.log("category",categoryData)

  const formSchema = z.object({
    name: z.string().min(3, "must be atleast 3 character long"),
    slug: z.string().min(3, "must be atleast 3 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(()=>{
    const categoryName = form.watch("name")
    if(categoryName){
      const slug = slugify(categoryName,{lower:true})
      form.setValue("slug",slug)
    }
  },[form.watch("name")])

  useEffect(()=>{
    if(categoryData){
      form.setValue("name",categoryData.category.name)
      form.setValue("slug",categoryData.category.slug)
    }
  },[categoryData])

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/update/${category_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        Showtoast("error", data.message);
        return;
      }
      Showtoast("success", data.message);
    } catch (error) {
      Showtoast("error", error.message);
    }
  };
  return (
    <div>
      <Card className="pt-10 max-w-screen-md mx-auto">
        <CardContent>
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>slug</FormLabel>
                      <FormControl>
                        <Input placeholder="slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
