const qs = require('qs');
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layouts/Layout'
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Select, MenuItem, Checkbox, ListItemText, Button, Switch } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import { styled } from '@mui/material/styles';
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react"
const shortlisted = () => {
  const [batch, setBatch] = useState([]);
  const [data, setData] = useState("");
  const [meta, setMeta] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [filteredData, setFilteredData] = useState([]);
  const [batchId, setBatchId] = useState('');
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
  
      const response = await axios.get(`/student_registrations/assessment_pagedata?${query}`, {
        headers: {
          "Authorization": `Bearer ${session.user.data.access_token}`
        }
      });
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
  axios.get('/student_registrations/assessment_pagedata',  {
    headers: {
      "Authorization": `Bearer ${session?.user.data.access_token}`
    }},{
    params: {
      batchId,
   
      filterText,
    },
  })

}, [batchId, filterText]);

useEffect(() => {
  if (data && data.data) {
    const filteredResults = data.data.filter((student) => {
     
      const batchFilter = batchId === '' || student.batchId === batchId;
      const searchFilter = filterText === '' ||  student.Student.name.toLowerCase().includes(filterText.toLowerCase());

      return  batchFilter && searchFilter;
    });

    setFilteredData(filteredResults);
  }
}, [status, batchId, filterText, data]);
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
const handleDownload = () => {

  const rows = data.data.map((data) => ({
    name: data.Student.name,
    vuid: data.Student.vuid,
    degree:data.Student.Degree.title,
    attendance:data.attendance,

  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.utils.sheet_add_aoa(worksheet, [
      ["Student Name", "Student Vuid","Student Degree","Student Attndance"],
  ]);

  XLSX.writeFile(workbook, "Assesment List.xlsx", { compression: true });
};
  return (
    <Layout>
  <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Assesment List
        </div> 
      <CardContent>
   <div className="overflow-hidden my-2 px-1 py-3 rounded-lg  w-full  flex flex-wrap  border border-gray-200 md:flex-nowrap gap-7">
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
                      {/* {batch.map((b) => (
                        <MenuItem key={b.id} value={b.name}>{b.name}</MenuItem>
                      ))} */}
          </Select>
        
       
      </div>
     
      
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
          <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-black">
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>VUID</TableCell>
         
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Name</TableCell>
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Degree</TableCell>
            <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Attendance</TableCell>
            <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Enter Marks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student, index) => (<TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                  <TableCell className="px-4 text-center py-2 text-sm">  
                                  {getSerialNumber(index)}
          </TableCell>

                  <TableCell className="px-4 text-center py-2 text-sm border">
                  {student&&student.Student&&student.Student.vuid}
                  </TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student&&student.Student&&student.Student.name}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border"> {student && student.Student && student.Student.Degree && student.Student.Degree.title}</TableCell>
                  <TableCell className="px-4 text-center py-2 text-sm border">{student.attendance}</TableCell>
                 
              <TableCell className='px-4 py-2 text-center text-sm border '>
             

           
                <div className='flex'>
                   <Tooltip title="Test Result">
            
                  <a href={'/students/testresult/' + student.id}
                  >
                  <RuleOutlinedIcon/>
                  </a> </Tooltip>

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