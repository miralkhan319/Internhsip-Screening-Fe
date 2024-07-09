import Layout from '../../../components/Layouts/Layout';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';

const Assessment = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const [test_total_marks, setTest_total_marks] = useState('');
  const [interview_total_marks, setInterview_total_marks] = useState('');
  const [test_weightage, setTest_weightage] = useState('');
  const [interview_weightage, setInterview_weightage] = useState('');
  const [batch, setBatch] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [totalWeightage, setTotalWeightage] = useState('');
  const [isError, setIsError] = useState('');

  const payLoadData = {
    test_total_marks: totalMarks,
    interview_total_marks: totalWeightage,
    test_weightage: test_weightage,
    interview_weightage: interview_weightage,
  };

  useEffect(() => {
    if (session && id) {
      axios
        .get(`/batches/getset_testweightage/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user.data.access_token}`,
          },
        })
        .then((res) => {
          setBatch(res.data.name)
          console.log(res.data);
        })
        .catch((error) => {
          setIsError(error);
        });
    }
  }, [id, session]);

  const postData = async () => {
    axios
      .post(`/batches/test_weightage/${id}`, payLoadData, {
        headers: {
          Authorization: `Bearer ${session?.user.data.access_token}`,
        },
      })
      .then((res) => {
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'An error Occurred!',
          text: err.response.data.message,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData();
  };

  const calculateTotalMarks = () => {
    const totalMarks =
      Number(test_total_marks) + Number(interview_total_marks);
    setTotalMarks(totalMarks);
  };

  const calculateTotalweightage = () => {
    const totalWeightage =
      Number(test_weightage) + Number(interview_weightage);
    setTotalWeightage(totalWeightage);
  };

  return (
    <Layout>
        <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Assesment Marks
        </div> 
      <CardContent>
         <form action="" method="post" onSubmit={handleSubmit} >
         <div className="md:flex md:flex-row items-center mx-20  gap-36">
          <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
            <label className="font-semibold  text-md leading-none">Batch</label>
            <input type="name"
              name="name"
         value={batch}
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500 " />
          </div> 
            <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
            <label className="font-semibold  text-md leading-none">Test Total Marks</label>
            <input type="name"
              name="name"
              value={test_total_marks}
               onBlur={calculateTotalMarks}
              onChange={(e) => { setTest_total_marks(e.target.value) }}
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500 "  placeholder='Test Marks'/>
          </div>
         </div>
         <div className="md:flex md:flex-row items-center mx-20  gap-36">
      

          <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
            <label className="font-semibold  text-md leading-none">Test Weightage</label>
            <input type="name"
              name="name"
              onBlur={calculateTotalweightage}
              value={test_weightage}
             
              onChange={(e) => { setTest_weightage(e.target.value) }}
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500 " placeholder='Test Weightage' />
          </div>
         
  <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
            <label className="font-semibold  text-md leading-none">Interview Total Marks</label>
            <input
              value={interview_total_marks}
              onBlur={calculateTotalMarks}
              onChange={(e) => { setInterview_total_marks(e.target.value) }}
              type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" placeholder='Interview Marks' />
          </div>
        </div>
      
        <div className="md:flex md:flex-row items-center mx-20  gap-36">
        
          <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
            <label className="font-semibold  text-md leading-none ">Interview Total Weightage</label>
            <input
              value={interview_weightage}
              onBlur={calculateTotalweightage}
              onChange={(e) => { setInterview_weightage(e.target.value) }}
              type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" placeholder='Total Weightage'/>

          </div>  <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
          <label className="font-semibold  text-md leading-none">Total Marks</label>
          <input
           value={totalMarks}
           onChange={(e) => { setTotalMarks(e.target.value) }}
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
        </div>
        </div>
        <div className="md:flex md:flex-row items-center mx-20  gap-36">
        
        <div className="w-full md:w-1/2 flex flex-col   mt-5 ">
          <label className="font-semibold  text-md leading-none mb-3">Total Weightage</label>
          <input
         value={totalWeightage}
         onChange={(e) => { setTotalWeightage(e.target.value) }}
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />

        </div>
             <div className="w-full md:w-1/2 flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">
      <Link href={"/batches"}>
          <button type='reset' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
        </div>
      </div>
      
   

      </form>
 
      
      </CardContent>
     
    </Card>

       
    </Layout>
  )
}

export default Assessment 