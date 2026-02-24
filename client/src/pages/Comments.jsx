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

export default function Comments() {
  const[refresh,setRefresh] = useState(false)

   const {
      data,
      loading,
      error,
    } = useFetch(`http://localhost:3000/api/comment/get-all-comment`, {
      method: "GET",
      credentials: "include",
    },[refresh]);

    console.log("comments",data)

    const handleDelete=async(id)=>{
      const response = await deleteData(`http://localhost:3000/api/comment/delete/${id}`)
      if(response){
        setRefresh(!refresh)
        Showtoast("success","Data deleted")
      }else {
        Showtoast("error","Data not deleted")
      }
    }

    if(loading) return <Loading/>

  return (
    <div className='w-[85%]'>
      <Card>
        
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog</TableHead>
                  <TableHead>Comment By</TableHead>
                  <TableHead>Dated</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {data && data.comments?.length > 0 ?

                  data?.comments.map(comment=>
                   <TableRow key={comment._id}>
                      <TableCell>{comment?.blogid?.name}</TableCell>
                      <TableCell>{comment?.author?.name}</TableCell>
                      <TableCell>{comment?.updatedAt}</TableCell>
                      <TableCell>{comment?.comment}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button onClick={()=>{handleDelete(comment?._id)}} variant="outline" className="hover:bg-violet-500 hover:text-white">
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

      </Card>
    </div>
  );
}
