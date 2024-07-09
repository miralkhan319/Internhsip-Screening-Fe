import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Layout from '../../../components/Layouts/Layout';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useSession } from "next-auth/react"
const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  ...theme.typography.body2,
  textAlign: 'center',
}));
const DynamicEditor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });


const Email = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [data, setData] = useState("");
  const [isError, setIsError] = useState('');
  const [createdbyName, setCreatedbyName] = useState('');
  const { data: session } = useSession();
  const [editorState, setEditorState] = useState("");

  const isWindowDefined = typeof window !== 'undefined';

  useEffect(() => {
    console.log(`/email_templates/findone/${id}`);
    axios.get(`/email_templates/findone/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data)
        setSubject(res.data.subject)
        setContent(res.data.content)
        setCreatedbyName(res.data.createdbyName)
        console.log(res.data);
      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);
  return (
    <Layout>
        <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Registration
        </div> 
      <CardContent>
        
      
      </CardContent>
     
    </Card>
      <div className='border shadow-2xl p-5 container-fluid bg-bg'>
        <div className='  text-center text-4xl font-serif font-bold shadow-md shadow-blue-400 border-x-2  p-3 mx-auto'> View Email Template</div>
        <DemoPaper square={false} className='ml-4 mr-4 mt-5'>

          <div className="mb-2">
            <TextField
              readonly
              className='w-full text-black'
              id="input-with-icon-adornment"
        
              InputProps={{
                readOnly: true,

                startAdornment: <InputAdornment position="start">Created By</InputAdornment>,
              }}
          value={createdbyName}   />  
          </div>

          <div className="mb-2">            <TextField
            readonly
            className='w-full text-black'
            id="input-with-icon-adornment"
        value={subject}
            InputProps={{
              readOnly: true,
              startAdornment: <InputAdornment position="start">Subject</InputAdornment>,
            }}
          />
          </div>


 

        
              
{isWindowDefined && (
  <DynamicEditor
    editorState={editorState}
    onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
    readOnly
  />
)}
{content}

            

  
        </DemoPaper>
        <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">
<Link href={"/email"}>
          <button

            className="  w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">OK</button></Link>
        </div>

      </div>
    </Layout>
  )
}

export default Email