import Layout from '../../components/Layouts/Layout'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {  Switch } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"
import TimelineIcon from '@mui/icons-material/Timeline';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const StudentDashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
    const [data, setData] = useState([]);
    const [batch, setBatch] = useState([]); 
    const [batchactive, setBatchactive] = useState([]); 
     const [data1, setData1] = useState("");
     const [data2, setData2] = useState("");
     const [name, setName] = useState("");
     const [vuid, setVuid] = useState("");
     const [history, setHistory] = useState([]);
     const [isDiv1Visible, setDiv1Visible] = useState(false);
     const [isDiv2Visible, setDiv2Visible] = useState(false);
    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await axios.get('/students/StudentDashboard', {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }
        });
          setData(response.data);
          setBatch(response.data.activebatch.activeBatches);
          setBatchactive(response.data.activebatch.activebatchCount);
          setData2(response.data.registationHistory);
        setData1(response.data.openForRegistration);
        console.log(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [session]);
   
    const handleButtonClick = async () => { 
      setDiv1Visible(!isDiv1Visible);
          try {
            const response = await axios.get('/students/StudentDashboard', {
              headers: {
                "Authorization": `Bearer ${session?.user.data.access_token}`
              }
            }
            );
            setData1(response.data.studentDegreeCriteria);
            console.log(response.data.studentDegreeCriteria)
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }}
          
    const handleButtonClick1 = async () => { 
      setDiv2Visible(!isDiv2Visible);
      try {
        const response = await axios.get('/students/StudentDashboard', {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }
        });
        setData2(response.data.registationHistory);
        setName(response.data.registationHistory.name);
        setVuid(response.data.registationHistory.vuid);
        setHistory(response.data.registationHistory.studentregistrations);
        console.log(response.data.registationHistory)
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }}
     
  return(
  <Layout>
<Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Student Dashboard
        </div> 
      <CardContent>
        
<div className=" flex flex-col md:flex-row  mt-8 gap-2">
  <div className="w-80 p-4 h-30 flex flex-row m-auto  bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500  gap-8 rounded-lg border-2 border-blue-500">
    <div className="my-auto">
      <div className="text-2xl font-semibold font-serif text-blue-900">Active Batches: <span className='font-md   font-serif '> {batchactive}</span>  </div>
      <div className="text-2xl text-blue-100">
         <ul>
                      {batch.map((btch) => (
                        <li key={btch.id}>{btch.name} </li>))}
                    </ul>
           
                    </div>        
    </div>
    <div className="text-blue-300 my-auto bg-gradient-to-l from-blue-700 via-blue-800 to-blue-900 rounded-full p-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-12 h-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>


      
    </div>
  </div>
  <div  onClick={handleButtonClick1} className="w-80 p-6 h-30 flex flex-row m-auto bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500  gap-8  rounded-lg border-2 border-indigo-500">
    <div className="my-auto">
      <div className="text-2xl font-semibold font-serif text-indigo-800">Registration</div>
    </div>
    <div className="text-indigo-300 my-auto bg-gradient-to-l from-indigo-700 via-indigo-800 to-indigo-900 rounded-full p-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
</svg>

    
    </div>
  </div>

  <div onClick={handleButtonClick} className=" w-80 p-4 h-30 flex flex-row m-auto bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500   gap-8 rounded-lg border-2 border-sky-500">
    <div className="my-auto">
      <div className="text-2xl font-semibold text-sky-800 font-serif ">Batch Registration Status</div>
  
    </div>
    <div className="text-sky-300 my-auto bg-gradient-to-l from-sky-700 via-sky-800 to-sky-900 rounded-full p-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
</svg>

    </div>   
  </div>
   
</div> 
 <div id="div2" className={`mt-10 ${isDiv2Visible ? '' : 'hidden'}`}>
        {data2 && (
          <Card> 
            
            <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
           Student Registration History
         </div>
            <CardContent>
        
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
         <dl class="sm:divide-y sm:divide-gray-200">
             <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt class="text-md font-medium text-black">
                 ID
                 </dt>
                 <dd class="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                 {vuid}
                 </dd>
             </div>
             <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt class="text-md font-medium text-black">
                 Name
                 </dt>
                 <dd class="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                 {name}
                 </dd>
             </div>
             <div>
             <ul>
    {history.map((batch, index) => (
      <li key={batch.id}>
        <label className=" text-md font-bold  leading-none p-6">
          Registration {index + 1}
        </label>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            {batch.batch.name}
          </AccordionSummary>
          <AccordionDetails>
          <Timeline >
                          {batch.phaseHistory
                            .map((phase, phaseIndex) => (
                              <TimelineItem key={phaseIndex}>
                                <TimelineOppositeContent
                                  sx={{ m: 'auto 0' }}
                                  align="right"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <span className='text-black font-bold'>
                                    {new Date(phase.processed_on).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                    {' '}
                                    <br/>
                                    {new Date(phase.processed_on).toLocaleTimeString([], { hour12: true })}
                                  </span>
                                </TimelineOppositeContent>

                                <TimelineSeparator>

                                  <TimelineConnector />
                                  <TimelineDot className=
                                    {index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#D4E1F3]" }>
                                    <TimelineIcon  />
                                  </TimelineDot>
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                <Card className={`shadow-xl shadow-blue-200 ${index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#D4E1F3]" }`}>
                                  <div className='bg-blend-lighten bg-opacity-90 p-6 rounded-lg shadow-lg container-fluid'>
                               
                                    
                                    <Typography
                                      // placeholder="Processed By"
                                      readOnly
                                      className="font-semibold text-md"
                                    // className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700  border rounded-md border-gray-200"
                                    // id="input-with-icon-adornment"
                                    >{phase.phases.name}</Typography>
                                    
                                    <Typography
                                      // placeholder="Processed By"
                                      readOnly
                                    // className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700  border rounded-md border-gray-200"
                                    // id="input-with-icon-adornment"
                                    >{phase.comments}</Typography>
                                   
                                   
                                    
                                    <Typography readOnly>
                                      <b>Processed by: </b>
                                      {phase.processed_by.fullname}
                                    </Typography>

                                   
                                  </div>
                                  </Card>
                                </TimelineContent>
                              </TimelineItem>
                            ))}
                        </Timeline>
          </AccordionDetails>
        </Accordion>
      </li>
    ))}
  </ul>
             </div>
           
             
         </dl>
     </div>
      
    

       </CardContent></Card>
  )  }
     </div> 
<div id="div1" className={`mt-10 ${isDiv1Visible ? '' : 'hidden'}`}>
      {data1 && (
         <Card >
         <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
         Registration Status
         </div> 
       <CardContent> 
       <div className=' text-center text-lg font-serif font-bold p-3 m-1'>
           Eligibility Criteria
         </div>
        <div className="overflow-hidden justify-center my-2 border  border-gray-400  px-4 space-x-3 py-3 rounded-lg  flex flex-wrap md:flex-nowrap gap-2 md:gap-8 ">
         <div className="flex font-md items-center    sm:gap-3 gap-1    w-full  md:w-1/2 ">
             <label htmlFor="status" className="block text-md font-semibold leading-6 text-gray-900">Batch Name: <span className='font-md ml-3 text-black  text-lg font-serif '> {data1.batch.name}</span></label>
           
 
           </div>
           <div className="flex items-center   sm:gap-3 gap-1    w-full  md:w-1/2 ">
             <label htmlFor="status" className="block text-md font-semibold leading-6 text-gray-900">Is Current</label>
          
          <Switch   checked={data1.batch.registration_status}></Switch>
           </div>
           <div className="flex items-center    sm:gap-3 gap-4 w-full  md:w-1/2 ">
             <label htmlFor="role" className="block font-md text-md font-semibold leading-6 text-gray-900">Role</label>
       
         
          <Switch  checked={data1.batch.is_current}></Switch>
           </div>

 
         </div>
       <div class="bg-white overflow-hidden shadow rounded-lg border">
 
     <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
         <dl class="sm:divide-y sm:divide-gray-200">
             <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt class="text-sm font-medium text-black">
                 Degree
                 </dt>
                 <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                 {data1.degree.title}
                 </dd>
             </div>
             <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt class="text-sm font-medium text-black">
                 Minimum_Cgpa
                 </dt>
                 <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                 {data1.minimum_cgpa}
                 </dd>
             </div>
             <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt class="text-sm font-medium text-black">
                 Inlude_Grades
                 </dt>
                 <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                 {data1.include_grades ? 'true' : 'false'}
                 </dd>
             </div>
             <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                 <dt class="text-sm  font-medium text-black">
                 Project Enrollment
                 </dt>
                 <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                 {data1.project_enrollment ? 'true' : 'false'}
                 </dd>
             </div>
              
             <div className=' text-center text-2xl font-serif font-bold   p-3 m-1'>
           Subjects Table
         </div>
                 
                 <section className="container-fluid  mx-auto py-6 ">
          <TableContainer className='rounded-lg '>
            <Table>
              <TableHead >
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-black">
                <TableCell className='px-4 border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4 border-x border-black py-2 text-white'>Subject</TableCell>
                  <TableCell className='px-4 border-x border-black py-2 text-white'>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {data1 && data1.eligibility_criteria_subjects.map((degree, index) =>  (<TableRow key={degree.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4 py-2 text-sm">                 
                  {++index}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm border">
                    
                        
                           {degree.subjects&& degree.subjects.code}
                         
                        

                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm border">
                   
                          {degree.grade}

                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
    </section>
                
             
         </dl>
     </div>
 </div>
        
          
    <Link href={"/students/studentregistration"}>
        <div className='flex justify-center mt-2 '>
              <button    className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Apply</button></div></Link>
      </CardContent>
        </Card>
        


      )  }
    
     </div> 
     
      
      </CardContent>
     
    </Card>
 


</Layout>
  )
}

export default StudentDashboard 