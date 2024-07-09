import Layout from '../../components/Layouts/Layout'
import React from 'react'
import { Select,MenuItem} from '@mui/material';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
export default function  createsubject() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  const { data: session } = useSession();
const payLoadData = {
    code:code,
    title:title, }

  const postData = async () => {

    axios.post('subjects/create', payLoadData , {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        Swal.fire({
          title: "Sucess!",
          text:"Subject Created Successfully!",
          icon: "success"
        });
       })
      .catch((err) => {
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'An error Occured!',
          text: err.response.data.message,
        });
      })
 
}
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData();
  };




  return (
    <Layout>
      
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Create Subject
        </div> 
      <CardContent>
          <form action="" method="post" onSubmit={handleSubmit} >
        <div className="md:flex flex-col m-2  items-center mt-6 mx-20">
          <div className="w-full md:w-2/5 mt-5 flex flex-col">
            <label className="font-semibold  text-md leading-none">Code</label>
            <input type="name"
              name="name"
              value={code}
              placeholder='Code Name'
              onChange={(e) => { setCode(e.target.value) }}
              className="leading-none mt-3 text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500  " />
          </div> 
        
       <div className="w-full md:w-2/5 mt-5 flex flex-col">
            <label className="font-semibold  text-md leading-none ">Title</label>

            <input type="name"
              name="name"
              value={title}
              placeholder='Title Name'
              onChange={(e) => { setTitle(e.target.value) }}
              className="leading-none text-gray-900 p-3 mt-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500  " />

          </div>

          </div>
      
         
     
        
      
        <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">
      <Link href={"/subjects"}>
          <button type='reset' className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Create</button>
        </div>

      </form>
      
      </CardContent>
     
    </Card>
        
   
    




    </Layout>
  )
}

