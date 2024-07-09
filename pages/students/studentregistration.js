import Layout from '../../components/Layouts/Layout'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert';
import { Select, MenuItem, Checkbox } from '@mui/material';
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
import { code } from '@nextui-org/theme';
import { useSession } from "next-auth/react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const studentregistration = () => {
    const { data: session } = useSession();
    const [showForm, setShowForm] = useState(false);
    const [cityId, setCityId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [batchId, setBatchId] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState([]);
    const [subject, setSubject] = useState([]);
    const [degree, setDegree] = useState("");
    const [vuid, setVuid] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [cnic, setCnic] = useState("");
    const [isEnrolledInProject, setIsEnrolledInProject] = useState("");
    const [registeredSubjects, setRegisteredSubjects] = useState([]);
    const [data, setData] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [grade, setGrade] = useState('');
    const [batch, setBatch] = useState('');
    const [isError, setIsError] = useState('');
    const [tableData, setTableData] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    const handleOpenForm = () => {
        setShowForm(true);
    };
    const handleCloseForm = () => {
        setShowForm(false);
    };


    useEffect(() => {
        axios.get("/student_registrations/get_create", {
            headers: {
                "Authorization": `Bearer ${session?.user.data.access_token}`
            }
        })
        .then((res) => {
            setData(res.data);
            setStudentId(res.data.student.student.id);
            setName(res.data.student.student.student.name);
            setVuid(res.data.student.student.student.vuid); 
            setEmail(res.data.student.student.email);
            setCity(res.data.cities);
            setPhone(res.data.student.student.student.phone);
            setCnic(res.data.student.student.student.cnic);
            setDegree(res.data.student.student_degree.student.degree.title);
            setCnic(res.data.student.student.student.cnic);
            setSubject(res.data.student.degree_subjects); 
            setBatch(res.data.student.batch.name);
            setBatchId(res.data.student.batch.id);
            console.log(res.data);
        })
        .catch((error) => {
            setIsError(error);
        });
    }, [session]);
    
const [fileInput, setFileInput] = useState(null);

 
const formData = new FormData();

formData.append('cv', fileInput);
formData.append('cgpa', cgpa);
formData.append('isEnrolledInProject', isEnrolledInProject);
formData.append('studentId', studentId);
formData.append('batchId', batchId);
formData.append('cityId',cityId);
tableData.forEach((obj, index) => {
 Object.entries(obj).forEach(([key, value]) => {
      formData.append(`registeredSubjects[${index}][${key}]`, value);
    });
  });
const postdata = async () => {
  try {
   const response = await axios.post(`/student_registrations/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${session?.user.data.access_token}`
        },
      });
    Swal.fire({
      code: "Success!",
      text: "Student Registeration Successfully",
      icon: "success"
    });
    console.log(response.data);
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      code: 'An error Occurred!',
      text: err.response.data.message,
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await postdata();
};

const handleSave = (event) => {
    event.preventDefault();

    if (typeof window !== "undefined" && window.localStorage) {
        const storedData = localStorage.getItem('yourTableDataKey');
        const existingData = storedData ? JSON.parse(storedData) : [];
        const newEntry = {
            id: selectedId,
            code: code,
            grade: grade
        };
        const isDuplicate = existingData.some(entry => entry.id === newEntry.id);
        if (isDuplicate) {
            alert('ID already exists. Please choose a different ID.');
            return;
        }
        localStorage.setItem('yourTableDataKey', JSON.stringify([...existingData, newEntry]));
        setTableData(prevTableData => [...prevTableData, newEntry]);
        setCode('');
        setGrade('');
        setSelectedId('');
    } else {
        alert('Local Storage not Found');
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
<Card className='m-3'>
<div className='bg-[#8fb0a5] p-2  text-black text-lg font-serif '>
        Basic Information
        </div> 
    <CardContent>
                    <div className="md:flex flex-row items-center mx-20 gap-24">


                        <div className="w-full  mt-2 flex flex-col">
                            <label className="  text-md leading-none">Name</label>
                            <input type="name"
                                name="name"
                                value={name}
                                readOnly
                                disabled
                                className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500  " />
                        </div>

                        <div className="w-full  mt-2 flex flex-col">
                            <label className="  text-md leading-none">VUID</label>
                            <input type="name"
                                name="name"
                                value={vuid}
                                readOnly
                                disabled
                                className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500  " />
                        </div>


                    </div>
                    <div className="md:flex flex-row items-center mx-20 gap-24">

                         <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="  text-md leading-none">Email</label>
                            <input
                                value={email}
                                readOnly
                                disabled
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                        </div>
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="  text-md leading-none ">Phone Number</label>
                            <input
                                value={phone}
                                readOnly
                                disabled
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />

                        </div>
                    </div>
                    <div className="md:flex flex-row items-center mx-20  gap-24">  
                         <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="  text-md leading-none">CNIC</label>
                            <input
                                value={cnic}
                                readOnly
                                disabled
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                        </div>  
                         <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="  text-md leading-none">City</label>
                            <Select
                                className='  w-full h-8 mt-2 bg-white  rounded-lg border border-gray-500   px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40 '
                                value={cityId}
                                onChange={(e) => setCityId(e.target.value)}
                            >
                                <MenuItem value="">Select City</MenuItem >
                                {city.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem >
                                ))}
                            </Select>
                        </div>  </div></CardContent></Card>
                        <Card className='m-3'>
                    <div className='bg-[#8fabb0] p-2  text-black text-lg font-serif '>
        Degree Relevant Information
        </div>
        <CardContent>
            <div className="md:flex flex-row items-center mx-20  gap-24">
   <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="  text-md leading-none">Batch</label>
                            <input
                                value={batch}
                                readOnly
                                disabled
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                        </div>
                       
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="  text-md leading-none ">Degree</label>
                            <input
                                value={degree}
                                readOnly
                                disabled
                                type="text" name="text" id="text" className="leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />

                        </div>
                       
                    </div>
        
                          <div className="md:flex flex-row items-center mx-20  gap-24">

                         <div className="w-full flex flex-col mt-2 md:w-1/2">
                            <label className="  text-md leading-none">CGPA</label>
                            <input
                                value={cgpa}
                                onChange={(e) => setCgpa(e.target.value)}
                                type="text" name="text" id="text" className=" leading-none text-gray-900 p-1 mt-2 focus:outline-none focus:border-blue-700   border rounded-md border-gray-500" />
                        </div>
                        
    
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
 
 

      
                         
                          
      
                  
</div>


    
    </div>
        </CardContent>
                    </Card>
                      
                    <Card className='m-3'>
                      <div className='bg-[#8f98b0] p-2    text-black text-lg font-serif '>
                      Eligibility Section
        </div>
        <CardContent>  
      <div className="w-full  mt-2 justify-center mx-20  flex flex-col">
           <label className='text-md leading-none'> Have you selected CS619 in Current course selection i.e. Fall 2023?
      </label>
                            <label className="  text-md leading-none ">Project Enrollment
                             <Checkbox
  checked={isEnrolledInProject}
  inputProps={{ 'aria-label': 'isEnrolledInProject' }}
  onChange={(e) => setIsEnrolledInProject(e.target.checked)}
    />

                            </label>


                    
                    </div></CardContent>
                    </Card>
                    <Card className='m-3'>
                    <div className='bg-[#908fb0] p-2    text-black text-lg font-serif '>
                      Upload  File 
        </div>
        <CardContent> 
        <div className="w-full  mt-2 justify-center mx-20 gap-2  flex flex-col">     
 <label>Only PDF & Word documents are allowed with maximum file size 10MB.</label>

<div className="flex flex-col">
    <label className="  text-md leading-none">Upload File <input
        className="inline-flex cursor-pointer appearance-none rounded-l-md border border-gray-500  bg-white px-2 py-1 text-sm transition focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
        type="file"
        ref={(input) => input && input.setAttribute("accept", ".txt,.pdf")}
        onChange={(event) => {
          const selectedFile = event.target.files[0];
          setFileInput(selectedFile)
          console.log(fileInput)
          if (fileInput && fileInput.files) {
            fileInput.files[0] = selectedFile;
            console.log(fileInput.files[0])
          }
        }} /></label>
  

     
     
   
                         
                          
      
                  
</div>

</div></CardContent>    
</Card>
                      
<Card className='m-3'>
                      <div className='bg-[#95b08f] p-2    text-black text-lg font-serif '>
                      Prerequisite Subjects 
        </div>
        <CardContent>    
        <div className="w-full   justify-center  flex flex-col">  
 <label className='mx-20'>Select the grades appearing in your LMS grade book. If you haven't studied any subject, select N/A</label>
                      

 <div className="flex justify-end flex-column   space-x-3 m-3">
     <button
                        type="button"
                        onClick={handleOpenForm}
                        className="hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424]  duration-300"
                    >
                        Add Subject
                    </button>
                        <SweetAlert
                        show={showForm}
                        title="Test Schedule Form"
                        onConfirm={handleCloseForm}
                        showConfirm={false}
                    
                        >
                            <form>
                                <div className=" flex-col flex">
                                    <label className="  text-md  leading-none " >Degree</label>

                                    <input
                                        value={degree}
                                        type="text" name="text" id="text" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700   border rounded-md border-gray-200" />
                                    <label className="  text-md  leading-none " >Subject</label>
                                    <select
    className='w-full bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
    value={code}
    onChange={(e) => {
        const selectedCode = e.target.value;
        const selectedId = subject
        .flatMap(degree => degree.student.degree.subjects)
        .find(subject => subject.code === selectedCode)?.id;

    setCode(selectedCode);
    setSelectedId(selectedId);
    }}
>
    <option value="">Select Subject</option>
    {subject &&
        subject.map(degree =>
            degree.student.degree.subjects.map(b => (
                <option key={b.id} value={b.code}>
                    {b.code}
                </option>
            ))
        )}
</select>


                                    <label className="  text-md  leading-none ">Grade</label>
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

                                    <button onClick={handleCloseForm} className="  w-36 h-12 hover:border register font-serif  text-white  bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
                                    <button onClick={handleSave} className=" w-36 h-12 hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                                </div>
                            </form>


                        </SweetAlert>
                    </div>
            
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
                                                
                                                  
                                                   {row.code} 
                                                
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center text-sm border">
                                              
                                                   { row.grade}
                                                
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center text-sm border flex flex-row">
                                               
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

        

                </div>  </CardContent></Card>

                    <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">
                        <Link href={"/studentdashboard"}>
                            <button type='reset' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
                        <button type='submit' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                    </div>

                </form>
      
      </CardContent>
     
    </Card>

                



            
        </Layout>
    )
}

export default studentregistration