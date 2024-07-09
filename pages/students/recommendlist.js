const qs = require('qs');
import SweetAlert from 'react-bootstrap-sweetalert';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../../components/Layouts/Layout'
import * as XLSX from "xlsx";
import { Select, MenuItem, Checkbox } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Link from 'next/link';
import InputAdornment from '@mui/material/InputAdornment';
import { useSession } from "next-auth/react"
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useRouter } from 'next/router';
const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  ...theme.typography.body2,
  textAlign: 'center',
}));
const DynamicEditor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });
const recommendlist = () => {
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
const[status,setStatus]=useState('ALL')
  const [data, setData] = useState("");
  const [meta, setMeta] = useState("");
  const [student, setStudent] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [batch, setBatch] = useState([]);
  const [studentId, setStudentId] = useState([]);
  const [sRIds, setsRIds] = useState([]);
  const [sREmails, setsREmails] = useState([]);
  const [mailbody, setMailbody] = useState('');
  const [editorState, setEditorState] = useState('');
  const [showModal, setShowModal] = useState(false);
 const [showModal1, setShowModal1] = useState(false);
  const [subject, setSubject] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
 
  const fetchData = async (page, take) => {
    try {
      const query = qs.stringify({
          page,
          take,
      
      }, {
        encodeValuesOnly: true,
      });
 console.log(query)
      const response = await axios.get(`/student_registrations/recommended_students_pagedata?${query}`, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setData(response.data.pageDto);
      setSubject(response.data.subject);
      setMailbody(response.data.content);
      setBatch(response.data.batches);
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
    axios.get('/student_registrations/recommended_students_pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}, {
      params: {
        batchId,
        status,
        filterText,
      },
    })
  }, [status, batchId, filterText]);
  
  useEffect(() => {
    if (data && data.data) {
      const filteredResults = data.data.filter((student) => {
        const statusFilter =
        status === 'ALL' || (status === 'active' && batch.is_active) || (status === 'inactive' && !batch.is_active);
        const batchFilter = batchId === '' || (student.Batch && student.Batch.id === batchId);
        console.log(batchFilter)
        console.log( batchId)
        const searchFilter = filterText === '' ||  student.Student.name.toLowerCase().includes(filterText.toLowerCase());
  
        return statusFilter && batchFilter && searchFilter;
      });
  
      setFilteredData(filteredResults);
    }
  }, [status, batchId, filterText, data]);
  const payLoadData={
    "SRIds": sRIds,
    "subject": subject,
    "mailbody": mailbody,

  }
  const postData2 = async () => {
    try {
      const response = await axios.patch(
        `/student_registrations/sendemailtoselectedstudents`,
        payLoadData,
        {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }
        }
      );
      console.log(response.data);
      Swal.fire({
        title: "Success!",
        text: "Email Sent Successfully",
        icon: "success"
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred!',
        text: error.response.data.message || 'Something went wrong!',
      });
    }
  };
  
  useEffect(() => {
    axios.get(`/student_registrations/get_send_to_selected`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((response) => {
        setSubject(response.data.subject);
        setMailbody(response.data.content);
        console.log(response.data);
      });
  }, [session]);
  useEffect(() => {
    // Check if batchId is truthy before making the request
    if (batchId && session?.user?.data?.access_token) {
      axios.get(`/student_registrations/emails_through_batch/${batchId}`, {
        headers: {
          "Authorization": `Bearer ${session.user.data.access_token}`
        }
      })
        .then((response) => {
          // Assuming response.data is an object with properties subject and content
          setStudent(response.data);
          setSubject(response.data.subject);
          setMailbody(response.data.content);
          console.log(response.data);
        })
        .catch((error) => {
          // Handle errors if necessary
          console.error('Error fetching data:', error);
        });
    }
  }, [batchId, session]);
  const handleContentChange = (newContent) => {
    setMailbody(newContent);
  };
  const payLoadData2={
  
    "subject": subject,
    "mailbody": mailbody,

  }

  const postData = async () => {
    try {
      const res = await axios.patch(
        `/student_registrations/send_email_to_recommended_through_batch/${batchId}`,
        payLoadData2,
        {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }
        }
      );
      Swal.fire({
        title: "Success!",
        text: `Email sent successfully to students: ${student.map(student => student.email).join(", ")}`,
        icon: "success"
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred!',
        text: 'Unable to send email. Please try again later.',
      });
    }
  };
  
  

  const handleSubmit = async (e) => {
    await postData();
    console.log(mailbody);
    console.log(subject);
  };
  const isWindowDefined = typeof window !== 'undefined';
  const handleSubmit2 = async (e) => {
    await postData2();
    console.log(mailbody);
    console.log(subject);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, meta.take);
  };
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleOpenModal1 = () => {
    setShowModal(true);
  };
  const handleCloseModal1 = () => {
    setShowModal(false);
  };
  const handleDownload = () => {

    const rows = data.data.map((data) => ({
      // title: data.Student.name  ,
      // email: data.Student.User.email,
      // vuid:data.Student.vuid,
      phase:data.Phases.name,
      city:data.City.name
    }));
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
    XLSX.utils.sheet_add_aoa(worksheet, [
        ["Student Name", "Student Email", "Student Vuid","Student Phase","Student City"],
    ]);
  
    XLSX.writeFile(workbook, "Recommeded List.xlsx", { compression: true });
  };
  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Recommended Student List
        </div> 
      <CardContent>
     
        <div className="overflow-hidden my-2 px-1 py-3 rounded-lg border border-gray-200 w-full flex flex-wrap md:flex-nowrap gap-7">
     <div className=" mr-auto w-full  flex items-center overflow-hidden rounded-lg  gap-5   ">
      <label htmlFor="simple-search" className="sr-only  w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">Search</label>
      <div className="relative w-full ">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
        </div>
        <input value={filterText}
        onChange={handleFilterChange} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
      </div>
     




 <div className="sm:col-span-2 flex items-center justify-center sm:gap-3 gap-0 ml-auto ">
        <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900">Batch</label>
      
          <Select className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40    '  value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}>
             <MenuItem value="">Select Batch</MenuItem>
                      {batch.map((b) => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                      ))}
          </Select>
        
       
      </div>
    <button
  type="button"
  onClick={handleOpenModal}
  className="mr-2 flex gap-3 hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
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

  <DemoPaper square={false} className='ml-4 mr-4 mt-5' >
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
      value={mailbody}
      onChange={(e) => { setMailbody(e.target.value) }}
    >

      <div className="border-black h-full"  value={mailbody}
          onChange={(e) => { setMailbody(e.target.value) }}>
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

    <button onClick={handleCloseModal} className="  w-36 h-12 hover:border register font-serif  text-white  bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">Cancel</button>
    <button onClick={() => {
      handleSubmit2();
    
    }} className=" w-36 h-12 hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">Send</button>       </div>
</SweetAlert>



<button
  type="button"
  onClick={handleOpenModal1}
  className=" mr-2 flex gap-3 hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path strokelinecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
</svg>

  SendEmailtoall
</button>
<SweetAlert
  show={showModal1}
  title="Email for shortlisted"
  onConfirm={handleCloseModal1}
  showConfirm={false}
>

  <DemoPaper square={false} className='ml-4 mr-4 mt-5' >
    <div className="mb-4">

      {student && student.map((item) => (
        <div key={item.id}>
          {item.studentregistrations && item.studentregistrations.map((stud) => (
            <Input
              key={stud.id}
              className='w-full'
              id="input-with-icon-adornment"
              readOnly
              placeholder={stud.student && stud.student.user && stud.student.user.email}
              startAdornment={<InputAdornment position="start">To</InputAdornment>}
            />
          ))}
        </div>
      ))}



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
      value={mailbody}
      onChange={(e) => { setMailbody(e.target.value) }}
    >

      <div className="border-black h-full"   value={mailbody}
          onChange={(e) => { setMailbody(e.target.value) }} >
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

    <button onClick={handleCloseModal1} className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
    <button onClick={() => {
      handleSubmit();
    
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
          <TableContainer>
            <Table>
              <TableHead >
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Degree</TableCell>

                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>City</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Phase</TableCell>


                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (<TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4 py-2  text-center text-sm">
                    <Checkbox
                      value={student.id}
                      data-email={student.email}
                      onChange={handleCheckboxChange}
                      checked={sRIds.includes(student.id)}
                      inputProps={{ 'aria-label': 'Checkbox A' }}
                    /> {getSerialNumber(index)}
                  </TableCell>

                  <TableCell className="px-4 py-2 text-center text-sm border"><ul>

                    <li>{student && student.Student && student.Student.name}</li>
                    <li id={student.id}>{student && student.Student && student.Student.User && student.Student.User.email}</li>
                    <li>{student && student.Student && student.Student.Degree && student.Student.vuid}</li>
                  </ul> </TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student.City.name}</TableCell>
                  <TableCell className="px-4  text-center py-2 text-sm border"> {student.Phases.name}</TableCell>
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

export default recommendlist