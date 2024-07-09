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
const testresult = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
  const [testObtainMarks, setTestObtainMarks] = useState("");
  const [name, setName] = useState("");
  const [interview_total_marks, setInterview_total_marks] = useState("");
  const [interview_total_mark, setInterview_total_mark] = useState("");
  const [interview_weightage, setInterview_weightage] = useState("");
  const [total_weightage, setTotal_weightage] = useState("");
  const [interviewObtainMarks, setInterviewObtainMarks] = useState("");
  const [testcomment, setTestcomment] = useState("");
  const [interviewcomment, setInterviewcomment] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [data, setData] = useState('');
  const [test_total_marks, setTest_total_marks] = useState("");
  const [isError, setIsError] = useState('');

  const payLoadData = {


    "testObtainMarks":testObtainMarks,
    "testcomment":testcomment,
    "interviewObtainMarks":interviewObtainMarks,
    "interviewcomment":interviewcomment,
    "phaseId":phaseId
  }
  useEffect(() => {
  
    axios.get(`/student_registrations/get_set_student_result/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data);
        setTest_total_marks(res.data.data.batch.test_weightage.test_total_marks);
        setInterview_total_marks(res.data.data.batch.test_weightage. interview_total_marks);
        setName(res.data.data.batch.name);
        setInterview_total_mark(res.data.data.batch.test_weightage. interview_total_marks);
        setInterview_weightage(res.data.data.batch.test_weightage. interview_weightage);
        setTotal_weightage(res.data.data.batch.test_weightage.total_weightage);

      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);

  const postData = async () => {

      axios.patch(`/student_registrations/set_result/${id}`, payLoadData, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }})
        .then((res) => {
          Swal.fire({
            title: "Sucess!",
            text: "Test Result Updated Sucessfully",
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

    await postData();
  };
  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
       Test Result
        </div> 
      <CardContent>
 
      
      </CardContent>
       
      <form action="" method="post" onSubmit={handleSubmit} >
      <div className="md:flex flex-row  mx-20 items-center mt-10 gap-24">
      <div className="w-full  mt-2   flex flex-col ">
            <label className="font-semibold  text-lg leading-none">Batch</label>
            <input type="name"
              name="name"
            
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 " value={name}/>
          </div> 
           <div className="w-full    mt-2   flex flex-col">
          <label className="font-semibold  text-lg leading-none"> Total Test Marks</label>
          <input
          
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={test_total_marks}  />
        </div>
         </div>
      
      <div className="md:flex flex-row mx-20 items-center  gap-24"> 
        
     
        <div className="w-full    mt-2  flex flex-col">
          <label className="font-semibold  text-lg leading-none "> Total Interview Marks</label>
          <input
         
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={interview_total_marks}  />

        </div> 
         <div className="w-full    mt-2 flex flex-col">
            <label className="font-semibold  text-lg leading-none">Test Obtain Marks</label>
            <input type="name"
              name="name"
              value={testObtainMarks}
              onChange={(e) => { setTestObtainMarks(e.target.value) }}
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 "  placeholder='Obtain Marks' />
          </div>
      </div>
    
         
      
        <div className="md:flex flex-row mx-20 items-center  gap-24"> 
        
         
      

          <div className="w-full    mt-2 flex flex-col">
            <label className="font-semibold  text-lg leading-none"> Interview Obtain Marks</label>
            <input type="name"
              name="name"
              value={interviewObtainMarks}
              onChange={(e) => { setInterviewObtainMarks(e.target.value) }}
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 " placeholder='Obtain Marks' />
          </div>
           <div className="w-full    mt-2   flex flex-col">
            <label className="font-semibold  text-lg leading-none">Test Comment</label>
            <input
              value={testcomment}
              onChange={(e) => { setTestcomment(e.target.value) }}
              type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" placeholder='Comment' />
          </div>

        </div>
      
        <div className="md:flex flex-row mx-20 items-center  gap-24"> 
        
        
          <div className="w-full    mt-2  flex flex-col">
            <label className="font-semibold  text-lg leading-none ">Interview Comment</label>
            <input
              value={interviewcomment}
              onChange={(e) => { setInterviewcomment(e.target.value) }}
              type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" placeholder='Comment'/>

          </div> 
           <div className="w-full    mt-2   flex flex-col">
          <label className="font-semibold  text-lg leading-none">Test Weightage</label>
          <input
          
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={interview_total_mark} />
        </div>
        </div>
        <div className="md:flex flex-row mx-20 items-center  gap-24"> 
        
      
        <div className="w-full    mt-2  flex flex-col">
          <label className="font-semibold  text-lg leading-none">Interview Weightage</label>
          <input
         
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={ interview_weightage } />

        </div> 
        <div className="w-full    mt-2   flex flex-col">
          <label className="font-semibold  text-lg leading-none">Total Weightage</label>
          <input
         
         type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={total_weightage
         } />
        </div>
        
      </div>
      <div className="md:flex flex-row mx-20 items-center mb-4  gap-24"> 
        
       
        <div className="w-full md:w-1/2    mt-2  flex flex-col">
          <label className="font-semibold  text-lg leading-none">Status</label>
          <Select
  className=" h-11 leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500"
  value={phaseId}
  onChange={(e) => { setPhaseId(e.target.value) }}
>
  {data && data.phase.map((phase) => (
    <MenuItem key={phase.id} value={phase.id}>
      {phase.name}
    </MenuItem>
  ))}
</Select>

        </div> 
        <div className="  flex  md:w-1/2 justify-center items-center  mt-2 md:gap-8  sm:gap-12 gap-2">
      <Link href={"/students/assesmentlist"}>
          <button className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
        </div>
      </div>
      

      </form>

    </Card>
    



    </Layout>
  )
}

export default testresult