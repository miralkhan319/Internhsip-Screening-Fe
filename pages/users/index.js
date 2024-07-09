const qs = require('qs');
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layouts/Layout';
import { Select, MenuItem, Checkbox, ListItemText, Button, Switch, CardHeader,Tooltip } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CleaningServices } from '@mui/icons-material';


const UserList = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState("");
  const [roles, setRoles] = useState([]);
  const [roleIds, setRoleIds] = useState([]);
  const [status, setStatus] = useState('ALL'); 
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
useEffect(() => {
    axios.get('/users/pagedata',  {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }} ,{
      params: {
        roleIds: roleIds.join(','),
        status,
        filterText,
      },
    })
  }, [roleIds, status, filterText,session]);
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
      const response = await axios.get(`/users/pagedata?${query}`  , {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }});
      setRoles(response.data.roles);
      setData(response.data.pagedata.data);
      setMeta(response.data.pagedata.meta);
      console.log(response.data.pagedata.data)
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
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
   const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, meta.take);
  };
  const filteredData = data
  ? data.filter((item) => {
      const roleFilter =
        roleIds.length === 0 || item.roles.some((role) => roleIds.includes(role.id));
      const statusFilter =
        status === 'ALL' ||
        (status === 'active' && item.is_active) ||
        (status === 'inactive' && !item.is_active);
      const textFilter =
        item.fullname.toLowerCase().includes(filterText.toLowerCase()) ||
        item.phone.toLowerCase().includes(filterText.toLowerCase()) ||
        item.email.toLowerCase().includes(filterText.toLowerCase());
      return roleFilter && statusFilter && textFilter;
    })
  : []; 
  
  const callDeleteUser = (e, uid) => {
    const callDeleteUserLink = '/users/delete/' + uid;
    Swal.fire({
      title: 'Do you want to delete this user?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(callDeleteUserLink, {
            headers: {
              Authorization: `Bearer ${session?.user.data.access_token}`,
            },
          });
          Swal.fire({
            title: 'Success',
            text: 'User Deleted Successfully',
            icon: 'success',
          });
          fetchData(currentPage, rowsPerPage);
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User not Deleted',
          });
        }
      } else {
        console.log('Deletion cancelled by user');
      }
    });
    console.log(callDeleteUserLink);
  };
  
  
  
  const callActiveUser = (e, uid) => {
    const patchURL = '/users/activate_user/' + uid;
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
        setData([...filteredData]);
        Router.reload();
      })
      .catch((error) => {
        console.error('Error activating user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.message,
        });
      });
  };
  
 
  return (
    <Layout>
   
   <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          User List
        </div> 
      <CardContent>
        
        <div className="overflow-hidden justify-center  px-1 space-x-3 py-3 rounded-lg border border-gray-300   flex flex-wrap md:flex-nowrap gap-2 md:gap-8 ">
          <div className=" w-full md:w-1/2">
            <label htmlFor="simple-search" className="sr-only  w-full max-w-lg rounded-lg border border-gray-500  px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40">Search</label>
            <div className="relative w-full ">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
              </div>
              <input value={filterText}
                onChange={handleFilterChange} type="text" id="simple-search" className="w-full h-10 bg-white max-w-lg rounded-lg border border-gray-500  px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40 " placeholder="Search" required />
            </div>

          </div>
          <div className="flex items-center   sm:gap-3 gap-1    w-full  md:w-1/2 ">
            <label htmlFor="status" className="block text-md font-semibold leading-6 text-gray-900">Status</label>
            <Select className="w-full h-10 bg-white max-w-lg rounded-lg border border-gray-500  px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40  " value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="ALL" >All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive"> InActive</MenuItem>
            </Select>

          </div>
          <div className="flex items-center   sm:gap-3 gap-4 w-full  md:w-1/2 ">
            <label htmlFor="role" className="block text-md font-semibold leading-6 text-gray-900">Role</label>
            <Select

              id="roleIds"
              multiple
              placeholder='ROLE'
              required
              className="w-full h-10 bg-white max-w-lg rounded-lg border border-gray-500  px-12 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40   "
              value={roleIds}
              onChange={(e) => setRoleIds(e.target.value)
              }
              renderValue={(selectedRoles) => {
                const selected = [];
                for (let role of roles) {
                  for (let selectedRole of selectedRoles) {
                    if (role.id === selectedRole) {
                      selected.push(role.name);
                    }
                  }
                }
                return selected.join(", ");
              }}
            >

              {roles
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((role) => (

                  <MenuItem key={role.id} value={role.id} className=' hover:bg-[#2a549b]'>
                    <Checkbox
                      checked={
                        roleIds.indexOf(role.id) > -1
                      }
                    />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
            </Select>


          </div>
  <Link href={"/users/registration"}>
            <button type="submit"
              className="  flex items-center hover:border py-2   mr-2 rounded-lg px-4 text-center align-middle font-serif  text-white bg-[#445279] hover:border-blue-400  hover:text-black   hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300 "
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                stroke-width="2" class="w-6 h-6">
                <path
                  d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z">
                </path>
              </svg>
              AddUser
            </button>
          </Link>

        </div>
        <section className="container-fluid  mx-auto py-6 ">
          <TableContainer className='rounded-lg '>
            <Table>
              <TableHead >
                <TableRow className="text-sm  tracking-wide text-center text-white bg-bg uppercase border-b border-black">
                  <TableCell className='px-4 text-center  border-x border-black py-2 text-white'>Sr#</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>User</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Role</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Status</TableCell>
                  <TableCell className='px-4 text-center border-x border-black py-2 text-white'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
    <TableRow
      key={user.id}
      className="text-black text-center odd:bg-[#FFFFFF] even:bg-[#88B7DF]" >
   
      <TableCell className='px-2 py-1 text-sm border '>{getSerialNumber(index)}</TableCell>
                    <TableCell className='px-2 py-1 text-sm border text-center  '><ul><li>{user.fullname}</li><li className='text-sky-700 '>{user.phone}</li><li>{user.email}</li></ul></TableCell>

                    <TableCell className='px-2 py-1 text-sm border text-center  '>
                      <ul>
                        {user.roles.map((role) => (
                          <li key={role.id}>{role.name}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className='px-2 py-1 text-sm border text-center '>

                      <Switch onClick={(e) => callActiveUser(e, user.id)} checked={user.is_active}></Switch>
                    </TableCell>
                    <TableCell className='px-2 py-1 text-sm border text-center '>
                      <div className='flex'>
                      <Tooltip title="Update">
            

           
                       <a href={'/users/update/' + user.id} >
                       
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </a> </Tooltip>
                        <Tooltip title="Delete">
            

              
            <div className=" flex justify-center items-center" onClick={(e) => callDeleteUser(e,user.id)}   >

                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" color='red' viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </div></Tooltip>
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
export default UserList