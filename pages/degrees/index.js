const qs = require('qs');
import { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import TableContainer from '@mui/material/TableContainer';
import axios from 'axios';
import Router from 'next/router';
import { Button, Table, TableRow, TableCell, Select, MenuItem, TablePagination } from '@mui/material';
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react"
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const DegreeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState('');
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
      const response = await axios.get(`/degrees/pagedata?${query}`  , {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setData(response.data);
      setMeta(response.data.meta);
      console.log(response.data.data)
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
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, meta.take);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
const handleDeleteClick = (e,id) => {  
    const deleteURL = `/degrees/delete/${id}` ;
    Swal.fire({
      title: `Do you want to delete this Degree?` ,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
      
        axios.delete(deleteURL , {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }})
          .then((res) => {
            Swal.fire({
                        title: "success",
                        text:"Degree Deleted Successfully",
                        icon: "success"
                      });
                      Router.reload();
          })
          .catch((error) => {
            Swal.fire('Error!', `Failed to delete Degree. ${error.message}`, 'error');
            Swal.fire({
                        icon: 'error',
                        title: 'An error Occurred!',
                        text: error.response.data.message,
                      });
          });
      }
    });
    console.log(deleteURL)
  };

  return (
    <Layout>
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Degree List
        </div> 
      <CardContent>
      <div className="overflow-hidden justify-center  px-1 space-x-3  rounded-lg border border-gray-200 flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
          <div className="mr-auto w-full py-1 flex items-center  rounded-lg gap-20   ">
            <label htmlFor="quick-filter" className="sr-only w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">
              Quick Filter
            </label>
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                id="quick-filter"
                placeholder="Search"
                required
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div> 
             <a href='/degrees/create'>
              <button
           className=" mr-2 flex gap-3 hover:border register font-serif  text-white  bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"  >
            <svg className="w-6 h-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path strokelinecap="round" strokelinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"></path>
</svg>
            AddDegree
          </button></a>
          </div>
      
      </div>

         
      
      <section className="container-fluid mx-auto py-6">
      <TableContainer className='rounded-lg'>
        <Table>
          <thead>
            <TableRow className="text-sm text-center text-white bg-bg uppercase border-b border-black">
              <TableCell className="px-4 text-center border-x border-black py-2 text-white">SRno</TableCell>
              <TableCell className="px-4 text-center border-x border-black py-2 text-white">Title</TableCell>
              <TableCell className="px-4 text-center border-x border-black py-2 text-white">Subjects</TableCell>
        
              <TableCell className="px-4 text-center border-x border-black py-2 text-white">Action</TableCell>
            </TableRow>
          </thead>
          <tbody>
          {data && data.data && data.data
             .filter((degree) =>
             degree.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             degree.subjects.some((subject) => subject.title.toLowerCase().includes(searchQuery.toLowerCase()))
           )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((degree, index) => (
              <TableRow key={degree.id}  className= {index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                <TableCell className="px-4 text-center py-2 text-sm">{getSerialNumber(index)}</TableCell>
                <TableCell className="px-4  text-center py-2 text-sm border">{degree.title}</TableCell>
                <TableCell className="px-4 text-center py-2 text-sm border"> <ul>
                      {degree.subjects.map((subject,index) => (
                        <li key={subject.id}>{++index}.{subject.title}</li>
                      ))}
                    </ul></TableCell>
                <TableCell className="px-4 py-2 text-center text-sm border">
                  <div className="flex align-middle">
                  <Tooltip title="Update">
            <a href={'/degrees/update/' + degree.id}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </a>


            </Tooltip>
            <Tooltip title="Delete">
              <span onClick={() => handleDeleteClick(degree.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" color='red' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                    </span>

            </Tooltip>
                  
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
       
        </Table> </TableContainer>
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
  rowsPerPageOptions={[1,10, 25, 50]}
  showFirstButton
  showLastButton
/>
</section> 
      
      </CardContent>
     
    </Card>

    
    

       </Layout>
       )}
       export default DegreeList 
