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
const eligibilityview = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [degree, setDegree] = useState("");
  const [batch, setBatch] = useState("");
  const [subject, setSubject] = useState([]);
  const [result, setResult] = useState("");
  const [grade, setGrade] = useState("");
  const [project_name, setProject_name] = useState(true);
  const [data, setData] = useState('');

  const [isError, setIsError] = useState('');


  useEffect(() => {
    axios.get(`/eligibility_criterias/viewCriteria/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }
    })
    .then((res) => {
      setData(res.data);
      console.log(res.data);
      setBatch(res.data.batch.name); 
      setDegree(res.data.degree.title); 
      setSubject(res.data.eligibility_criteria_subjects ); 
      setResult(res.data.minimum_cgpa);
      setProject_name(res.data.project_enrollment  );
      setGrade(res.data.include_grade);
      
    })
    .catch((error) => {

      console.error("Error fetching data:", error);
    });
  }, [id, session]);

  return (
    <Layout>
    <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        View Eligibility Criteria
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
                {batch}
                </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-black">
                Result
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {result}
                </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-black">
                Degree
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {degree}
                </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm  font-medium text-black">
                Project Enrollment
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {project_name? 'true' : 'false'} 
                </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-black">
                Subject
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <ul>   {subject.map((subject, index) => (   <li>{++index}.{subject.subjects.code} {subject.grade}</li> ))}</ul> 
                </dd>
            </div>
        </dl>
    </div>
</div>
       
          <div className=" flex justify-center items-center   mt-5 md:gap-16  sm:gap-64 gap-2">
            <Link href={"/eligibilitycriteria"}>
              <button className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">OK</button></Link>

          </div>

        
      </CardContent>
     
    </Card>

       



     



    </Layout>
  )
}

export default eligibilityview