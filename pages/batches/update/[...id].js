import Layout from '../../../components/Layouts/Layout'
import React from 'react'
import { Select,MenuItem} from '@mui/material';
import { useState,useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const  Updatebatch = () => {
    const router = useRouter();
const {id} = router.query;
const [batch, setBatch] = useState("");
const [reg_Start_date, setReg_Start_date] = useState("");
const [reg_End_date, setReg_End_date] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [status, setStatus] = useState('');
  const [reg_status, setReg_status] = useState('');
  const [isActive, setIsActive] = useState(false);
 const [isEditable, setIsEditable] = useState(false);
  const [ isError,  setIsError] = useState("");
  const { data: session } = useSession();
  const payLoadData = {
  
    "end_date":end_date,
    "registration_status":reg_status,
    "registration_startdate":reg_Start_date,
    "registration_enddate":reg_End_date

  } 
  
  useEffect(() => {
    console.log(`/batches/get_update/${id}`);

    axios.get(`/batches/get_update/${id}` , {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
        .then((res) => {
            setBatch(res.data.batch.name);
            setStart_date(res.data.batch.start_date
              );
              setEnd_date(res.data.batch.end_date
                );
            setStatus(res.data.batch.is_current  );
            setReg_status(res.data.batch.registration_status
              );
              setIsEditable(res.data.isEditable
                );
            console.log(res.data);
  
        })
        .catch((error) => {
            setIsError(error);
        });
  }, [id,session]);
 
  const postData = async () => {
 if(isEditable === true){
    if ( end_date>start_date) {
      axios.patch(`/batches/update/${id}`, payLoadData , {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }})
        .then((res) => {
          Swal.fire({
            title: "Sucess!",
            text:"Batch Updated Successfully!",
            icon: "success"
          });
          console.log;
  })
        .catch((error) => {
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'An error Occured!',
            text: error.response.data.message,
          });
        })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'An error Occured!',
        text: "End Date must be taken  biger than Start Date",
      });
    }}else{
      Swal.fire({
      icon: 'error',
      title: 'An error Occured!',
      text: "Batch is InActive", 
   
    });
    if (typeof window !== 'undefined') {
      router.push('/batches')}
  }
  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(end_date);
    // console.log(name);
    console.log(start_date);
    await postData();
  };


  
  return (
    <Layout>
        <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Update Batch
        </div> 
      <CardContent>
         <form action="" method="post" onSubmit={handleSubmit} >
   <div className="md:flex md:flex-row items-center mx-20  gap-36">
          <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
            <label className="font-semibold  text-md leading-none">Name</label>
            <input readOnly type="name"
              name="name"
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={batch} />
          </div> 
        
             <div className="w-full flex flex-col mt-5 md:w-1/2">
            <label className="font-semibold  text-md leading-none">Status</label>
          
                     <label className="relative inline-flex items-center cursor-pointer ml-auto  ">
                      <input  
                          checked={status} type="checkbox"  
                          value={status} 
                           className="sr-only peer"  />
                      <div
                        className="  group peer  ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-10 h-5  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39]peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-3 after:w-3 after:top-1 after:left-1   peer-checked:after:translate-x-5 peer-hover:after:scale-88 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                          
                      </div>
                    </label>
        
             
          </div> 
          </div>
      


    
      <div className="md:flex md:flex-row items-center mx-20  gap-36">

            <div className="w-full flex flex-col mt-5 md:w-1/2">
            <label className="font-semibold  text-md leading-none">Start Date</label>
            <input
            readOnly
              value= {new Date(start_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
              onChange={(e) => { setStart_date(e.target.value) }}
              
             className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md bord</div>
        
       er-gray-200" />
          </div>
         <div className="w-full flex flex-col mt-5 md:w-1/2">
            <label className="font-semibold  text-md leading-none"> Registration Status</label>
          
            <label className="relative inline-flex items-center cursor-pointer ml-auto  ">
                      <input  
                          checked={reg_status} type="checkbox"    value={reg_status}
                         onChange={(e) => setReg_status(e.target.checked)}
                          className="sr-only peer " />
                      <div
                        className="  group peer  ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-10 h-5  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39]peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-3 after:w-3 after:top-1 after:left-1   peer-checked:after:translate-x-5 peer-hover:after:scale-88 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                          
                      </div>
                    </label></div>

        </div>
        <div className="md:flex flex-row   items-center mx-20  gap-36">
      
           <div className="w-full flex flex-col mt-5 md:w-1/2">
            <label className="font-semibold  text-md  leading-none">End Date</label>
            <input
               disabled={!isEditable}
              value={end_date}
              onChange={(e) => { setEnd_date(e.target.value) }}
              type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
          </div>
          
<div className="w-full flex flex-col mt-5 md:w-1/2">
<label className="font-semibold  text-md leading-none"> Registration Start Date</label>
<input
   disabled={!isEditable}
  value={reg_Start_date}
  onChange={(e) => { setReg_Start_date(e.target.value) }}
  type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md bord</div>

er-gray-200" />
</div>
         </div>

         <div className="md:flex md:flex-row items-center mx-20  gap-36">
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
<label className="font-semibold  text-md  leading-none"> Registation End Date</label>
<input
   disabled={!isEditable}
  value={reg_End_date}
  onChange={(e) => { setReg_End_date(e.target.value) }}
  type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
</div>
<div className=" w-full md:w-1/2 flex justify-center items-center mt-5 md:gap-8 sm:gap-12 gap-2">
        <Link href='/batches'>
          <button className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Update</button>
        </div>
</div>
    
    

      </form>   
      
      </CardContent>
     
    </Card>
    </Layout>
  )
}

export default Updatebatch