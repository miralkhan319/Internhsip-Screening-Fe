const qs = require('qs');
import { useSession } from "next-auth/react"
import { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import TableContainer from '@mui/material/TableContainer';
import axios from 'axios';
import { Table, TableRow, TableCell, TablePagination, Switch } from '@mui/material';
import Swal from 'sweetalert2';
import Router from 'next/router';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const BatchList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
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
      const response = await axios.get(`/batches/pagedata?${query}` , {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setData(response.data.data);
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
  const filteredData = data 
  ? data.filter((semester) =>
      semester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (semester.start_date?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (semester.end_date?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  const handleDeleteClick = (id) => {
    const deleteURL = `/batches/delete/${id}`;

    Swal.fire({
      title: `Do you want to delete this Batch?`,
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
          .then(() => {
            Swal.fire('Deleted!', 'Your Batch has been deleted.', 'success');
            axios.get('/batches/pagedata')
              .then((res) => {
                setData(res.data.data || []); 
              })
              
              .catch((error) => {
                setIsError(error.message);
              });
              Router.reload();
          })
          .catch((error) => {
            Swal.fire('Error!', `Failed to delete Batch. ${error.message}`, 'error');
          });
      }
    });
    console.log(deleteURL);
  };

  const callActiveBatch = (id) => {
    const patchURL = `/batches/activate_deactivate/${id}`;

    axios.patch(patchURL ,null, {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
    .then((res) => {
      Swal.fire({
        title: 'Success',
        text: res.data.message,
        icon: 'success',
      });
       Router.reload();
    })
    .catch((error) => {
      console.error(error); 
      Swal.fire({
        icon: "warning",
        title:  "You can only activate up to two batches simultaneously!" ,
        text: error.response.data.message,
      });
    });
   
  console.log(patchURL);
};


  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
        <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
    Batch List     
        </div> 
      <CardContent>
       
        <div className="overflow-hidden justify-center my-2 px-1 py-3 rounded-lg border border-gray-200 w-full   shadow-blue-400 flex flex-wrap md:flex-nowrap gap-7">
          <div className="mr-auto w-full flex items-center overflow-hidden rounded-lg gap-20   ">
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
                  value={searchQuery}
                  onChange={handleSearchChange}
              type="text"
              id="quick-filter"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div> 
         
        </div>
         <a href='/batches/create'>
              <button
                className=" flex mr-2 gap-3 hover:border register font-serif  text-white bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                onClick={() => console.log('Add Batch clicked')}
              >
             <svg data-slot="icon" className="w-6 h-6"  fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path strokelinecap="round" strokelinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
</svg>

                AddBatch
              </button></a>
        </div>
        
            
        
        <section className="container-fluid  mx-auto py-6">
          <TableContainer className='rounded-lg'>
            <Table>
              <thead>
                <TableRow className="text-sm text-center text-white bg-bg uppercase border-b border-black">
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">SRno</TableCell>
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">Name</TableCell>
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">Start date</TableCell>
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">End date</TableCell>
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">Start Semster</TableCell>
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">End  Semster</TableCell>

                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">Status</TableCell>
                  <TableCell className="px-4 text-center  border-x border-black py-2 text-white">Action</TableCell>
                </TableRow>
              </thead>
              <tbody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((batch, index) => (
            <TableRow key={batch.id} className={index % 2 === 0 ? 'bg-[#88B7DF]' : 'bg-[#FFFFFF]'}>

                    <TableCell className="px-4 text-center  py-2 text-sm">{getSerialNumber(index)}</TableCell>
                    <TableCell className="px-4 text-center  py-2 text-sm border">{batch.name}</TableCell>
                    <TableCell className="px-4 text-center  py-2 text-sm border">{new Date(batch.start_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} </TableCell>
                    <TableCell className="px-4 text-center  py-2 text-sm border ">{new Date(batch.start_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} </TableCell>
                    <TableCell className="px-4  text-center  py-2 text-sm border ">{batch.startInSemester?.name || 'N/A'} </TableCell>
                    <TableCell className="px-4 text-center  py-2 text-sm border ">{batch.endInSemester?.name || 'N/A'} </TableCell>
                    <TableCell className="px-4 text-center  py-2 text-sm border">

                    <Switch onClick={() => callActiveBatch(batch.id)} checked={batch.is_current} />
                    </TableCell>
                    <TableCell className="px-4 py-2 text-sm border">
                      <div className="flex flex-row  items-center">
                      <Tooltip title="Update">
             <a href={'/batches/update/' + batch.id}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </a>

            </Tooltip>
            <Tooltip title="Assesment Marks">
              <a href={'/batches/assesmentmarks/'+ batch.id}>
                        <EditNoteIcon className='w-10 h-10' /></a>

            </Tooltip>
            <Tooltip title="Delete">
             <span onClick={() => handleDeleteClick(batch.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" color='red' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </span>

            </Tooltip>  
            <Tooltip title="View">
            
<a href={`/batches/view/` + batch.id}><RemoveRedEyeOutlinedIcon /></a>
            </Tooltip>
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>

            </Table> </TableContainer>
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

  
    </Layout>)
}
export default BatchList 
