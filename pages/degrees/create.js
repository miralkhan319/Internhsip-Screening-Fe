import Layout from '../../components/Layouts/Layout';
import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Checkbox, ListItemText, Button } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
export default function CreateDegree() {
  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [subjectsIDs, setSubjectsIDs] = useState([]);
  const [isError, setIsError] = useState('');
  const { data: session } = useSession();
  const payLoadData = {
    title: name,
    subjectsIDs: subjectsIDs,
  };

  useEffect(() => {
    axios.get('/degrees/get_create' , {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        setIsError(error.message);
      });
  }, [session]);

  const postData = async () => {
    try {
      const response = await axios.post('/degrees/create', payLoadData , {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      Swal.fire({
        title: 'Success!',
        text: "Degree Created Successfully",
        icon: 'success',
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred!',
        text: error.response.data.message,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    console.log(subjectsIDs);
    await postData();
  };

  return (
    <Layout>
 <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Create Degree
        </div> 
      <CardContent>
        
      <form action="" method="post" onSubmit={handleSubmit}>
          <div className="md:flex flex-col m-2 items-center mt-6 mx-20">
            <div className="w-full md:w-2/5 mt-2 flex flex-col">
              <label className="font-semibold text-md leading-none">Name</label>
              <input
                type="name"
                name="name"
                value={name}
                placeholder='Degree Name'
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 "
              />
            </div>

            <div className="w-full md:w-2/5 mt-2  flex flex-col">
              <label className="font-semibold text-md leading-none mb-3">Subjects</label>
              <Select
                labelId="roleLabel"
                id="subjectsIDs"
                multiple
                required
                marginTop={3}
                className="h-11 leading-none bg-white text-gray-900 p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500"
                value={subjectsIDs}
                onChange={(e) => setSubjectsIDs(e.target.value)}
                renderValue={(selectedSubjects) => {
                  const selected = [];
                  for (let subject of data) {
                    for (let selectedSubject of selectedSubjects) {
                      if (subject.id === selectedSubject) {
                        selected.push(subject.title);
                      }
                    }
                  }
                  return selected.join(', ');
                }}
              >
                {data.slice().map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                  {subject.title}
                </MenuItem>
                ))}
              </Select>
            
            </div>
          </div>

          <div className="flex justify-center items-center mt-5 md:gap-16 sm:gap-24 gap-2">
            <Link href={'/degrees'}>
              <Button type='reset' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300"
            >
              Create
            </Button>
          </div>
        </form>
      
      </CardContent>
     
    </Card>


  
    </Layout>
  );
}
