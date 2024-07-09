import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';
import { useSession } from "next-auth/react"
import Parser from './parser';
function EmailTempList() {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [filterText, setFilterText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const { data: session } = useSession();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('/email_templates/pagedata', {
              headers: {
                "Authorization": `Bearer ${session?.user.data.access_token}`
              },
              params: {
                filterText,
              },
            });
            setData(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, [filterText, session]);
      

    useEffect(() => {
        if (data && data.data) {
            const filteredResults = data.data.filter((email) => {
                const searchFilter =
                    filterText === '' ||
                    email.subject.toLowerCase().includes(filterText.toLowerCase()) ||
                    email.createdby.fullname.toLowerCase().includes(filterText.toLowerCase()) ||
                    email.content.toLowerCase().includes(filterText.toLowerCase());

                return searchFilter;
            });

            setFilteredData(filteredResults);
        }
    }, [filterText, data]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setFilterText(event.target.value);
    };
    
    return (
        <Layout>
              <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
        Email Templates List
        </div> 
      <CardContent>
      <div className="overflow-hidden justify-center  px-1 space-x-3 py-3 rounded-lg border border-gray-200 flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
          <div className="mr-auto w-full flex items-center  rounded-lg gap-20   ">
                        <label htmlFor="simple-search" className="sr-only w-full max-w-lg rounded-lg border border-slate-200 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">Search</label>
                        <div className="relative w-full">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <input
                                value={filterText}
                                onChange={handleSearchChange}
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search"
                                required
                            />
                        </div>
                    </div>
                    <a href='/email/create'>
                        <button
                            className=" mr-2 flex gap-3 hover:border register font-serif text-white bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                        >
                            <svg data-slot="icon" fill="none" stroke-width="1.5" className='w-6 h-6' stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"></path>
</svg>
                            CreateEmail
                        </button>
                    </a>
                </div>

                <section className="container-fluid mx-auto py-6">
                    <TableContainer className='rounded-lg'>
                        <Table>
                            <TableHead>
                                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-black">
                                    <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Sr#</TableCell>
                                    <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Subject</TableCell>
                                    <TableCell className='px-4  text-center border-x border-black py-2 text-white'>Content</TableCell>
                                    <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Created By</TableCell>
                                    <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((email, index) => (
                                    <TableRow key={email.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                                        <TableCell className="px-4 text-center py-2 text-sm">{index + 1}</TableCell>
                                        <TableCell className="px-4 text-center py-2 text-sm border">{email.subject}</TableCell>
                                        <TableCell className="px-4 text-center py-2 text-sm border">
                                            
                                            <Parser content={email.content} />
                                            </TableCell>
                                        <TableCell className="px-4 text-center py-2 text-sm border">
                                            {/* {email.createdby.fullname} */}
                                            </TableCell>
                                        <TableCell className="px-4 border-x py-2 text-center text-white">
                                            <div className='flex align-middle'>
                                            <Tooltip title="Update">
            
                                                <a href={`/email/update/${email.id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                    </svg>
                                                </a>

            </Tooltip>
            <Tooltip title="View">
            
 <a href={`/email/view/${email.id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" color='black' className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
                        rowsPerPageOptions={[3, 5, 10, 25]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </section>
      
      </CardContent>
     
    </Card>
           
        </Layout>
    );
}

export default EmailTempList;
