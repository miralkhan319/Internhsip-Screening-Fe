const qs = require('qs');
import SweetAlert from 'react-bootstrap-sweetalert';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Layout from '../../components/Layouts/Layout'
import Link from 'next/link';
import {  Checkbox } from '@mui/material';
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
import { useSession } from "next-auth/react"
const invitedlist = () => {
  const [data, setData] = useState("");
  const[batch,setBatch]=useState([]);
 const [showForm, setShowForm] = useState(false);

  const [sRIds, setsRIds] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
 const[status,setStatus]=useState('ALL');
 const [batchId, setBatchId] = useState('');
 const router = useRouter();
 const { id } = router.query;
 const [data1, setdata1] = useState("");
 const [phases, setPhases] = useState("");
 const [phases1, setPhases1] = useState([]);
 const [vuid, setVuid] = useState("");
 const [name, setName] = useState("");
 const [phase, setPhase] = useState("");
 const [isError, setIsError] = useState('');
 const [meta, setMeta] = useState("");
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
      const response = await axios.get(`/student_registrations/invited_students_pagedata?${query}`, {
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


 const payLoaddata1 = {
"phaseId": phases,
}
 
const  callUpdateUser = (e, sid) => {
 console.log("/student_Registrations/get_updatephase/" + sid);
 axios.get("/student_Registrations/get_updatephase/" +  sid , {
  headers: {
    "Authorization": `Bearer ${session?.user.data.access_token}`
  }})
.then((res) => {
       setdata1(res.data.student);
       setName(res.data.student.student.name);
       setVuid(res.data.student.student.vuid);
       setPhase(res.data.student.phase.name);
       setPhases1(res.data.phases)
       console.log(res.data.student);
       console.log(res.data.phases);
     })
     .catch((error) => {
       setIsError(error);
     });
 }
 const postdata1 = async (e, studentId) => {
  console.log("/student_registrations/update_phaseto_joined/notjoined/" + studentId);
  axios.patch("/student_registrations/update_phaseto_joined/notjoined/" + studentId, payLoaddata1, {
    headers: {
      "Authorization": `Bearer ${session?.user.data.access_token}`
    }})
    .then((res) => {
      Swal.fire({
        title: "Success!",
        text: "Phase Updated Successfully",
        icon: "success"
      });
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'An error Occurred!',
        text: err.response.data.message,
      });
    });
};

const handleSubmit1 = async (e, studentId) => {
  await postdata1(e, studentId);
};

  console.log(sRIds);

useEffect(() => {
  axios.get('/student_registrations/invited_students_pagedata', {
    headers: {
      "Authorization": `Bearer ${session?.user.data.access_token}`
    }}, {
    params: {
      filterText,
    },
  })
}, [status, batchId, filterText]);

useEffect(() => {
  if (data && data.data) {
    const filteredResults = data.data.filter((student) => {
 
      const searchFilter = filterText === '' ||  student.Student.name.toLowerCase().includes(filterText.toLowerCase());

      return  searchFilter;
    });

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
const handleDownload = () => {

  const rows = data.data.map((data) => ({
    title: data.Student.name,
    email: data.Student.User.email,
    vuid: data.Student.vuid,
    phase:data.Phases.name,
    city:data.City.name
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.utils.sheet_add_aoa(worksheet, [
      ["Student Name", "Student Email", "Student Vuid","Student Phase","Student City"],
  ]);

  XLSX.writeFile(workbook, "Invited List.xlsx", { compression: true });
};

  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Invited Student List
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
            
         <div className="wrapper">
      <button type='button'  className="mr-2 gap-3 flex hover:border register font-serif text-white  bg-[#445279] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300" onClick={handleDownload}>ExporttoEXCEL</button>
    </div>   

         

         
            </div>
    
  <section className="container-fluid mx-auto py-6 ">
    <TableContainer className='rounded-lg'>
    <Table>
        <TableHead >
          <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Student</TableCell>
         
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>City</TableCell>
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Phase</TableCell>
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Action</TableCell>
         
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (
  <TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
    <TableCell className="px-4 py-2  text-center text-sm">  {getSerialNumber(index)}
    </TableCell>

    <TableCell className="px-4 py-2  text-center text-sm border">
      <ul>
        <li>{student && student.Student && student.Student.name}</li>
        <li>{student && student.Student && student.Student.User && student.Student.User.email}</li>
        <li>{student && student.Student && student.Student.Degree && student.Student.vuid}</li>
      </ul>
    </TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border">{student.City.name}</TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border"> {student.Phases.name}</TableCell>
                  <TableCell className="px-4 py-2 text-center text-sm border">
                  <Tooltip title="Update Phase">
            
 <div className='flex' onClick={(e) => callUpdateUser(e, student.id)}>
        <GroupAddOutlinedIcon onClick={handleOpenForm} checked={student.attendance} />

                
<SweetAlert

show={showForm}
title="Update  Phase"

onConfirm={handleCloseForm}
showConfirm={false}
>
<form  className='flex flex-col text-center mx-10' >
 <label className="font-semibold  text-lg leading-none mt-8">Name:<span className='font-md ml-3 text-blue-900 font-serif '>{name}</span></label>

    <label className="font-semibold  text-lg leading-none mt-8">VUID:<span className='font-md ml-3 font-serif text-blue-900'>{vuid}</span></label>

    <label className="font-semibold  text-lg  leading-none mt-8">Current Phase:<span className='font-md ml-3 font-serif text-blue-900 '>{phase}</span></label>
    
<div className=" flex w-full justify-center  gap-8">
    <label className="font-semibold  text-lg  leading-none mt-8">Phase</label>  

<select
value={phases}
onChange={(e) => { setPhases(e.target.value) }}
className="h-12 leading-none bg-white  p-3 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500 mt-4 text-blue-900"
> 
 <option> Select Phase </option> 
{phases1 && phases1.map((phase) => (
  <option key={phase.id} value={phase.id}>
    {phase.name}
  </option>
))}
</select></div>
<div className=" flex w-full justify-center items-center mt-10 gap-8">
<Link href={"/students/invitedlist"}>
  <button type='reset' onClick={handleCloseForm}  className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
  <button     onClick={(e) => {
                handleCloseForm();
                handleSubmit1(e, student.id);
              }}   type='save' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Update</button>
</div>
</form>


</SweetAlert>
   </div>
            </Tooltip>
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

export default invitedlist