import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const navigate = useNavigate()
  const [query,setQuery] = useState()
  const getInput=(e)=>{
    setQuery(e.target.value)
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    if(query){
      navigate(`/search?q=${query}`)
    }else{
      navigate(`/search`)
    }
  }
  return (
    <form onSubmit={(e)=>{handleSubmit(e)}}>
      <Input onChange={(e)=>{getInput(e)}} placeholder="Search here...." className="h-9 bg-gray-100 rounded-full w-100 text-center"/>
    </form>
  )
}
