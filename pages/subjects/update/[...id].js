import Layout from '../../../components/Layouts/Layout'
import React from 'react'
import { Select,MenuItem} from '@mui/material';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const  Updatesubject = () => {
    const router = useRouter();
const {id} = router.query;
const [subject, setSubject] = useState("");
const [title, setTitle] = useState("");
const [code, setCode] = useState("");
const [isError,setIsError]=useState(""); 
  const { data: session } = useSession();

const payLoadData = {
  code:code,
  title:title, }
  
  useEffect(() => {
    console.log(`/subjects/get_update/${id}`);
    axios.get(`/subjects/get_update/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
        .then((res) => {
            setSubject(res.data);
            setCode(res.data.code);
            setTitle(res.data.title);
        })
        .catch((error) => {
            setIsError(error);
        });
  }, [id,session]);

  const postData = async () => {
 
      axios.patch(`/subjects/update/${id}`, payLoadData, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }})
        .then((res) => {
          Swal.fire({
            title: "Sucess!",
            text:"Subject Updated Successfully!",
            icon: "success"
          });
          console.log;
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
  
    console.log(code);
    console.log(title);
    await postData();
  };




  return (
    <Layout>
      
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Update Subject
        </div> 
      <CardContent>
          <form action="" method="post" onSubmit={handleSubmit} >
      <div className="md:flex flex-col m-2  items-center mt-6 mx-20">
          <div className="w-full md:w-2/5 mt-2 flex flex-col">
            <label className="font-semibold  text-md leading-none">Code</label>
            <input type="name"
              name="name"
              value={code}
              onChange={(e) => { setCode(e.target.value) }}
              className="  leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-3  border rounded-md border-gray-500  "  />
          </div> 
        
  <div className="w-full md:w-2/5 mt-2 flex flex-col">
            <label className="font-semibold  text-md leading-none ">Title</label>

            <input type="name"
              name="name"
              value={title}
              onChange={(e) => { setTitle(e.target.value) }}
              className="  leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-3  border rounded-md border-gray-500  "
              />
  </div>

          </div>
      
       
    
        <div className=" flex w-full justify-center items-center mt-10 gap-8">
        <Link href='/subjects'>
          <button type='reset' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Update</button>
        </div>

      </form>

      
      </CardContent>
     
    </Card>
       
    </Layout>
  )
}

export default Updatesubject