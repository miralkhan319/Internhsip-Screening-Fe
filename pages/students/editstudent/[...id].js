import Layout from '../../../components/Layouts/Layout'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert';
import {  Checkbox } from '@mui/material';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/router';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import { useSession } from "next-auth/react"
import { title } from 'process';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const editstudent = () => {
    const router = useRouter();
    const { id } = router.query;
    const [showForm, setShowForm] = useState(false);
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [degree, setDegree] = useState("");
    const [vuid, setVuid] = useState("");
const [cgpa, setCgpa] = useState("");
    const [isEnrolledInProject, setIsEnrolledInProject] = useState("");
    const [registeredSubjects, setRegisteredSubjects] = useState([]);
    const [data, setData] = useState('');
    const [title, setTitle] = useState('');
    const [grade, setGrade] = useState('');
    const [isError, setIsError] = useState('');
    const [tableData, setTableData] = useState([]);
    console.log(typeof registeredSubjects);
    const handleOpenForm = () => {
        setShowForm(true);
    };
    const handleCloseForm = () => {
        setShowForm(false);
    };
    const payLoadData = {
        "cgpa": cgpa,
        "isEnrolledInProject": isEnrolledInProject,
        "registeredSubjects": tableData.map(entry => ({ id:entry.Id,title:entry.title, grade: entry.grade }))


    }

    useEffect(() => {
        console.log(`/student_registrations/get_update/${id}`);
        axios.get(`/student_registrations/get_update/${id}`, {
            headers: {
              "Authorization": `Bearer ${session?.user.data.access_token}`
            }})
            .then((res) => {
                setData(res.data);
                setName(res.data.registration.student.name);
                setVuid(res.data.registration.student.vuid);
                setCity(res.data.registration.base_city.name);
                setDegree(res.data.registration.student.degree.title);
                setCgpa(res.data.registration.cgpa);

            })
            .catch((error) => {
                setIsError(error);
            });
    }, [id,session]);

    const postData = async () => {

        axios.patch(`/student_registrations/update/${id}`, payLoadData, {
            headers: {
              "Authorization": `Bearer ${session?.user.data.access_token}`
            }})
            .then((res) => {
                Swal.fire({
                    title: "Sucess!",
                    text: "Student Registartion Updated Sucessfully",
                    icon: "success"
                });
                console.log(res);
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
        console.log(cgpa);
        console.log(isEnrolledInProject);
        console.log(tableData);
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedData = localStorage.getItem('yourTableDataKey');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setTableData(parsedData);
            }
        }
    }, []);
    const handleSave = () => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedData = localStorage.getItem('yourTableDataKey');
            const existingData = storedData ? JSON.parse(storedData) : [];
            const newid = data.Subject.find(subjectObj => subjectObj.title === title)?.id;
            const isDuplicate = existingData.some(entry => entry.Id === newid);
            if (isDuplicate) {
                alert('ID already exists. Please choose a different ID.');
                return;
            }
            const newData = [...existingData, { Id: newid, title, grade }];
            localStorage.setItem('yourTableDataKey', JSON.stringify(newData));
            setTableData(prevTableData => [...prevTableData, { id: newid, title, grade }]);
            setTitle('');
            setGrade('');
            handleCloseForm();
        }
    };
    
    const handleDeleteClick = (id) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedData = localStorage.getItem('yourTableDataKey');
          if (storedData) {
            const existingData = JSON.parse(storedData);
            const updatedData = existingData.filter(item => item.id !== id);
      
            localStorage.setItem('yourTableDataKey', JSON.stringify(updatedData));
            setTableData(updatedData);
          }
        }
      };


  
    return (
        <Layout>
            <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Edit Student Registration
        </div> 
      <CardContent>
 
        <form action="" method="post" onSubmit={handleSubmit} >

                    <div className="md:flex flex-row items-center mx-20  gap-24">


                        <div className="w-full md:w-2/5 mt-2 flex flex-col">
                            <label className="font-semibold  text-lg leading-none">Name</label>
                            <input type="name"
                                name="name"
                                value={name}
                                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-200 "  />
                        </div>

                        <div className="w-full md:w-2/5 mt-2 flex flex-col">
                            <label className="font-semibold  text-lg leading-none">VUID</label>
                            <input type="name"
                                name="name"
                            value={vuid}
                                className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-200 " />
                        </div>


                    </div>

                    <div className="md:flex flex-row items-center mx-20  gap-24">

                        <div className="w-full md:w-2/5 mt-2   flex flex-col">
                            <label className="font-semibold  text-lg leading-none">City</label>
                            <input
                              value={city}
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-200" />
                        </div>
                        <div className="w-full md:w-2/5 mt-2  flex flex-col">
                            <label className="font-semibold  text-lg leading-none ">Degree</label>
                            <input
                             value={degree}
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-200" />

                        </div>
                    </div>
                    <div className="md:flex flex-row items-center mx-20 gap-24">

                        <div className="w-full md:w-2/5 mt-2   flex flex-col">
                            <label className="font-semibold  text-lg leading-none">CGPA</label>
                            <input
                                value={cgpa}
                                onChange={(e) => setCgpa(e.target.value)}
                               
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-200" />
                        </div>
                        <div className="w-full md:w-2/5 mt-2 align-center  flex flex-row">
                            <label className="font-semibold  text-lg leading-none ">Project Enrollment
                                <Checkbox
  value={isEnrolledInProject}
//   checked={data && data.registration && data.registration.is_enrolled_project}
  inputProps={{ 'aria-label': 'isEnrolledInProject' }}
  onChange={(e) => setIsEnrolledInProject(e.target.checked)}
/>
                            </label>


                        </div>
                    </div>
                    <div className="flex justify-end flex-column mx-20  space-x-3 m-3"> <button
                        type="button"
                        onClick={handleOpenForm}
                        className="hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                    >
                        Add Subject
                    </button>
                        <SweetAlert

                            show={showForm}
                            title="Test Schedule Form"
                            onConfirm={handleCloseForm}
                            showConfirm={false}
                        >
                            <form action="" method="post"   >
                                <div className=" flex-col flex">
                                    <label className="font-semibold  text-lg  leading-none mt-4" >Subject</label>
                                    <select
                                        className='w-full bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                        value={title} onChange={(e) => { setTitle(e.target.value) }}
                                    >
                                        <option value="">Select Batch</option>
                                        {data && data.Subject && data.Subject.map((b) => (
                                            <option key={b.id} value={b.title}>{b.title}</option>
                                        ))}
                                    </select>

                                    <label className="font-semibold  text-lg  leading-none mt-4">Grade</label>
                                    <select
                                        className='w-full bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                        value={grade} onChange={(e) => { setGrade(e.target.value) }}
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="A">A</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>




                                </div>
                                <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">

                                    <button onClick={handleCloseForm} className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
                                    <button onClick={handleSave} className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                                </div>
                            </form>


                        </SweetAlert>
                    </div>
                    <section className="container-fluid mx-auto py-6 ">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                                        <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                                        <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Subject</TableCell>
                                        <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Grade</TableCell>
                                        <TableCell className='px-4 text-center border-x border-black py-2 text-white'>action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody value={registeredSubjects} onChange={(e) => { setRegisteredSubjects(e.target.value) }}  >
                                    {tableData.map((row, index) => (
                                        <TableRow key={index} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                                            <TableCell className="px-4 text-center py-2 text-sm border">{index + 1}</TableCell>
                                            <TableCell className="px-4 text-center py-2 text-sm border">
                                               
                                                    {row.title}
                                            
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center text-sm border">
                                               
                                                   {row.grade} 
                                               
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-sm text-center border flex flex-row">
                                               
                                            <button onClick={() => handleDeleteClick(row.id)}>
                                    <span  onClick={() => handleDeleteClick(row.index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </span>

</button> 

                                        

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    
                    </section>
                    <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">
                        <Link href={"/students/registerlist"}>
                            <button type='reset' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
                        <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                    </div>

                </form>
      </CardContent>
     
    </Card>
         
        </Layout>
    )
}

export default editstudent