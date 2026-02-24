import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState } from "react";
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
import useFetch from "@/hooks/UseFetch";
import Loading from "@/components/Loading";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { Showtoast } from "@/helpers/Showtoast";

export default function CategoryDetails() {
  const[refresh,setRefresh] = useState(false)

   const {
      data: categoryData,
      loading,
      error,
    } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/category/all-category`, {
      method: "GET",
      credentials: "include",
    },[refresh]);

    // console.log(categoryData?.category)

    const handleDelete=(id)=>{
      const response = deleteData(`${import.meta.env.VITE_API_BASE_URL}/category/delete/${id}`)
      if(response){
        setRefresh(!refresh)
        Showtoast("success","Data deleted")
      }else {
        Showtoast("error","Data not deleted")
      }
    }

    if(loading) return <Loading/>

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild>
              <Link to="/category/add">Add Category</Link>
            </Button>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {categoryData?.category && categoryData?.category?.length > 0 ?

                  categoryData?.category.map(category=>
                   <TableRow key={category._id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button asChild variant="outline" className="hover:bg-violet-500 hover:text-white">
                            <Link to={`/category/edit/${category._id}`}><FaRegEdit /></Link>
                        </Button>
                        <Button onClick={()=>{handleDelete(category._id)}} variant="outline" className="hover:bg-violet-500 hover:text-white">
                            <FaTrash />
                        </Button>
                      </TableCell>
                   </TableRow>
                  )
                   :
                   <TableRow>
                     <TableCell colSpan="3">
                        Data not found
                     </TableCell>
                   </TableRow>
                  }
              </TableBody>
            </Table>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
