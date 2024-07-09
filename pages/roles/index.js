import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layouts/Layout';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, TablePagination } from '@mui/material';
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: session } = useSession();
  useEffect(() => {
    axios.get('/roles/pagedata' , {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }})
      .then((response) => {
        setRoles(response.data.data);
      });
  }, [session]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
         <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Role Management
        </div> 
      <CardContent>
      <div className=" justify-center text-xl font-serif overflow-hidden   rounded-lg  w-full flex flex-wrap md:flex-nowrap gap-4 md:gap-8">
        Role List
      </div>
          <section className="container-fluid  mx-auto py-6 ">
      <TableContainer className='rounded-lg'>
          <Table>
          <thead>
                <TableRow className="text-sm tracking-wide text-center text-white bg-bg uppercase border-b border-black">
                  <TableCell className="border-x text-center border-black py-2 text-white">SRno</TableCell>
                  <TableCell className="border-x text-center border-black py-2 text-white">Role</TableCell>
                 
                </TableRow>
              </thead>
           
            <TableBody>
            {roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role, index) => (
              <TableRow key={role.id} className={index % 2 === 0 ? "bg-[#88B7DF]" : "bg-[#FFFFFF]"}>
                <TableCell className=" border text-center">{page * rowsPerPage + index + 1}</TableCell>
                <TableCell className=" border text-center">{role.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
</section>
      <TablePagination
      showFirstButton showLastButton
        rowsPerPageOptions={[1,5, 10, 25]}
        component="div"
        count={roles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </CardContent>
     
    </Card>
    
        
  
 
    </Layout>
  );
}
