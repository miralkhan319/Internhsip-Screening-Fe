import Layout from '../../../components/Layouts/Layout'
import React from 'react'
import { Select,MenuItem} from '@mui/material';
import { useState,useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const attendace = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
  const [vUID, setVUID] = useState("");
  const [attendance, setAttendance] = useState("");
  const [attendanceDateTime, setAttendanceDateTime] = useState("");
  const [data, setData] = useState('');
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [isError, setIsError] = useState('');
  const [test_date, setTest_date] = useState("");
  const payLoadData = {
    "attendance":attendance,
    "attendanceDateTime":attendanceDateTime


  }
  useEffect(() => {
 
    axios.get(`/student_registrations/attendance/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data);
        setBatch(res.data.batch);
        setName(res.data.name);
        setTest_date(res.data.testdate);
        setVUID(res.data.vuid);
        console.log(res.data);
      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);

  const postData = async () => {
    
      axios.patch(`/student_registrations/attendance/${id}`, payLoadData, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }})
        .then((res) => {
          Swal.fire({
            title: "Sucess!",
            text: (res.data.message),
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

    console.log(attendanceDateTime);
    console.log(attendance);
    await postData();
  };
  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Attendance
        </div> 
      <CardContent>
 
      <form action="" method="post" onSubmit={handleSubmit}>
      <div className="md:flex flex-row   items-center mx-20 mt-10 gap-24">
          <div className="w-full  mt-2 flex flex-col">
      <label className="font-semibold text-lg leading-none">Batch</label>
      <input
        type="text"
        name="name"
        className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500 "
        value={batch}
      />
    </div>
    <div className="w-full  mt-2  flex flex-col">
      <label className="font-semibold text-lg leading-none">Name</label>
      <input
        type="name"
        name="name"
        className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500 "
        value={name}
      />
    </div>
  </div>

  <div className="md:flex flex-row items-center mx-20 gap-24">
    <div className="w-full  mt-2   flex flex-col">
      <label className="font-semibold text-lg leading-none">Test Date</label>
      <input
      readOnly
        type="text"
        className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500"
        value={new Date(test_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
      />
    </div>

    <div className="w-full  mt-2 flex flex-col">
      <label className="font-semibold text-lg leading-none">VUID</label>
      <input
        type="name"
        name="name"
        className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 "
        value={vUID}
      />
    </div>
  </div>

  <div className="md:flex flex-row items- mx-20  gap-24">
    <div className="w-full  mt-2 flex flex-col">
      <label className="font-semibold text-lg leading-none">Date</label>
      <input
        value={attendanceDateTime}
        onChange={(e) => { setAttendanceDateTime(e.target.value) }}
        type="date"
        name="datet"
        id="date"
        className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500"
      />
    </div>
    <div className="w-full  mt-2 flex flex-col">
      <label className="font-semibold text-lg leading-none mb-3">Attendance</label>
      <Select
        value={attendance}
        onChange={(e) => setAttendance(e.target.value)}
        className="h-12 leading-none bg-white text-gray-900 p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500"
      >
        <MenuItem value='Present'>Present</MenuItem>
        <MenuItem value='Absent'>Absent</MenuItem>
      </Select>
    </div>
  </div>

  <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">
    <Link href={"/students/shortlisted"}>
      <button className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
    </Link>
    <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
  </div>
</form>
      </CardContent>
     
    </Card>
      
 




  
    </Layout>
  )
}

export default attendace