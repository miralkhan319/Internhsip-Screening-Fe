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
const Updatephase = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data1, setdata1] = useState("");
  const [phases, setPhases] = useState([]);
  const [vuid, setVuid] = useState("");
  const [phase, setPhase] = useState("");
  const [status, setStatus] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isError, setIsError] = useState('');
  const { data: session } = useSession();
  const payLoaddata1 = {
 "phase": phase,
 }
  useEffect(() => {
    console.log(`/student_Registrations/get_updatephase/${id}`);
    axios.get(`/student_Registrations/get_updatephase/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setdata1(res.data.student);
        setPhases(res.data.phases)
        console.log(res.data.student);
        console.log(res.data.phases);
      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);

  const postdata1 = async () => {
  
      axios.patch(`/student_registrations/update_phaseto_joined/notjoined/${id}`, payLoaddata1, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }})
        .then((res) => {
          Swal.fire({
            title: "Sucess!",
            text: "Phase Updated Sucessfully ",
            icon: "success"
          });
          console.log;
        })
        .catch((err) => {
          console.log(err)
          Swal.fire({
            icon: 'error',
            title: 'An error Occured!',
            text: err.response.data1.message,
          });
        })
  }

  const handleSubmit1 = async (e) => {
    e.preventDefault();
 
    await postdata1();
  };




  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Update Phase
        </div> 
      <CardContent>
   <form action="" method="post" onSubmit={handleSubmit1} >

          <div className="md:flex flex-row mx-20   gap-8"> 
           <div className="w-full   flex flex-col   mt-5">
              <label className="font-semibold  text-lg leading-none">Name</label>
              <input readOnly type="name"
                name="name"
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" placeholder={data1 && data1.student && data1.student.name} />
            </div>
            <div className="w-full   flex flex-col   mt-5">
              <label className="font-semibold  text-lg leading-none">VUID</label>
              <input
                value={vuid}
                onChange={(e) => { setVuid(e.target.value) }}
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" placeholder={data1 && data1.student && data1.student.vuid} />
            </div>

          </div>
      
          
          <div className="md:flex flex-row mx-20   gap-8">
         
            <div className="w-full  flex flex-col   mt-5">
              <label className="font-semibold  text-lg  leading-none">Current Phase</label>
              <input
            className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" placeholder={data1 && data1.phase && data1.phase.name} />
            </div>
         
            <div className="w-full  flex flex-col   mt-5">
              <label className="font-semibold  text-lg  leading-none">Phase</label>   
  
           <Select
  value={phase}
  onChange={(e) => { setPhase(e.target.value) }}
  className="h-12 leading-none bg-white text-gray-900 p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500 mt-4"
>
 {phases && phases.map((phase) => (
            <MenuItem key={phase.id} value={phase.id}>
              {phase.name}
            </MenuItem>
          ))}
      </Select>

            </div>
          </div>

        <div className=" flex w-full justify-center items-center mt-10 gap-8">
          <Link href={"/students/invitedlist"}>
            <button className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
            <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Update</button>
          </div>

        </form>
      
      </CardContent>
     
    </Card>

    </Layout>
  )
}

export default Updatephase