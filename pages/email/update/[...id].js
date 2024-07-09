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
import Swal from 'sweetalert2';
import Layout from '../../../components/Layouts/Layout';
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  ...theme.typography.body2,
  textAlign: 'center',
}));
const DynamicEditor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const Email = () => {  
     const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
  useEffect(() => {
    console.log(`/email_templates/getupdate/${id}`);
    axios.get(`/email_templates/getupdate/${id}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data);
        setSubject(res.data.subject)
        setContent(res.data.content)
        console.log(res.data);
      })
      .catch((error) => {
        setIsError(error);
      });
  }, [id,session]);

  const [data, setData] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState('');
  const [editorState, setEditorState] = useState('');
 const [isError, setIsError] = useState('');
  const isWindowDefined = typeof window !== 'undefined';


  const payLoadData = {
    "subject":subject,
    "content":content
    }

  const handleContentChange = () => {
    setContent(content);
  };
  const postData = async () => {
    axios.patch(`email_templates/update/${id}`,payLoadData, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          title: "Success!",
          text: "Email Sent Successfully",
          icon: "success"
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'An error Occurred!',
          text: error.response.data.message,
        });
      });
  };
  const handleSubmit = async (e) => {
    await postData();
    console.log(content);
    console.log(subject);
  };
  return (
 <Layout> 
    <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Update Eamil Template
        </div> 
      <CardContent>
 <DemoPaper square={false} className='ml-4 mr-4 mt-5'>
          

              <div className="mb-2">            <TextField
value={subject}
                className='w-full'
                id="input-with-icon-adornment"
                label=""
                onChange={(e) => { setSubject(e.target.value) }}
                // value={subject}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Subject</InputAdornment>,
                }}
              />
              </div>


             

            
                
                   
                 {isWindowDefined && (
              <DynamicEditor
                editorState={editorState}
                onEditorStateChange={(newEditorState) => {
                  setEditorState(newEditorState);
                  handleContentChange(newEditorState.getCurrentContent().getPlainText('\u0001'));
                }}
             
                 />
            )}

         
   {content}
              
            </DemoPaper>       
          <div className=" flex justify-center items-center  mt-2 md:gap-16  sm:gap-24 gap-2">
<Link href={"/email"}>
              <button
    type='reset'
               className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
              <button 
              onClick={() => {
                handleSubmit();
             
              }} 
              className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>       </div>

      </CardContent>
     
    </Card>


        
 </Layout>
  )
}

export default Email