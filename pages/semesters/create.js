import Layout from '../../components/Layouts/Layout'
import React from 'react'
import { Select,MenuItem} from '@mui/material';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const createsemster = () => {
  const [name, setName] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [status, setStatus] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { data: session } = useSession();

  const payLoadData = {
    "name":name,
    "start_date": start_date,
    "end_date":end_date ,
    "is_active": isActive,
  }

  const postData = async () => {
  if ( end_date>start_date) {
    axios.post('semesters/create', payLoadData , {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        Swal.fire({
          title: "Sucess!",
          text:"Semester Created Sucessfully",
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
  } else {

    Swal.fire({
      icon: 'error',
      title: ' Error ',
      text: 'End date need to be bigger then start date',
    });
  }

}
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(end_date);
    console.log(name);
    console.log(start_date);
    console.log(isActive);
    await postData(); 
  };




  return (
    <Layout>
      
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Create Semester
        </div> 
      <CardContent>
        
        <form action="" method="post" onSubmit={handleSubmit} >
      <div className="md:flex flex-col md:flex-row  gap-36 mx-20">
                        <div className="w-full md:w-1/2 flex flex-col mt-5">
            <label className="font-semibold  text-md leading-none">Name</label>
            <input type="name"
              name="name"
              value={name}
              placeholder='Semester Name'
              onChange={(e) => { setName(e.target.value) }}
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 " />
          </div> 
        
          <div className="w-full md:w-1/2 flex flex-col mt-5">
            <label className="font-semibold  text-md leading-none mb-3">Is Active</label>  <label className="relative inline-flex items-center cursor-pointer ml-auto  ">
                      <input  
                           checked={isActive} value={isActive}  
                           onChange={(e) => setIsActive(e.target.checked === 'true')}
                          className="sr-only peer " />
                      <div
                        className="  group peer  ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-10 h-5  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39]peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-3 after:w-3 after:top-1 after:left-1   peer-checked:after:translate-x-5 peer-hover:after:scale-88 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                          
                      </div>
                    </label>
                          


          </div>

          </div>
      
         
          <div className="md:flex flex-col md:flex-row  gap-36 mx-20">
                        <div className="w-full md:w-1/2 flex flex-col mt-5">
            <label className="font-semibold  text-md leading-none">Start Date</label>
            <input
              value={start_date}
              onChange={(e) => { setStart_date(e.target.value) }}
              type="date"
              id="date" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col mt-5">
            <label className="font-semibold  text-md  leading-none">End Date</label>
            <input
              value={end_date}
              onChange={(e) => { setEnd_date(e.target.value) }}
              type="date"
        name="date"
        id="date" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
         
          </div>

        </div>
      
        
      
        <div className=" flex justify-center items-center  mt-5 md:gap-8  sm:gap-12 gap-2">
      <Link href={"/semesters"}>
          <button type='reset' className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Create</button>
        </div>

      </form>
      </CardContent>
     
    </Card>
    </Layout>
  )
}

export default createsemster