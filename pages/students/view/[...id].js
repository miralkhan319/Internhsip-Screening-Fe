import React from 'react'
import Layout from '../../../components/Layouts/Layout'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const resultofjoinned = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [total_marks, setTotal_marks] = useState("");
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [vUID, setVUID] = useState("");
  const [internal_viva_marks, setInternal_viva_marks] = useState("");
  const [external_viva_marks, setExternal_viva_marks] = useState("");
  const [documentation_marks, setDocumentation_marks] = useState("");
  const [supervisor_name, setSupervisor_name] = useState("");

  const [result, setResult] = useState("");
  const [description, setDescription] = useState("");
  const [project_name, setProject_name] = useState("");
  const [data, setData] = useState('');

  const [isError, setIsError] = useState('');


  useEffect(() => {
    axios.get(`/student_registrations/view_joindedStudent/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setBatch(res.data.batch.name);
        setName(res.data.student.name);
        setVUID(res.data.student.vuid);
 const resultData = res.data.finalResults && res.data.finalResults.length > 0 ? res.data.finalResults[0] : null;
        if (resultData) {
          setInternal_viva_marks(resultData.internal_viva_marks);
          setExternal_viva_marks(resultData.external_viva_marks);
          setDocumentation_marks(resultData.documentation_marks);
          setResult(resultData.result);
          setProject_name(resultData.project_name);
          setSupervisor_name(resultData.supervisor_name);
          setTotal_marks(resultData.total_marks);
          setTotal_marks(resultData.description);
        }
      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);

  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        View Result of Passout  Student
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
            Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {name}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm  font-medium text-black">
            VUID
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {vUID}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Internal Viva Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {internal_viva_marks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            External Viva Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {external_viva_marks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Documentation Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {documentation_marks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Total Marks
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {total_marks}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Project Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {project_name}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Supervisor Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {supervisor_name}
            </dd>
        </div>
        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-black">
            Description
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {description}
            </dd>
        </div>
    </dl>
</div>
</div>
 <div className=" flex justify-center items-center   mt-5 md:gap-16  sm:gap-64 gap-2">
            <Link href={"/students/joinedlist"}>
              <button className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">OK</button></Link>

          </div>   
 
  
      
      </CardContent>
     
    </Card>





    



    </Layout>
  )
}

export default resultofjoinned