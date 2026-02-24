import React from 'react'
import LoadingIcon from "@/assets/images/loading.svg"

export default function Loading() {
  return (
    <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center'>
      <img src={LoadingIcon} alt="loading icon" width={100}/>
    </div>
  )
}
