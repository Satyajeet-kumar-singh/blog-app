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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import { Showtoast } from "@/helpers/Showtoast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/UseFetch";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { decode } from "entities";
import Loading from "@/components/Loading";

export default function EditBlog() {
  const {blogid} = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user);
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/category/all-category`, {
    method: "GET",
    credentials: "include",
  });

   const {
    data: blogData,
    loading: blogLoading
  } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/blog/edit/${blogid}`, {
    method: "GET",
    credentials: "include",
  },[blogid]);

  console.log("blog",blogData?.blog);

  const formSchema = z.object({
    category: z.string().min(3, "must be atleast 3 character long"),
    title: z.string().min(3, "must be atleast 3 character long"),
    slug: z.string().min(3, "must be atleast 3 character long"),
    blogContent: z.string().min(3, "must be atleast 3 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  useEffect(()=>{
    if(blogData){
      setFilePreview(blogData?.blog?.featuredImage)
      form.setValue("category",blogData?.blog?.category._id)
      form.setValue("title",blogData?.blog?.name)
      form.setValue("slug",blogData?.blog?.slug)
      form.setValue("blogContent",decode(blogData?.blog?.blogContent))
    }
  },[blogData])

  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    // console.log(data)
    form.setValue("blogContent", data);
  };

  useEffect(() => {
    const blogTitle = form.watch("title");
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [form.watch("title")]);

  const onSubmit = async (values) => {
    try {
      // console.log(values)
   
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/update/${blogid}`,{
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        Showtoast("error", data.message);
        return;
      }
      form.reset()
      setFile()
      setFilePreview()
      navigate("/blog")
      Showtoast("success", data.message);
    } catch (error) {
      Showtoast("error", error.message);
    }
  };

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  };

  if(blogLoading) return <Loading/>

  return (
    <div>
      <Card className="pt-10">
        <CardContent>
          <h1 className="text-2xl mb-5 font-bold">Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.category.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  value={category._id}
                                  key={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>title</FormLabel>
                      <FormControl>
                        <Input placeholder="enter blog title" {...field} />
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
              <div className="mb-3">
                <span>Featured image</span>
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed">
                        <img src={filePreview} alt="filepreview" />
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>blogContent</FormLabel>
                      <FormControl>
                        <Editor key={form.watch("blogContent")} intialData={field.value} onChange={handleEditorData} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full mt-8">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
