
import React from 'react'
import Layout from '../../../components/Layouts/Layout'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from "next-auth/react"
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const batchview = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [test_total_marks, setTest_total_marks] = useState(0);
  const [interview_total_marks, setInterview_total_marks] = useState(0);
  const [test_weightage, setTest_weightage] = useState(0);
  const [data, setData] = useState('');
  const [interview_weightage, setInterview_weightage] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0); 
  const [tWeightage, setTotalWeightage] = useState(0); 
  
  const [name, setName] = useState('');
  const [status, setStatus] = useState('')

  const [isError, setIsError] = useState('');


  useEffect(() => {
    if (session && id) {
    axios.get(`/batches/view_batch_assessment/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }
    })
    .then((res) => {
      setName(res.data.name);
      setStatus(res.data.is_current);
      setTest_total_marks(res.data.test_weightage.test_total_marks);
      setInterview_total_marks(res.data.test_weightage.interview_total_marks);
      setTest_weightage(res.data.test_weightage.test_weightage);
      setInterview_weightage(res.data.test_weightage.interview_weightage);
      setTotalMarks(res.data.test_weightage.total_marks);
      setTotalWeightage(res.data.test_weightage.total_weightage);
    })
    .catch((error) => {

      console.error("Error fetching data:", error);
    });}
  }, [id, session]);

  return (
    <Layout>
    <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Batch View
        </div> 
      <CardContent>
      <div class="bg-white overflow-hidden shadow rounded-lg border">

<div class="border-t border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Batch
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {name}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {status}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {name}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm  font-medium text-black">
            Test Total Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {test_total_marks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Test Total Weightage
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {test_weightage}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Interview Total Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {interview_total_marks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Interview Total Weightage
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {interview_weightage}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Total Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {totalMarks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Total Weightage
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {tWeightage}
            </dd>
        </div>
       

    </dl>
</div>
</div> 
<div className=" flex justify-center items-center   mt-5 md:gap-16  sm:gap-64 gap-2">
            <Link href={"/eligibilitycriteria"}>
              <button className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">OK</button></Link>

          </div>
        <form action="" method="post"  >
          <div className="md:flex flex-row  items-center mx-14 gap-64">
            <div className="w-full md:w-2/5 mt-10 flex flex-col ">
              <label className="font-semibold  text-md leading-none">Batch:<span className='font-md ml-3 text-blue-900 font-serif '></span></label>
            </div>
            <div className="w-full md:w-2/5 mt-10  flex flex-col">
              <label className="font-semibold  text-md leading-none">Status:<span className='font-md ml-3 text-blue-900 font-serif '>{status}</span></label>
            </div>
          </div>
          <div className="md:flex flex-row items-center  mx-14  gap-64">
            <div className="w-full md:w-2/5 mt-10   flex flex-col">
              <label className="font-semibold  text-md leading-none">Test Total Marks:<span className='font-md ml-3 text-blue-900 font-serif  '>{test_total_marks}</span></label>
            </div>
            <div className="w-full md:w-2/5 mt-10   flex flex-col">
              <label className="font-semibold  text-md leading-none">Test Total Weightage: <span className='font-md ml-3 text-blue-900 font-serif '>{test_weightage}</span></label>
            </div>
          </div>
          <div className="md:flex flex-row items-center  mx-14  gap-64">
            <div className="w-full md:w-2/5 mt-10   flex flex-col">
              <label className="font-semibold  text-md leading-none"> Interview Total Marks:<span className='font-md ml-3 text-blue-900 font-serif  '>{interview_total_marks}</span></label>
            </div>
            <div className="w-full md:w-2/5 mt-10   flex flex-col">
              <label className="font-semibold  text-md leading-none">Interview Total Weightage: <span className='font-md ml-3 text-blue-900 font-serif '>{interview_weightage}</span></label>
            </div>
          </div>
          <div className="md:flex flex-row items-center  mx-14  gap-64">
            <div className="w-full md:w-2/5 mt-10   flex flex-col">
              <label className="font-semibold  text-md leading-none"> Total Marks:<span className='font-md ml-3 text-blue-900 font-serif  '>{totalMarks}</span></label>
            </div>
            <div className="w-full md:w-2/5 mt-10   flex flex-col">
              <label className="font-semibold  text-md leading-none">Total Weightage: <span className='font-md ml-3 text-blue-900 font-serif '>{tWeightage}</span></label>
            </div>
          </div>
      
          <div className="md:flex flex-row items-center mx-14    gap-64">
            
          </div>
         

        </form> 
      
      </CardContent>
     
    </Card>

       



     



    </Layout>
  )
}

export default batchview