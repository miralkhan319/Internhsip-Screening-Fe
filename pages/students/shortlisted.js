const qs = require('qs');
import SweetAlert from 'react-bootstrap-sweetalert';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Layout from '../../components/Layouts/Layout'
import Paper from '@mui/material/Paper';
import { Select, MenuItem, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import * as XLSX from "xlsx";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Router from 'next/router';
import Link from 'next/link';
import InputAdornment from '@mui/material/InputAdornment';
import { useSession } from "next-auth/react"
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  ...theme.typography.body2,
  textAlign: 'center',
}));
const DynamicEditor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const shortlisted = () => {
  const { data: session } = useSession();
  const [batchId, setBatchId] = useState('');
  const [data, setData] = useState("");
  const [meta, setMeta] = useState("");
  const [testdate, setTestdate] = useState("");
  const [testaddress, setTestaddress] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [batch, setBatch] = useState([]);
  const [studentId, setStudentId] = useState([]);
  const [sRIds, setsRIds] = useState([]);
  const [sREmails, setsREmails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const[status,setStatus]=useState('ALL')
  const [mailbody, setMailbody] = useState('');
  const [editorState, setEditorState] = useState('');
  const [subj, setSubj] = useState('');
  const [content, setContent] = useState('');
  const [temp, setTemp] = useState('');
  const [subject, setSubject] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
 
 
  const fetchData = async (page, take) => {
    try {
      const query = qs.stringify({
          page,
          take,
      
      }, {
        encodeValuesOnly: true,
      });
 console.log(query)
      const response = await axios.get(`/student_registrations/shortlisted_pagedata?${query}`, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setData(response.data.pageDto);
      console.log(response.data.pageDto)
      setBatch(response.data.batch);
      setMeta(response.data.pageDto.meta);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);
 const getSerialNumber = (index) => {
    return index + 1 + (currentPage - 1) * rowsPerPage;
  };

  const handleCheckboxChange = (e) => {
    const studentId = e.target.value;
    const studentEmail = document.getElementById(studentId).innerText;

    if (e.target.checked) {

      setsRIds(prevIds => [...prevIds, studentId]);
      setsREmails(prevEmails => [...prevEmails, studentEmail]);

    } else {

      setsRIds(prevIds => prevIds.filter(id => id !== studentId));
      setsREmails(prevEmails => prevEmails.filter(email => email !== studentEmail));
    }
  };

  console.log([sRIds, sREmails]);



  useEffect(() => {
    axios.get('/student_registrations/shortlisted_pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}).then((response) => {
      setData(response.data.pageDto);
      console.log(response.data.pageDto)
      setBatch(response.data.batch);
    });
  }, [session]);
  useEffect(() => {
    axios.get('/student_registrations/shortlisted_pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}, {
      params: {
        batchId,
     
        filterText,
      },
    })
  }, [ batchId, filterText]);
  
  useEffect(() => {
    axios.get('/student_registrations/get_sendmailtoshortlist', {
      headers: {
        "Authorization": `Bearer ${session?.user?.data?.access_token}` // Added optional chaining
      }
    })
    .then((response) => {
      setTemp(response.data);
      setSubject(response.data.subject);
      setMailbody(response.data.content);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      
    });
  }, [session]) 
  useEffect(() => {
    if (data && data.data) {
      const filteredResults = data.data.filter((student) => {
       
     
     const batchFilter = batchId === '' || (student.Batch && student.Batch.name === batchId);
        const searchFilter = filterText === '' ||  student.Student.name.toLowerCase().includes(filterText.toLowerCase());
  
        return   batchFilter && searchFilter;
      });
  
      setFilteredData(filteredResults);
    }
  }, [status, batchId, filterText, data]);




  const payLoaddata={
    "SRIds": sRIds,
    "subject": subject,
    "mailbody": mailbody,

  }
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
  fetchData(newPage, meta.take);
};
const postData2 = async () => {
  axios.post(`/student_registrations/send_emails_for_shortlisted`, payLoaddata,{
    headers: {
      "Authorization": `Bearer ${session?.user.data.access_token}`
    }}, )
    .then((res) => {
      console.log(res.data);
      Swal.fire({
        title: "Success!",
        text: "Email Sent Successfully",
        icon: "success"
      });
      Router.reload();
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

  const isWindowDefined = typeof window !== 'undefined';
  const handleSubmit2 = async (e) => {
    await postData2();
    console.log(mailbody);
    console.log(subject);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleContentChange = (newContent) => {
    setMailbody(newContent);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
    console.log(sRIds);
    console.log(testdate);
    console.log(testaddress);
    handleCloseForm();
  };

  const payLoadData={
          "SRIds": sRIds,
          "testdate": testdate,
          "testaddress": testaddress,

        }
  const postData = async () => {
    if (sRIds.length === 0) {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Select at least one student for Test Schedule!',
      });

    } else {
      axios.post("/student_registrations/create_schedule",payLoadData, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }}
        
      )
        .then((res) => {
          console.log(res.data)
          Swal.fire({
            title: "Sucess!",
            text: "Test Schedule Sucessfully",
            icon: "success"
          });
          Router.reload();
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
  };
  const handleDownload = () => {

    const rows = data.data.map((data) => ({
      title: data.Student.name,
      email: data.Student.User.email,
      degree:data.Student.Degree.title,
      city:data.City.name,
      testdatae:data.testdate,
      testaddress:data.testaddress
    }));
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
    XLSX.utils.sheet_add_aoa(worksheet, [
        ["Student Name", "Student Email","Student Degree","Student City","Student Test  Date","Student Test Address"],
    ]);
  
    XLSX.writeFile(workbook, "Shortlisted List.xlsx", { compression: true });
  };
  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Shortlisted Students
        </div> 
      <CardContent>
    <div className="overflow-hidden my-2 px-1 py-3 rounded-lg w-full   border border-gray-200 flex flex-wrap md:flex-nowrap gap-7">
     <div className=" mr-auto w-full  flex items-center overflow-hidden rounded-lg  gap-5   ">
                <label htmlFor="simple-search" className="sr-only  w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">Search</label>
                <div className="relative w-full ">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                  </div>
                  <input value={filterText}
  onChange={(e) => setFilterText(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                </div>
            

              </div>
                <div className="sm:col-span-2 flex items-center justify-center sm:gap-3 gap-0 ml-auto ">
                  <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900">Batch</label>
        

                    <Select
                      className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40 '
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                    >
                      <MenuItem value="">Select Batch</MenuItem >
                      {batch.map((batch) => (
                        <MenuItem key={batch.id} value={batch.name}>{batch.name}</MenuItem >
                      ))}
                    </Select>

                
              </div>
                   <div className="flex justify-end flex-column   space-x-3 m-3">
                     <button
          type="button"
          onClick={handleOpenForm}
          className="mr-2 gap-3 flex hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path strokelinecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>

          TestSchedule
        </button>

          <SweetAlert

            show={showForm}
            title="Test Schedule Form"
            onConfirm={handleCloseForm}
            showConfirm={false}
          >
            <form action="" method="post" onSubmit={handleSubmit}  >
              <div className=" flex-col flex">

                <label className="font-semibold  text-lg leading-none">Batch</label>
             
                <input type="name"
                  value={batchId}
   className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500 " />


                <label className="font-semibold  text-lg leading-none">Test Date</label>
                <input
                  value={testdate} onChange={(e) => { setTestdate(e.target.value) }}
                  type="datetime-local"
                  name="datetime"
                  id="datetime" className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />



                <label className="font-semibold  text-lg  leading-none">Test Address</label>
                <input

                  value={testaddress} onChange={(e) => { setTestaddress(e.target.value) }}

                  className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-4  border rounded-md border-gray-500" />
              </div>
              <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">

                <button  type="reset" onClick={handleCloseForm} className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
                <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
              </div>
            </form>
          </SweetAlert>

          <button
            type="button"
            onClick={handleOpenModal}
            className=" flex mr-2 gap-3 hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
          >
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path strokelinecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>


            SendEmail
          </button>
          <SweetAlert
            show={showModal}
            title="Email for shortlisted"
            onConfirm={handleCloseModal}
            showConfirm={false}
          >
            <DemoPaper square={false} className='ml-4 mr-4 mt-5'>
              <div className="mb-4">

                <Input
                  className='w-full'
                  id="input-with-icon-adornment"
                  readOnly
                  name='to'
                  value={sREmails}
                  startAdornment={<InputAdornment position="start">To</InputAdornment>}
                />


              </div>

              <div className="mb-2">            <TextField

                className='w-full'
                id="input-with-icon-adornment"
                label=""
                value={subject}
                onChange={(e) => { setSubject(e.target.value) }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Subject</InputAdornment>,
                }}
              />
              </div>


              <Box
                component="form"
                noValidate
                autoComplete="off"
            
              >

                
                    <div className="border-black h-full">
            {isWindowDefined && (
              <DynamicEditor
                editorState={editorState}  
                
                onEditorStateChange={(newEditorState) => {
                  setEditorState(newEditorState);
                  handleContentChange(newEditorState.getCurrentContent().getPlainText('\u0001'));
                }}
              />
            )}
            
        
          </div>


               

              </Box>
            </DemoPaper>
            <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">

              <button onClick={handleCloseModal} className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
              <button onClick={() => {
                handleSubmit2();
                handleCloseModal();
              }} className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Send</button>       </div>
          </SweetAlert>
        </div>
        <div className="sm:col-span-2 flex items-center justify-center sm:gap-3 gap-0 ml-auto ">
  <button type='button'  className="mr-2 gap-3 flex hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300" onClick={handleDownload}>
    ExporttoEXCEL
  </button> 
  </div>
            </div> 
      
 
        <section className="container-fluid mx-auto py-6 ">
          <TableContainer className='rounded-lg'>
            <Table>
              <TableHead >
                <TableRow className="text-md font-semibold tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Student</TableCell>

                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>City</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>CGPA</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Test date</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Test Address</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (<TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4 text-center py-2 text-sm">
                    <Checkbox
                      value={student.id}
                      data-email={student.email}
                      onChange={handleCheckboxChange}
                      checked={sRIds.includes(student.id)}
                      inputProps={{ 'aria-label': 'Checkbox A' }}
                    /> {getSerialNumber(index)}
                  </TableCell>

                  <TableCell className="px-4 py-2 text-center text-sm border">
                    <ul>
                      <li>{student && student.Student && student.Student.name}</li>
                      <li id={student.id}>{student && student.Student && student.Student.User && student.Student.User.email}</li>
                      <li>{student && student.Student && student.Student.Degree && student.Student.Degree.title}</li>
                    </ul>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border">{student.City.name}</TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border">{student.cgpa}</TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border"> {student.testdate}</TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border">{student.testaddress}</TableCell>
                  <TableCell className='px-4 py-2 text-center text-sm border '>

                    <div className='flex'>
                    <Tooltip title="Attendance">
             <a href={`/students/attendance/` + student.id}>
                        <GroupAddOutlinedIcon checked={student.attendance} />
                      </a>

            </Tooltip>
                     
                    </div>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
  component="div"
  count={meta.itemCount}
  page={currentPage - 1} // Adjust page number for zero-based index
  onPageChange={(event, newPage) => handlePageChange(newPage + 1)} // Adjust the newPage value
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  }}
  rowsPerPageOptions={[1, 5, 10, 25, 50]}
  showFirstButton
  showLastButton
/>
        </section>
      
      </CardContent>
     
    </Card>
     
      
         
        
       
     
    </Layout>
  )
}

export default shortlisted