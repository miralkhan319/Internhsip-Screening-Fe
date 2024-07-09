import Layout from '../../components/Layouts/Layout'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
    const [data, setData] = useState([]);
    const [batch, setBatch] = useState([]); 
    const [batchactive, setBatchactive] = useState([]); 
    const [cregCount, setCRegCount] = useState("");
    const [regCount, setRegCount] = useState("");
    const [oRegCount, setORegCount] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/student_registrations/CoordinatorDashboard', {
            headers: {
              "Authorization": `Bearer ${session?.user.data.access_token}`
            }});
            setData(response.data);
            setBatch(response.data.activebatch.activeBatches);
            setBatchactive(response.data.activebatch.activebatchCount);
            setCRegCount(response.data.currentRegistrationCount);
            setRegCount(response.data.JoinedCount);
            setORegCount(response.data.openRegistrationbatchCount);
    
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);


  return(
  <Layout>
    <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Coordinator Dashboard
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
  <div  className=" w-80 p-4 h-30 flex flex-row m-auto bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500  gap-8  rounded-lg border-2 border-indigo-500">
    <div className="my-auto">
      <div className="text-2xl font-semibold font-serif text-indigo-800">Active Student</div>
      <div className="text-2xl text-indigo-100">Total Student:{regCount}</div>
    </div>
    <div className="text-indigo-300 my-auto bg-gradient-to-l from-indigo-700 via-indigo-800 to-indigo-900 rounded-full p-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
</svg>

    
    </div>
  </div>

  <div className=" w-80 p-4 h-30 flex flex-row m-auto bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500   gap-8 rounded-lg border-2 border-sky-500">
    <div className="my-auto">
      <div className="text-2xl font-semibold text-sky-800 font-serif">Application</div>
      <div className="text-2xl text-sky-100">
   
 <ul>
    
  <li> 
                      { cregCount && cregCount.registraton && cregCount.registraton.batch&&cregCount.registraton.batch.name}:{cregCount.count}
                     
                      </li>  
                                    <li>
  {oRegCount&& oRegCount.Registration&& oRegCount.Registration.batch&& oRegCount.Registration.batch.name}:{oRegCount.Count2}
  </li>
</ul>



      </div>
    </div>
    <div className="text-sky-300 my-auto bg-gradient-to-l from-sky-700 via-sky-800 to-sky-900 rounded-full p-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
</svg>
    </div>   
  </div> 
</div>    
      
      </CardContent>
     

    </Card>



</Layout>
  )
}

export default Dashboard 