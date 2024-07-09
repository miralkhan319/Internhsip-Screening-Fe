import Layout from '../../../components/Layouts/Layout'
import React from 'react'
import { Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const Updatesemester = () => {
  const router = useRouter();
  const { id } = router.query;
  const [semester, setSemester] = useState("");

  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isError, setIsError] = useState('');
  const { data: session } = useSession();
  const payLoadData = {

    start_date: start_date,
    end_date: end_date,
    is_active: isActive,


  }
  useEffect(() => {
    axios.get(`/semesters/get_update/${id}` , {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setSemester(res.data);
        setName(res.data.name);
        console.log(res.data);

      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);

  const postData = async () => {
    if (end_date > start_date) {
      try {
        const response = await axios.patch(`/semesters/update/${id}`, payLoadData, {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }
        });
        Swal.fire({
          title: "Success!",
          text: "Semester Updated Successfully",
          icon: "success"
        });
        console.log(response.data); // Logging the response data
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'An error occurred!',
          text: err.response.data.message || 'Failed to update semester',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'End date must be greater than the start date',
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(end_date);
    console.log(name);
    console.log(start_date);
    await postData();
  };




  return (
    <Layout>
      
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Update Semster
        </div> 
      <CardContent>
          <form action="" method="post" onSubmit={handleSubmit} >

        <div className="md:flex flex-col md:flex-row gap-36 mx-20 ">
                        <div className="w-full md:w-1/2 flex flex-col mt-5">
              <label className="font-semibold  text-md leading-none">Name</label>
              <input readOnly type="name"
                name="name"
                value={name}
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500"   />
            </div>
            <div className="w-full md:w-1/2 flex flex-col mt-5">
              <label className="font-semibold  text-md leading-none">Start Date</label>
              <input
                value={start_date}
                onChange={(e) => { setStart_date(e.target.value) }}
                
                type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
            </div>

          </div>
          <div className="md:flex flex-col md:flex-row gap-36 mx-20 ">
                        <div className="w-full md:w-1/2 flex flex-col mt-5">
              <label className="font-semibold  text-md  leading-none">End Date</label>
              <input
                value={end_date}
                onChange={(e) => { setEnd_date(e.target.value) }}
                type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
            </div>
           <div className="  flex  md:w-1/2 justify-center items-center  mt-5 md:gap-8  sm:gap-12 gap-2">
              <Link href={"/semesters"}>
                <button type='reset' className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
              <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Update</button>
            </div>
          </div>

 

        </form>

      
      </CardContent>
     
    </Card>
     
    </Layout>
  )
}

export default Updatesemester