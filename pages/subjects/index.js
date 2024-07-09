const qs = require('qs');
import { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import TableContainer from '@mui/material/TableContainer';
import axios from 'axios';
import Router from 'next/router';
import { Button, Table, TableRow, TableCell, TablePagination ,Tooltip} from '@mui/material';
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const SubjectList = () => {
  const [data, setData] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
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
      const response = await axios.get(`/subjects/pagedata?${query}`, {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
  
      setFilteredData(res.data.data); 
      setMeta(res.data.meta);
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
  useEffect(() => {
    axios.get('/subjects/pagedata', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data.data); 
        setMeta(res.data.meta);
        console.log(res.data);
      })
      .catch((error) => {
     
        console.error('Error fetching data:', error);
  
      });

  }, []);

  const handleDeleteClick = (id) => {
    const deleteURL = `/subjects/delete/${id}`;
  
    Swal.fire({
      title: `Do you want to delete this subject?`,
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
          }})
          .then(() => {
            Swal.fire('Deleted!', 'Your subject has been deleted.', 'success');
          })
          .catch((error) => {
            Swal.fire('Error!', `Failed to delete subject. ${error.message}`, 'error');
          });
          Router.reload();
      }
    
    }); 

    console.log(deleteURL);
  };


  const handleFilterChange = (event) => {
    setSearchQuery(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = data.data.filter((subject) =>
      subject.code.toLowerCase().includes(lowerCaseQuery) ||
      subject.title.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  };

  return (
    <Layout>
      
     <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Subject List
        </div> 
      <CardContent>
         <div className="overflow-hidden justify-center  px-1 space-x-3 py-3 rounded-lg border border-gray-300  flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
          <div className="mr-auto w-full flex items-center  rounded-lg gap-20   ">
            <label htmlFor="quick-filter" className="sr-only w-full max-w-lg rounded-lg border border-gray-500  px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
                value={searchQuery}
                onChange={handleFilterChange}
              />
            </div> 
            <a href='/subjects/create'>
            <button
              className=" mr-2 gap-3 flex hover:border register font-serif  text-white bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
               >
                <svg data-slot="icon" className='w-6 h-6 ' fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path strokelinecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
</svg>
              Addsubject
            </button>
            </a>
          </div>
        </div>
    
         
      
        <section className="container-fluid mx-auto py-6">
          <TableContainer className='rounded-lg' >
            <Table>
              <thead>
                <TableRow className="text-sm text-center text-white bg-bg uppercase border-b border-black">
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">SRno</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">code</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">Title</TableCell>
                  <TableCell className="px-4 text-center border-x border-black py-2 text-white">Action</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subject, index) => (
                  <TableRow key={subject.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                    <TableCell className="px-4 text-center py-2 text-sm">{getSerialNumber(index)}</TableCell>
                    <TableCell className="px-4 text-center py-2 text-sm border">
                      {subject.code}
                    </TableCell>
                    <TableCell className="px-4 text-center py-2 text-sm border"> {subject.title}</TableCell>
                    <TableCell className="px-4 text-center py-2 text-sm border">
                      <div className="flex align-middle">
                      <Tooltip title="Update">
             <a href={'/subjects/update/' + subject.id}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </a>

            </Tooltip>
            <Tooltip title="Delete">
             <span onClick={() => handleDeleteClick(subject.id)}>
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
  );
}

export default SubjectList;
