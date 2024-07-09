import React from 'react'
import Layout from '../../../components/Layouts/Layout'
import { useState,useEffect } from 'react';
import Swal from 'sweetalert2';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
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
  const [testObtainMarks, setTestObtainMarks] = useState("");
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
  const [totalMarks, setTotalMarks] = useState();
  const [isError, setIsError] = useState('');

  const payLoadData = {
    "internal_viva_marks": internal_viva_marks,
    "external_viva_marks": external_viva_marks,
    "documentation_marks":documentation_marks,
    "supervisor_name":supervisor_name,
    "result":result,
    "description":description,
    "project_name":project_name,
    "total_marks":totalMarks

}
useEffect(() => {
  axios.get(`/student_registrations/get_set_finalResutl/${id}`, {
    headers: {
      "Authorization": `Bearer ${session?.user.data.access_token}`
    }})
    .then((res) => {
      setData(res.data);
      setBatch(res.data.batch.name);
      setName(res.data.student.name);
      setVUID(res.data.student.vuid);
    })
    .catch((error) => {
      setIsError(error);
    });
}, [id,session]);
  const postData = async () => {

      axios.patch(`/student_registrations/set_final_result/${id}`, payLoadData, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }})
        .then((res) => {
          Swal.fire({
            title: "Sucess!",
            text: " Result Updated Sucessfully",
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
console.log(result);
    await postData();
  };
  const calculateTotalMarks = () => {
    const totalMarks = Number(internal_viva_marks) + Number(external_viva_marks) + Number(documentation_marks);
    setTotalMarks(totalMarks);
  };

  return (
 <Layout>
<Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Result of Joinned  Student
        </div> 
      <CardContent>
  <form action="" method="post" onSubmit={handleSubmit} >
      <div className="md:flex flex-row mx-20  items-center mt-10 gap-24">
                        <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
            <label className="font-semibold  text-lg leading-none">Batch</label>
            <input type="name"
              name="name"
            
              className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 " value={batch}/>
          </div> 
         <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
          <label className="font-semibold  text-lg leading-none"> Name</label>
          <input
          
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={name}  />
        </div>
         </div>
      
      <div className="md:flex flex-row mx-20  items-center  gap-24"> 
      <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
          <label className="font-semibold  text-lg leading-none ">VUID</label>
          <input
         
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={vUID}  />

        </div>
       
        <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
              <label className="font-semibold text-lg leading-none">Internal Viva Marks</label>
              <input
                type="text"
                value={internal_viva_marks}
                onChange={(e) => { setInternal_viva_marks(e.target.value) }}
                onBlur={calculateTotalMarks}
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500 "
                placeholder='Internal Viva Marks'
              />
            </div>
      </div>
        <div className="md:flex flex-row mx-20 items-center gap-24">
        <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
              <label className="font-semibold text-lg leading-none">External Viva Marks</label>
              <input
                type="text"
                value={external_viva_marks}
                onChange={(e) => { setExternal_viva_marks(e.target.value) }}
                onBlur={calculateTotalMarks}
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500 "
                placeholder='External Viva Marks'
              />
            </div>
            <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
              <label className="font-semibold text-lg leading-none">Documentation Marks</label>
              <input
                placeholder='Documentation Marks'
                value={documentation_marks}
                type="text"
                onChange={(e) => { setDocumentation_marks(e.target.value) }}
                onBlur={calculateTotalMarks}
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500"
              />
            </div>
          
          </div>

          <div className="md:flex flex-row mx-20 items-center gap-24">
          <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
              <label className="font-semibold text-lg leading-none">Total Marks</label>
              <input
                placeholder='Total Marks'
                value={totalMarks}
                type="text"
                name="text" id="text"
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4 border rounded-md border-gray-500"
              />
            </div>
            <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
          <label className="font-semibold  text-lg leading-none">Project Name</label>
          <input
          value={project_name }
          onChange={(e) => { setProject_name(e.target.value) }}
           placeholder='Project Name' 
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500"  />
        </div>
          </div>
        <div className="md:flex flex-row mx-20 items-center  gap-24"> 
       <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
          <label className="font-semibold  text-lg leading-none">Supervisor Name</label>
          <input
          placeholder='Supervisor Name' 
            type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={supervisor_name }
            onChange={(e) => { setSupervisor_name(e.target.value) }} />

        </div> 
       <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
          <label className="font-semibold  text-lg leading-none mb-3">Result</label>
          <Select
      className="h-11 leading-none bg-white text-gray-900 p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500"
      value={result}
      onChange={(e) => setResult(e.target.value === 'Pass' ? 'Pass' : 'Fail')}
    >
      <MenuItem disabled>Select Result</MenuItem>
      <MenuItem value="Pass">Pass</MenuItem>
      <MenuItem value="Fail">Fail</MenuItem>
    </Select>
  </div> 
      </div>
      <div className="md:flex flex-row mx-20 items-center  gap-24"> 
      
        <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
          <label className="font-semibold  text-lg leading-none">Description</label>
          <input
          placeholder='Description' 
         type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" value={description  }    onChange={(e) => { setDescription(e.target.value) }}/>
        </div>
         <div className=" flex  md:w-1/2 w-full justify-center items-center mt-10 gap-8">
      <Link href={"/students/joinedlist"}>
          <button type="reset"className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
          <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
        </div>
      </div>
       

      </form>
      
      </CardContent>
     
    </Card>

     
 
 </Layout>
  )
}

export default resultofjoinned