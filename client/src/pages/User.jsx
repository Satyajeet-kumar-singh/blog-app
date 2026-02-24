import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState } from "react";
import usericon from "../assets/images/user.png"
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
import moment from "moment";

export default function User() {
  const[refresh,setRefresh] = useState(false)

   const {
      data,
      loading,
      error,
    } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/user/get-all-user`, {
      method: "GET",
      credentials: "include",
    },[refresh]);

    console.log("user",data)

    const handleDelete=async(id)=>{
      const response = await deleteData(`${import.meta.env.VITE_API_BASE_URL}/user/delete/${id}`)
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
        
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Dated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {data && data.user?.length > 0 ?

                  data?.user.map(user=>
                   <TableRow key={user._id}>
                      <TableCell>{user?.role}</TableCell>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell><img src={user?.avatar || usericon} alt={user.name} className="w-8 h-8"/></TableCell>
                      <TableCell>{moment(user?.createdAt).format("DD-MM-YYYY")}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button onClick={()=>{handleDelete(user?._id)}} variant="outline" className="hover:bg-violet-500 hover:text-white">
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
