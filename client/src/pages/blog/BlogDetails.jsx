import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";
import { deleteData } from "@/helpers/handleDelete";
import useFetch from "@/hooks/UseFetch";
import { Showtoast } from "@/helpers/Showtoast";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


export default function BlogDetails() {
  const [refresh, setRefresh] = useState(false);

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${import.meta.env.VITE_API_BASE_URL}/blog/get-all`,
    {
      method: "GET",
      credentials: "include",
    },
    [refresh]
  );

  const handleDelete = (id) => {
    const response = deleteData(
      `${import.meta.env.VITE_API_BASE_URL}/blog/delete/${id}`
    );
    if (response) {
      setRefresh(!refresh);
      Showtoast("success", "Data deleted");
    } else {
      Showtoast("error", "Data not deleted");
    }
  };

  console.log(blogData)

  if (loading) return <Loading />;

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild>
              <Link to="/blog/add">Add Blog</Link>
            </Button>
          </div>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Dated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogData?.blog &&
                blogData?.blog?.length > 0 ? (
                  blogData?.blog.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>{blog?.author?.name}</TableCell>
                      <TableCell>{blog?.category?.name}</TableCell>
                      <TableCell >{blog?.name}</TableCell>
                      <TableCell >{blog?.slug}</TableCell>
                      <TableCell>{blog?.createdAt}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="hover:bg-violet-500 hover:text-white"
                        >
                          <Link to={`/blog/edit/${blog._id}`}>
                            <FaRegEdit />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete(blog._id);
                          }}
                          variant="outline"
                          className="hover:bg-violet-500 hover:text-white"
                        >
                          <FaTrash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="3">Data not found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
