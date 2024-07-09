
import Link from 'next/link';
import Swal from 'sweetalert2';
import React from 'react'
import Layout from '../../components/Layouts/Layout';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function Registration() {
    const router = useRouter();
    const { data: session } = useSession();
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [roleIds, setRoleIds] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isError, setIsError] = useState('');


    useEffect(() => {
        axios.get('/users/create' , {
            headers: {
              Authorization: `Bearer ${session?.user.data.access_token}`
            }})
            .then((res) => {
                setRoles(res.data.roles);
            })
            .catch((error) => {
                setIsError(error);
            });
    }, [session]);
    const payLoadData =  {
        phone: phone,
        fullname: fullname,
        email: email,
        roleIds: roleIds,
    };
  
    const postData = async () => {
        try {
            const response = await axios.post("/users/create",payLoadData,{
                    headers: {
                        Authorization: `Bearer ${session?.user.data.access_token}`,
                    },
                },
            );
            Swal.fire({
                title: "Success!",
                text: "User Registered Successfully! Please Check Your Email for Verification",
                icon: "success",
            });
    
            console.log(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.message || "An error occurred",
            });
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        postData();
    }
    const [data, setData] = useState({

        email: '',
        phone: '',
        fullname: '',
    });


    const { ...allData } = data;



    const canSubmit = [...Object.values(allData)].every(Boolean);

    return (
        <Layout>
              <Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
          Registration
        </div> 
      <CardContent>
          <form action="" method="post" onSubmit={handleSubmit}>
                    <div className="md:flex md:flex-row  items-center mx-20 gap-36">
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="font-semibold  text-md leading-none">Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value), setData({
                                        ...data,
                                        email: e.target.value
                                    })
                                }}
                                className=" mt-3 block w-full rounded-lg border border-gray-500  bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                                autoComplete="off"
                                pattern="[a-z0-9A-Z]+@[[vV][uU].[Ee][Dd][Uu]]+\.[[Pp][Kk]]{2,}$"
                            />
                            <span className="mt-1 hidden text-sm text-red-800">
                                Please enter a valid email address.{'userid@vu.edu.pk  '}</span>
                        </div>
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="font-semibold  text-md leading-none">Full Name</label>
                            <input
                                placeholder='Fullname'
                                type="fullname"
                                name="fullname"
                                id="fullname"
                                value={fullname}
                                onChange={(e) => {
                                    setFullName(e.target.value), setData({
                                        ...data,
                                        fullname: e.target.value
                                    })
                                }}

                                className="  mt-3  block w-full rounded-lg border border-gray-500  bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                                autoComplete="off"

                            />
                            <span className="mt-1 hidden text-sm text-red-800">
                                Please enter a fullname{' '}</span>
                        </div>

                    </div>
                    <div className="md:flex md:flex-row items-center mx-20  gap-36">
                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="font-semibold  text-md  leading-none">Phone Number</label>
                            <input
                                placeholder='Phone'
                                id="phone"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value), setData({
                                        ...data,
                                        phone: e.target.value
                                    })
                                }}
                                className="  mt-3 block w-full rounded-lg border border-gray-500  bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                                autoComplete="off"

                                pattern="[+92[0-9]]{13,}$"
                            />
                            <span className="mt-1 hidden text-sm text-red-800">
                                Please enter a phonenumber{'+923012345678'}</span>
                        </div>

                        <div className="w-full flex flex-col mt-5 md:w-1/2">
                            <label className="font-semibold  text-md leading-none mb-3">Role</label>
                            <Select
    labelId="roleLabel"
    id="roleIds"
    multiple
    required
    
    placeholder='Select your Role'
    className="h-11 leading-none border-gray-500   bg-white text-gray-900 placeholder-gray-500 p-3 focus:outline-none focus:border-blue-700 border rounded-md "
    value={roleIds}
    onChange={(e) => setRoleIds(e.target.value)}
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
    <MenuItem value="" disabled>
        Select your Role
    </MenuItem>
    {roles
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((role) => (
            <MenuItem key={role.id} value={role.id}>
                <ListItemText primary={role.name} />
            </MenuItem>
        ))}
</Select>

                        </div>

                    </div>
                    <div className=" flex justify-center items-center mt-5 md:gap-8 sm:gap-12 gap-2">
                        <Link href={"/users"}>
                            <button type='reset' className=" w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button></Link>
                        <button type='submit' disabled={!canSubmit} className=" w-28 h-10 hover:border  font-serif text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Registration</button>
                    </div>

                </form>
      
      </CardContent>
     
    </Card>
        
        </Layout>
    )
}
export default Registration



