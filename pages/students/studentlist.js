import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layouts/Layout'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useSession } from "next-auth/react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import qs from 'qs';

const studentlist = () => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page, take) => {
    try {
      const query = qs.stringify({ page, take }, { encodeValuesOnly: true });
      const response = await axios.get(`/students/student_list?${query}` , {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);


  useEffect(() => {
    if (data && data.data) {
      const filteredResults = data.data.filter(student => {
        const searchFilter = filterText === '' || student.name.toLowerCase().includes(filterText.toLowerCase());
        return searchFilter;
      });
      setFilteredData(filteredResults);
    }
  }, [filterText, data, currentPage, rowsPerPage]);
  

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage + 1);
    setPage(newPage);
  };
  
  const getSerialNumber = index => {
    return index + 1 + (currentPage - 1) * rowsPerPage;
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    setPage(0);
  };

  return (
    <Layout>
      <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Students list
        </div> 
      <CardContent>
 
        <div className="overflow-hidden my-2 px-1 py-3 rounded-lg  w-full   border border-gray-200 flex flex-wrap md:flex-nowrap gap-7">
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
        </div>

        <section className="container-fluid mx-auto py-6 ">
          <TableContainer className='rounded-lg'>
            <Table>
              <TableHead >
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-blac">
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Name</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Vuid</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Cnic</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Phone</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Degree</TableCell>
                  <TableCell className='px-4   text-center border-x border-black py-2 text-white'>Email</TableCell>
                  <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((student, index) => (
                  <TableRow key={student.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                    <TableCell className="px-4 py-2  text-center text-sm">{getSerialNumber(index)}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">{student.name}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">{student.vuid}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">{student.cnic}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">{student.phone}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">{student.degree.title}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">{student.user.email}</TableCell>
                    <TableCell className="px-4 py-2  text-center text-sm border">
                      <div className='flex'>
                      <Tooltip title="Phase History">
             <a href={`/students/history/${student.id}`}><RemoveRedEyeOutlinedIcon /></a>

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
            count={data ? data.meta.itemCount : 0} // Update count
            page={page} // Use page state for page number
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
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

export default studentlist;

