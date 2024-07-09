
import Link from 'next/link';
import Swal from 'sweetalert2';
import React from 'react'
import Layout from '../components/Layouts/Layout';
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function Profile() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState([]);
    const [isError, setIsError] = useState('');
    const [logo, setLogo] = useState(null);
    const [data, setData] = useState("");
    const { data: session } = useSession();
    useEffect(() => {
        axios.get('/users/getUpdateProfile', {
            headers: {
              "Authorization": `Bearer ${session?.user.data.access_token}`
            }
          }
        )
            .then((res) => {
                setRole(res.data.roles);
                setPhone(res.data.phone);
                setEmail(res.data.email);
                setUsername(res.data.username);
                setFullName(res.data.fullname);
                setStatus(res.data.is_active);
                setData(res.data);

                console.log((res.data.profile_pic))
            })
            .catch((error) => {
                setIsError(error);
            });
    }, [session]);
    const formData = new FormData();

    formData.append('profile_pic', logo);
    formData.append('fullname',fullname);
    formData.append('phone', phone);
    const postData = async () => {
        try {
            const response = await axios.patch("/users/userprofile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${session?.user.data.access_token}`
                }
            });

            Swal.fire({
                title: "Success!",
                text: "User Profile Updated Successfully!",
                icon: "success"
            });
    
            console.log(response.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            });
        }
    }
    

    const handleSubmit = (e) => {
        e.preventDefault();
        postData();
        console.log(phone)
        console.log(fullname)
        console.log(logo)
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setLogo(selectedFile);
    
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const selectedImageElement = document.querySelector(".selected-image");
            if (selectedImageElement) {
              selectedImageElement.src = e.target.result;
            }
          };
          reader.readAsDataURL(selectedFile);
        }
      };
    return (
        <Layout>
           <Card >
    
    <form onSubmit={handleSubmit}>
    <div
       class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
       <div class="rounded-t-lg h-32 overflow-hidden bg-bg">  
       </div>
       <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
       <input
                               type="file"
                               onChange={handleFileChange}
                               className="hidden"
                               ref={(input) => input && input.setAttribute("accept", "image/*")}
                           />
                           <img
                               className="selected-image "
                               src={`${process.env.NEXT_PUBLIC_BE_URL}${data.profile_pic}`}
                               alt="Selected Profile"
                               style={{ maxWidth: "200px", maxHeight: "200px" }}
                           />
                          
   
                       </div> 
                       <div className='flex justify-center'>   
                       <button type='button'
                               className="w-28 h-10 m-3 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300"
                               onClick={
                                   () => document.querySelector('input[type="file"]').click()
                               }
                           >
                               Change Profile
                           </button></div>
                           <div class="bg-white overflow-hidden shadow rounded-lg border">
       <div class="px-4 py-1 sm:px-4">
           <h3 class="text-lg leading-6 font-medium text-gray-900">
               User Profile
           </h3>
           <p class="mt-1 max-w-2xl text-sm text-gray-500">
               This is some information about the user.
           </p>
       </div>
       <div class="border-t border-gray-200 px-4 py-1 sm:p-0">
           <dl class="sm:divide-y sm:divide-gray-200">
               <div class="py-1 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                   <dt class="text-sm font-medium text-gray-500">
                       Full name
                   </dt>
                  < input
                             type="name"
                                   name="name"
                                   value={fullname}
                                   onChange={(e) => {
                                       setFullName(e.target.value), setData({
                                           ...data,
                                           email: e.target.value
                                       })
                                   }} class="mt-1 p-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"/>
                 
               </div>
             
               <div class="py-1 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                   <dt class="text-sm font-medium text-gray-500">
                       Email address
                   </dt>
                   <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                   {email}
                   </dd>
               </div>
              
               <div class="py-1 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                   <dt class="text-sm font-medium text-gray-500">
                       Phone number
                   </dt>
                   <input value= {phone} onChange={(e) => {
                                       setPhone(e.target.value), setData({
                                           ...data,
                                           fullname: e.target.value
                                       })
                                   }} class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"/>
               </div>
   
               <div class="py-1 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                   <dt class="text-sm font-medium text-gray-500">
                       Role
                   </dt>
                   <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul>  {role.map((rle) =><li>{rle.name}</li> )}</ul> 
                   </dd>
               </div>
           
             
   
           </dl>
       </div>
   </div>
   
   </div>
                     
                        
       
                             <div className=" flex justify-center items-center m-5 md:gap-8 sm:gap-12 gap-2">
                           <Link href={"/admindashboard"}>
                               <button type='reset' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">
                                   Cancel
                               </button>
                           </Link>
   
                           <button type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Save</button>
                       </div>   
                       
                      
   
                   </form>
   
        
       </Card>
        </Layout>
    )
}
export default Profile



