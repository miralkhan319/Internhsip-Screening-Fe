const qs = require('qs');
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layouts/Layout'
import Router from 'next/router';
import Link from 'next/link';
import { Select, MenuItem, Checkbox, ListItem, Button, Switch } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Swal from 'sweetalert2';
import TablePagination from '@mui/material/TablePagination';
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react"
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const registerstudentlist = () => {
  const [batchId, setBatchId] = useState('');
  const [data, setData] = useState("");
  const [batch, setBatches] = useState([]);
  const [meta, setMeta] = useState("");
  const [project, setProject] = useState('ALL');
  const [filteredData, setFilteredData] = useState([]);
 const [filterText, setFilterText] = useState('');  
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
     const response = await axios.get(`/student_registrations/registered_students_pagedata?${query}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }});
     setData(response.data.pageDto);
     setBatches(response.data.batch);
     console.log(response.data.pageDto.meta)
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
 const handleFilterChange = (event) => {
   setFilterText(event.target.value);
 };
  useEffect(() => {
    axios.get('/student_registrations/registered_students_pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}, {
      params: {
        batchId,
        project,
        filterText,
      },
    })
  }, [project, batchId, filterText]);
  
  useEffect(() => {
    if (data && data.data) {
      const filteredResults = data.data.filter((student) => {
        const projectFilter = project === 'ALL' || student.is_enrolled_project.toString() === project;
        const batchFilter = batchId === '' || (student.Batch && student.Batch.id === batchId);
        const searchFilter = filterText === '' || student.Student.name.toLowerCase().includes(filterText.toLowerCase());
  
        return projectFilter && batchFilter && searchFilter;
      });
  
      setFilteredData(filteredResults);
    }
  }, [project, batchId, filterText, data]);
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, meta.take);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const postData = async () => {
    if (session && batchId) {
      try {
        const response = await axios.patch(
          `/student_registrations/apply_Eligibility/batchId/${batchId}`,
          null,
          {
            headers: {
              "Authorization": `Bearer ${session.user.data.access_token}`
            }
          }
        );
        console.log(response.data);
        Swal.fire({
          title: "Success!",
          text: "Eligibility Criteria Applied",
          icon: "success"
        });
        Router.reload();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'An error occurred!',
          text: error.response ? error.response.data.message : 'Something went wrong!',
        });
      }
    }
    console.log(`/student_registrations/apply_eligibility/batchId/${batchId}`);
  };
  

  const handleDownload = () => {

    const rows = data.data.map((data) => ({
      name: data.Student.name,
      cgpa: data.cgpa,
      project:data.is_enrolled_project.toString(),
      title:data.Student.Degree.title,
    }));
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
    XLSX.utils.sheet_add_aoa(worksheet, [
        ["Student Name", "Student CGPA","Project Enrollment","Student Degree"],
    ]);
  
    XLSX.writeFile(workbook, "Register List.xlsx", { compression: true });
  };

  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Registered Students List
        </div> 
      <CardContent>
      <div className="overflow-hidden justify-center  px-1 space-x-3  rounded-lg border border-gray-200 flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
          <div className="mr-auto w-full py-1 flex items-center  rounded-lg gap-20   ">
            <label htmlFor="quick-filter" className="sr-only w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">Search</label>
            <div className="relative w-full ">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
              </div>
              <input    value={filterText}
  onChange={(e) => setFilterText(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
            </div>



          </div>
            <div className="flex  items-center sm:gap-3 gap-0">
              <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900"   >project</label>
              
                <Select value={project}
  onChange={(e) => setProject(e.target.value)} className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40  '>
                  <MenuItem value="ALL" >All</MenuItem>
                  <MenuItem value="true">true</MenuItem>
                  <MenuItem value="false"> false</MenuItem>
                </Select>
            
            </div>
            <div className="flex  items-center sm:gap-3 gap-0 ">
              <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900">Batch</label>
             
                <Select className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40  ' value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}>
                  {batch.map((b) => { return (<MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>) })}
                </Select>
              

            </div>
          
             <button onClick={postData} className="m-2 flex gap-3 mr-2 hover:border register font-serif  text-white  bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokewidth="1.5" stroke="currentColor" class="w-6 h-6">
  <path strokelinecap="round" strokelinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
</svg>

              ApplyEgilibility
               </button>
              
      <button type='button'  className=" m-2 mr-2 gap-3 flex hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300" onClick={handleDownload}>ExporttoEXCEL</button>
    

        </div>
      
    
        <section className="container-fluid mx-auto py-6 ">
          <TableContainer className='rounded-lg'>
            <Table>
              <TableHead >
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Name</TableCell>

                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>CGPA</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>P.Enroll</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Degree</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Subjects</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((student, index) => (<TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4  text-center py-2 text-sm">{getSerialNumber(index)}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student && student.Student && student.Student.name} </TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student.cgpa}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student.is_enrolled_project.toString()}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student && student.Student && student.Student.Degree && student.Student.Degree.title}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">   <ul>
                    {student.student_subjects.map((subjects,index) => {
                      return (
                        <li key={subjects.id}>
                          
  
                          {
                            subjects.Subject.map((Subject) => { return ( 
                            <p key={Subject.id} value={Subject.title}>{++index}.  
                            Subject:{Subject.title}<br/> Grade:{subjects.grade}</p>
                            ) })}  
                          
                        </li>
                      )
                    })}


                  </ul>  </TableCell>

                  <TableCell className='px-4 py-2  text-center text-sm border '>
                    <div className='flex'>
                    <Tooltip title="Edit">
               <a href={'/students/editstudent/' + student.id}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
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
  page={currentPage - 1}
  onPageChange={(event, newPage) => handlePageChange(newPage + 1)} 
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

export default registerstudentlist