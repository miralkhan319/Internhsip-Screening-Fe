import React from 'react'
import Layout from '../../components/Layouts/Layout'
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const createbatch = () => {
    const [start_date, setStart_date] = useState("");
    const [end_date, setEnd_date] = useState("");
    const [name, setName] = useState("");
    const [startInSemester, setStartInSemester] = useState([]);
    const [status, setStatus] = useState('');
    const [is_current, setIs_current] = useState(false);
    const [endInSemester, setEndInSemester] = useState([]);
    const [semester_for_start_date_id, setSemester_for_start_date_id] = useState('');
    const [ registration_status, setRegistration_status] = useState(false);
    const [semester_for_end_date_id, setSemester_for_end_date_id] = useState('');
    const { data: session } = useSession();
    semester_for_end_date_id
    const payLoadData = {
        name: name,
        start_date: start_date,
        end_date: end_date,
        semester_for_start_date_id: semester_for_start_date_id,
        semester_for_end_date_id: semester_for_end_date_id,
        is_current: is_current,
        registration_status:registration_status

    }
    useEffect(() => {
        axios.get('/batches/create' , {
            headers: {
              "Authorization": `Bearer ${session?.user.data.access_token}`
            }})
            .then(
                (rData) => {
                    setStartInSemester(rData.data.startInSemester)
                    setEndInSemester(rData.data.endInSemester)
                    console.log(rData.data.startInSemester)
                    console.log(rData.data.endInSemester)

                }
            )
            .catch(
                (error) => {
                    console.error('Error fetching data:', error);
                }
            )
    }, [session]);
    const postData = async () => {
         axios.post('batches/create', payLoadData  , {
                headers: {
                  "Authorization": `Bearer ${session?.user.data.access_token}`
                }})
              .then((res) => {
                Swal.fire({
                  title: "Sucess!",
                  text: "Batch Created Successfully",
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
        console.log(end_date);
        console.log(name);
        console.log(start_date);
        console.log(is_current);
        await postData();
    };

    return (
        <Layout>
              <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Create Batch
        </div> 
      <CardContent>
      <form action="" method="post" onSubmit={handleSubmit}   >
      <div className="md:flex md:flex-row  items-center mx-20  gap-36">
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                        <label className="font-semibold  text-md leading-none">Name</label>
                        <input value={name}
                        placeholder='Name'
                            onChange={(e) => { setName(e.target.value) }} type="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                            
                    </div> 
                    <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="font-semibold  text-md leading-none mb-3">Is Current</label>
                            <label className="relative inline-flex items-center cursor-pointer ml-auto  ">
                      <input  
                           checked={is_current} value={is_current}
                           onChange={(e) => setIs_current(e.target.checked === 'true')}
                          className="sr-only peer " />
                      <div
                        className="  group peer  ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-10 h-5  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39]peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-3 after:w-3 after:top-1 after:left-1   peer-checked:after:translate-x-5 peer-hover:after:scale-88 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                          
                      </div>
                    </label>
                          
                            
                       
                    </div>
                    </div>

                    <div className="md:flex md:flex-row items-center mx-20  gap-36">
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                        <label className="font-semibold  text-md leading-none">Start Date</label>
                        <input value={start_date}
                            onChange={(e) => { setStart_date(e.target.value) }} type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                </div> 
                 <div className="w-full flex flex-col mt-5 md:w-1/2">
                        <label className="font-semibold  text-md  leading-none">End Date</label>
                        <input value={end_date}
                            onChange={(e) => { setEnd_date(e.target.value) }} type="date"
              name="date"
              id="date"  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                    </div>
                 </div>
               
              
                 <div className="md:flex md:flex-row items-center mx-20  gap-36">
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                        <label className="font-semibold  text-md leading-none mb-3">Start Semster</label>
                        <Select value={semester_for_start_date_id}
                            onChange={(e) => { setSemester_for_start_date_id(e.target.value) }} 
                            className="h-11 leading-none bg-white text-gray-900 p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500" >

                            <MenuItem value=" font-bold " disabled selected >Start Semster and start date</MenuItem>
                            {
                                startInSemester.map((startInSemester) => {
                                    return <MenuItem value={startInSemester.id}   >{startInSemester.name}<hr/>
                                    {new Date(startInSemester.start_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                </MenuItem>
                                })
                            }


                        </Select>
                    </div>
                     <div className="w-full flex flex-col mt-5 md:w-1/2">
                        <label className="font-semibold  text-md mb-3 leading-none">End Semster</label>
                        <Select value={semester_for_end_date_id}
                            onChange={(e) => { setSemester_for_end_date_id(e.target.value) }} 
                            className="h-11 leading-none bg-white text-gray-900 p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500" placeholder='Role'>
                            <MenuItem value=" font-bold " disabled selected >End Semster</MenuItem>
                            {
                                endInSemester.map((endInSemester) => {
                                    return <MenuItem value={endInSemester.id} >{endInSemester.name}
                                    {new Date(endInSemester.end_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</MenuItem>
                                })
                            }


                        </Select>
                    </div>
                </div>
              
                  

                          <div className=" flex w-full justify-center items-center mt-10  sm:gap-8 gap-2">
                    <Link href='/batches'>
                    <button className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
                    <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Create</button>
                </div>
                        
             

            </form>
      
      </CardContent>
     
    </Card>



        </Layout>
    )
}

export default createbatch