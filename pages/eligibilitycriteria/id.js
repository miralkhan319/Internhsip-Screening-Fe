const qs = require('qs');
import SweetAlert from 'react-bootstrap-sweetalert';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../../components/Layouts/Layout'
import Link from 'next/link';
import { Select, MenuItem, Checkbox, ListItemText, Button, Switch } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TablePagination from '@mui/material/TablePagination';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const eligibilitycriteria = () => {
  const [batchId, setBatchId] = useState('');
  const [project, setProject] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [data, setData] = useState("");
  const [data1, setData1] = useState("");
  const [subject, setSubject] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);
  const [batch, setBatch] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [title, setTitle] = useState('');
  const [inc_grade, setInc_Grade] = useState('');
  const [grade, setGrade] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selecteddegree, setSelecteddegree] = useState([]);
  const [registeredSubjects, setRegisteredSubjects] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState("");
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
      const response = await axios.get(`/eligibility_criterias/pagedata?${query}`, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setBatch(response.data.batch);
      setData(response.data.data);
      console.log(response.data.data);
      setMeta(response.data.data.meta);
      console.log(response.data.data.meta)
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


 
  useEffect(() => {
    axios.get('/eligibility_criterias/get_create_degree', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}).then((response) => {
      // setBatch(response.data.batch);
      setData1(response.data);
      console.log(response.data);
    });
  }, []);
  useEffect(() => {
    console.log(`/eligibility_criterias/get_degreesub/${selecteddegree}`);
    axios.get(`/eligibility_criterias/get_degreesub/${selecteddegree}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}
    ).then((response) => {
      // setBatch(response.data.batch);
      setSubject(response.data);
      console.log(response.data);
    });
  }, [selecteddegree]);
  useEffect(() => {
    axios.get('/eligibility_criterias/pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}, {
      params: {
        batchId,
        filterText,
      },
    })
  }, [batchId, filterText]);

  useEffect(() => {
    if (data && data.data) {
      const filteredResults = data.data.filter((data) => {

        const batchFilter = batchId === '' || (data.batch && data.batch.name === batchId);
        console.log(data.Batch && data.Batch.id === batchId)
        console.log( batchFilter)
        const searchFilter = filterText === '' || data.degree.title.toLowerCase().includes(filterText.toLowerCase());

        return batchFilter && searchFilter;
      });

      setFilteredData(filteredResults);
    }
  }, [batchId, filterText, data]);
 
  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleOpenForm1 = () => {
    setShowForm1(true);
  };

  const handleCloseForm1 = () => {
    setShowForm1(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
    console.log(batchId);
    console.log(selecteddegree);
    console.log(cgpa);
    console.log(project);
    console.log(inc_grade);
    handleCloseForm();
  };
  const payLoadData = {
    "batch_id": batchId,
        "degreeId": selecteddegree,
        "minimum_cgpa": cgpa,
        "project_enrollment": project,
        "include_grades": inc_grade,
        "EligibilityCriteriaSubjects": tableData
       }
console.log(payLoadData)
  const postData = async () => {
    try {
      const response = await axios.post("/eligibility_criterias/create", payLoadData,{
        headers: {
          "Authorization": `Bearer ${session.user.data.access_token}`
        }
      });
  
      console.log(response.data);
      Swal.fire({
        title: "Success!",
        text: "Eligibility Criteria Created Successfully!",
        icon: "success"
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred!',
        text: err.response ? err.response.data.message || 'Failed to create eligibility criteria' : 'Failed to create eligibility criteria',
      });
    }
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
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, meta.take);
  };
  const handleSave = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        const storedData = localStorage.getItem('yourTableDataKey');
        const existingData = storedData ? JSON.parse(storedData) : [];
        let newId;
        for (const degree of data1.degrees) {
            const foundSubject = degree.subjects.find(subjectObj => subjectObj.title === title);
            if (foundSubject) {
                newId = foundSubject.id;
             
            }
        }
        if (!newId) {
            alert('Subject ID not found.');
            return;
        }
        const isDuplicate = existingData.some(entry => entry.id === newId);

        if (isDuplicate) {
            alert('ID already exists. Please choose a different ID.');
            return;
        }
        const newData = [...existingData, { id: newId, title, grade }];
        localStorage.setItem('yourTableDataKey', JSON.stringify(newData));
        setTableData(prevTableData => [...prevTableData, { id: newId, title, grade }]);
        setTitle('');
        setGrade('');
    }
};


  const handleDeleteClick = (index) => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedData = localStorage.getItem('yourTableDataKey');
      const existingData = storedData ? JSON.parse(storedData) : [];
      existingData.splice(index,1);

      localStorage.setItem('yourTableDataKey', JSON.stringify(existingData));
      setTableData([...existingData]);
    }
  };


  const [editingIndex, setEditingIndex] = useState(null);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {

    const storedData = localStorage.getItem('yourTableDataKey');
    const existingData = storedData ? JSON.parse(storedData) : [];


    existingData[editingIndex] = { title, grade };


    localStorage.setItem('yourTableDataKey', JSON.stringify(existingData));


    setEditingIndex(null);


    setTableData(existingData);
  };

  const handleCancelEdit = () => {

    setEditingIndex(null);
  };
  return (
    <Layout>
          <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Eligibility Criteria
        </div> 
      <CardContent>
      <div className="overflow-hidden justify-center  px-1 space-x-3  rounded-lg border border-gray-200 flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
          <div className="mr-auto w-full flex items-center  rounded-lg gap-20   ">
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
                  <label htmlFor="email" className="block text-md font-semibold leading-6 text-gray-900">Batch</label>
        

                    <Select
                      className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40 '
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                    >
                      <MenuItem value="">Select Batch</MenuItem >
                      {batch.map((batch) => (
                        <MenuItem key={batch.id} value={batch.id}>{batch.name}</MenuItem >
                      ))}
                    </Select>

                
              </div>

          <div className="flex justify-end flex-column sm:space-x-72 md:space-x-32 space-x-3 m-3">

            <button
              onClick={handleOpenForm}
              className="flex mr-2 gap-3 hover:border register font-serif  text-white bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"

            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
</svg>

              AddCriteria
            </button>


            <SweetAlert

              show={showForm}
              title="Degree Details"
              onConfirm={handleCloseForm}
              showConfirm={false}
            >
              <form action="" method="post" onSubmit={handleSubmit}  >
                <div className=" flex-col flex">
<label className="font-semibold  text-md leading-none mt-8">Batch:<span className='font-md ml-3 text-blue-900 font-serif '>  {batchId}</span></label>
                  <label className="font-semibold  text-md leading-none mt-8">Degree</label>
                  <select
                    className='w-full mt-4 bg-white max-w-lg rounded-lg border border-slate-200 p-2 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                    value={selecteddegree} onChange={(e) => { setSelecteddegree(e.target.value) }}
                  >
                    <option value="">Select Degree</option>
                    {data1 && data1.degrees && data1.degrees.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>


                  <label className="font-semibold  text-md leading-none mt-8">Min CGPA</label>
                  <input
                    value={cgpa} onChange={(e) => { setCgpa(e.target.value) }}
                    className="leading-none text-gray-900 p-2 focus:outline-none focus:boreder-blue-700 mt-4  border rounded-md border-gray-200 placeholder-gray-500" placeholder='Min CGPA' />
                 <div className="flex-row">
    <label className="font-semibold text-md leading-none mt-8 ">Enrollment in Project</label>
    <Checkbox
        inputProps={{ 'aria-label': 'project' }}
        checked={project}
        onChange={(e) => { setProject(e.target.checked) }} 
    >
        Yes
    </Checkbox>
</div>
<div className="flex-row">
    <label className="font-semibold text-md leading-none">Includes Grade</label>
    <Checkbox
        inputProps={{ 'aria-label': 'grade' }}
        checked={inc_grade} 
        onChange={(e) => { setInc_Grade(e.target.checked) }} 
    />
</div>

                  <div className="flex justify-end flex-column   space-x-3 m-3"> <button
                    type="button"
                    onClick={handleOpenForm1}
                    className="hover:border register font-serif text-white bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                  >
                    
                    Add Subject
                  </button>
                    <SweetAlert

                      show={showForm1}
                      title="Test Schedule Form"
                      onConfirm={handleCloseForm1}
                      showConfirm={false}
                    >
                      <form action="" method="post"   >
                        <div className=" flex-col flex">


                          <label className="font-semibold  text-md  leading-none mt-4" >Subject</label>
                          <select
                            className='w-full bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                            value={title} onChange={(e) => { setTitle(e.target.value) }}
                          >
                            <option value="">Select Subject</option>
                            {subject.subjects && subject.subjects.map((subj) => (
                              <option key={subj.id} value={subj.title}>{subj.title}</option>
                            ))}



                          </select>

                          <label className="font-semibold  text-md  leading-none mt-4">Grade</label>
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

                          <button type='reset' onClick={handleCloseForm1} className=" 
w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
                          <button type='save' onClick={handleSave} className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                        </div>
                      </form>





                    </SweetAlert>

                  </div>  
                     <section className="container-fluid mx-auto py-6 ">
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow className="text-sm  tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                             <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Subject</TableCell>
                            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Grade</TableCell>
                            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody value={registeredSubjects} onChange={(e) => { setRegisteredSubjects(e.target.value) }}  >
                          {tableData.map((row, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                              <TableCell className="px-4 py-2 text-center text-sm border">{index + 1}</TableCell>
                              <TableCell className="px-4 py-2 text-center text-sm border">
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                  />
                                ) : (
                                  row.title
                                )}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-sm border">
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                  />
                                ) : (
                                  row.grade
                                )}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-sm border flex flex-row">
                                {editingIndex === index ? (
                                  <>
                                    <button type='save' onClick={handleSaveEdit}>Save</button>
                                    <button type='reset' onClick={handleCancelEdit}>Cancel</button>
                                  </>
                                ) : (
                                  <button type='edit' onClick={() => handleEdit(index)}><a onClick={() => handleEdit(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6 ">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                  </a></button>
                                )}

                                <span  onClick={() => handleDeleteClick(row.index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </span>

                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                  </section>
                </div>
                <div className=" flex justify-center items-center  mt-5 md:gap-16  sm:gap-24 gap-2">

                  <button type='reset' onClick={handleCloseForm} className=" 
w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
                  <button type='submit' className="
w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                </div>
              </form>

            </SweetAlert>

 
          </div>
        </div>




        <section className="container-fluid mx-auto py-6 ">
          <TableContainer className='rounded-lg'>
            <Table>
              <TableHead >
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Degree</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>CGPA</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Project Enrollment</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Include Grade</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Subject</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Action</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((degree, index) => (<TableRow key={degree.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4 py-2 text-sm">                 
                  {getSerialNumber(index)}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm border">

                    {degree && degree.degree && degree.degree.title}
                  </TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{degree.minimum_cgpa}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border"> {degree.project_enrollment ? 'true' : 'false'}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border"> {degree.include_grades ? 'true' : 'false'}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">
                    <ul>
                      {degree.eligibility_criteria_subjects.map((subject) => (
                        <li key={subject.id}>
                          Subject: {subject.subjects && subject.subjects.title}
                          <br />

                          Grade: {subject.grade}
                        </li>
                      ))}
                    </ul>

                  </TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border">  <div className='flex'>
                    <a href={`/eligibilitycriteria/view/` + degree.id}
                    >

                      <RemoveRedEyeIcon />

                    </a>

                  </div></TableCell>

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

export default eligibilitycriteria