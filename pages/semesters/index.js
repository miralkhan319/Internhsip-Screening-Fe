const qs = require('qs');
import { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import TableContainer from '@mui/material/TableContainer';
import axios from 'axios';
import { Table, TableRow, TableCell, TablePagination, Switch } from '@mui/material';
import Swal from 'sweetalert2';
import Router from 'next/router';
import { useSession } from "next-auth/react"
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const SemesterList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meta, setMeta] = useState("");
  const [data, setData] = useState("");
  const [isError, setIsError] = useState('');
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
  console.log('session in index => ',session)
      const response = await axios.get(`/semesters/pagedata?${query}`,{
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
  
      setData(response.data.pagedata);
      setMeta(response.data.pagedata.meta);
      console.log(response.data.pagedata)
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
  const filteredData = data && data.data
  ? data.data.filter((semester) =>
      semester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (semester.start_date?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (semester.end_date?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleDeleteClick = (e, id) => {
    const deleteURL = '/semesters/delete/' + id;
  
    Swal.fire({
      title: `Do you want to delete this Semester?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(deleteURL, {
          headers: {
            "Authorization": `Bearer ${session?.user.data.access_token}`
          }
        })
        .then(() => {
          Swal.fire('Deleted!', 'Your semester has been deleted.', 'success');
          // Refresh data after deletion
          axios.get('/semesters/pagedata', {
            headers: {
              "Authorization": `Bearer ${session?.user.data.access_token}`
            }
          })
          .then((res) => {
            setData(res.data.pagedata);
          })
          .catch((error) => {
            setIsError(error.message);
          });
          Router.reload();
        })
        .catch((error) => {
          Swal.fire('Error!', `Failed to delete semester. ${error.message}`, 'error');
        });
      }
    });
    console.log(deleteURL);
  };
  
  const callActiveSemester = (e, id) => {
    const patchURL = '/semesters/activate_deactivate/' + id;
    
    axios.patch(patchURL, null, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }
    })
    .then((res) => {
      Swal.fire({
        title: "Success",
        text: res.data.message,
        icon: "success"
      });
      Router.reload();
    })
    .catch((err) => {
      console.log(err);
    });
  };
  

  return (
    <Layout>
      
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
      Semester List
        </div> 
      <CardContent>
            <div className="justify-center  px-1 space-x-3 py-3 rounded-lg border border-gray-200 flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
          <div className="mr-auto w-full flex items-center overflow-hidden rounded-lg  gap-20   ">
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
          </div>  
           <a href='/semesters/create'>
            <button
              className="mr-2 flex gap-3 hover:border register font-serif  text-white  bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
            >
<svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor"  class="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path strokelinecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
</svg>
              AddSemester
            </button>
          </a>
        </div>
    
       
  
        <section className="container-fluid mx-auto py-6">
          <TableContainer className='rounded-lg'>
            <Table>
              <thead>
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-black">
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">SRno</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">Name</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">Start date</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">End date</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">Status</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">Action</TableCell>
                </TableRow>
              </thead>
              <tbody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((semester, index) => (
                    <TableRow key={semester.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                      <TableCell className="px-4 text-center py-2 text-sm">{getSerialNumber(index)}</TableCell>
                      <TableCell className="px-4 text-center py-2 text-sm border">{semester.name}</TableCell>
                      <TableCell className="px-4 text-center py-2 text-sm border">  {new Date(semester.start_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                      <TableCell className="px-4 text-center py-2 text-sm border ">  {new Date(semester.end_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                      <TableCell className="px-4 text-center py-2 text-sm border">
                        <Switch onClick={(e) => callActiveSemester(e, semester.id)} checked={semester.is_active}></Switch>
                      </TableCell>
                      <TableCell className="px-4 text-center py-2 text-sm border">
                        <div className="flex align-middle">
                        <Tooltip title="Update">
            
  <a href={'/semesters/update/' + semester.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6 ">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </a>
            </Tooltip>
            <Tooltip title="Delete">
              <span onClick={(e) => handleDeleteClick(e,semester.id)}>
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
            </Table>
          </TableContainer>
          <TablePagination
  component="div"
  count={meta.itemCount || 0}
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
  );
}

export default SemesterList;
