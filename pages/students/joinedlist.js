const qs = require('qs');
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../../components/Layouts/Layout'
import { Select, MenuItem, Checkbox } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import TablePagination from '@mui/material/TablePagination';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Router from 'next/router';
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react"
const joinedlist = () => {
  const [data, setData] = useState("");
  const [test_date, setTest_date] = useState("");
  const [test_address, setTest_address] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [batch, setBatch] = useState([]);
  const [meta, setMeta] = useState("");
  const [sRIds, setsRIds] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
 const[status,setStatus]=useState('ALL');
 const [batchId, setBatchId] = useState('');
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
     const response = await axios.get(`/student_registrations/joined_students_pagedata?${query}`, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }});
     setData(response.data.pageDto);
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



  useEffect(() => {
    axios.get('/student_registrations/joined_students_pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }}).then((response) => {
      setData(response.data.pageDto);
      setBatch(response.data.batch);
      console.log(response.data.pageDto);
    });
  }, [session]);
useEffect(() => {
  axios.get('/student_registrations/joined_students_pagedata', {
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
      const batchFilter = batchId === '' || student.batchId === batchId;
      const searchFilter = filterText === '' ||  student.Student.name.toLowerCase().includes(filterText.toLowerCase());

      return  batchFilter && searchFilter;
    });
// statusFilter &&
    setFilteredData(filteredResults);
  }
}, [status, batchId, filterText, data]);
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
  fetchData(newPage, meta.take);
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

const handleSubmit = (e) => {
  e.preventDefault();
  postData();
  console.log(sRIds);
  console.log(test_date);
  console.log(test_address);
  handleCloseForm();
};

const postData = async () => {
 if (sRIds.length === 0) {
    
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select at least one student for Test Schedule!',
      });

    } else {

  axios.post("/student_registrations/create_schedule",
    {
      "SRIds":sRIds,
      "test_date": test_date,
      "test_address": test_address,

    },
  ), {
    headers: {
      "Authorization": `Bearer ${session?.user.data.access_token}`
    }}
    .then((res) => {
      console.log(res.data)
      Swal.fire({
        title: "Sucess!",
        text: "Test Schedule Sucessfully",
        icon: "success"
      });
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
const callStudentQuite = (e, uid) => {

  const callStudentQuiteLink = '/student_registrations/quite_student/' + uid;
  Swal.fire({
    title: '  Quite Internship',
    text: "Are You Sure? ",
    showCancelButton: true,
    confirmButtonText: 'Quite',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.patch(callStudentQuiteLink, {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }});

        Swal.fire({
          title: "success",
          text: "Student Quite Sucessfully",
          icon: "success"
        });
        Router.reload();
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Student not Deleted",
        });
      }
    }
  });
  console.log(callStudentQuiteLink);

};
const handleDownload = () => {

  const rows = data.data.map((data) => ({
    name: data.Student.name,
    vuid: data.Student.vuid,
    email: data.Student.User.email,
    city:data.City.name,
    phases:data.Phases.name,

  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.utils.sheet_add_aoa(worksheet, [
      ["Student Name", "Student Vuid","Student Email","Student City","Student Phases"],
  ]);

  XLSX.writeFile(workbook, "Joinned List.xlsx", { compression: true });
};
  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Joined Student List
        </div> 
      <CardContent>
   <div className="overflow-hidden my-2 px-1 py-3 rounded-lg w-full   border border-gray-200 flex flex-wrap md:flex-nowrap gap-7">
     <div className=" mr-auto w-full  flex items-center  rounded-lg  gap-5   ">
                <label htmlFor="simple-search" className="sr-only  w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">Search</label>
                <div className="relative w-full ">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                  </div>
                  <input value={filterText}
  onChange={(e) => setFilterText(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                </div>
            

              </div>
              
                <div className="sm:col-span-2 flex items-center justify-center sm:gap-3 gap-0 ">
                  <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900">Status</label>
                
                    <Select className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40    ' value={status}  onChange={(e) => setStatus(e.target.value)}>
                      <MenuItem value="ALL" >All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive"> InActive</MenuItem>
                    </Select>
             
                </div>
                <div className="sm:col-span-2 flex items-center justify-center sm:gap-3 gap-0 ml-auto ">
                  <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900">Batch</label>
        

                    <Select
                      className='w-full h-10 bg-white max-w-lg rounded-lg border border-slate-200 px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40 '
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                    >
                      <MenuItem value="">Select Batch</MenuItem >
                      {batch.map((b) => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem >
                      ))}
                    </Select>

                
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
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Action</TableCell>
         
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (<TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4 text-center py-2 text-sm">           
                  {getSerialNumber(index)}
          </TableCell>

                  <TableCell className="px-4 py-2 text-center text-sm border"><ul>
                    
                    <li>{student&&student.Student&&student.Student.name}</li>
                  <li>{student&&student.Student&&student.Student.User&& student.Student.User.email}</li>
                  <li>{student && student.Student && student.Student.vuid}</li>
                    </ul> </TableCell>
                  <TableCell className="px-4  text-center py-2  text-sm border">{student.City.name}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border"> {student.Phases.name}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border"><div className='flex'>
                  <Tooltip title="Result">
              <a href={'/students/result/'+student.id}>
                    <FormatListNumberedRtlIcon/>
                  </a>

            </Tooltip>
                  
                  <Tooltip title="View">
               <a href={'/students/view/'+student.id}>
                 <RemoveRedEyeOutlinedIcon/></a>

</Tooltip>
<Tooltip title="Quite Student">
            
 <a className=" flex justify-center items-center" onClick={(e) => callStudentQuite(e, student.id)}   >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path strokelinecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>
        </a>
            </Tooltip>
                  
                                                    
                                                    
                                                    </div> </TableCell>
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

export default joinedlist