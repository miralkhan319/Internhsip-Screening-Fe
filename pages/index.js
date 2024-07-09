import React, { useState } from "react";
import axios from "axios";
import Image from 'next/image';

import { signIn} from 'next-auth/react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import {  toast } from 'react-toastify';
import { useSession } from "next-auth/react" 
import 'react-toastify/dist/ReactToastify.css';
  const Home = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[A-Za-z\d~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{8,}$/;
  
    const [passwordValidity, setPasswordValidity] = useState('');
   const { data: session } = useSession();
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await signIn('credentials', {
          redirect: false, 
          "email":email,
          "password":password,
        });
        if(res.ok){  
      toast.info("You are SignIn Successfully!", { 
        hideProgressBar: false,
     autoClose: 2000, 
    type: 'success',
    position: 'top-right'});
   
    const roles = session?.user?.data?.user?.roles?.map((role) => role.name.toLowerCase()) || [];
      
    {roles.includes('admin') && (
      router.push("/admindashboard"))}
    {roles.includes('student') && (
      router.push("/studentdashboard"))};
      {roles.includes('coordinator') && (
        router.push("/coordinatordashboard"))};
   
    
  } else {
    throw new Error(res.error);
  }
 if (res.error) {
          throw new Error(res.error);
        }    
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    };
  
   
  const validatePasswordStrength = (password) => {
  const isValid = strongPasswordPattern.test(password);

  setPasswordValidity(isValid ? 'valid' : 'invalid');
};
    const [data, setData] = useState({
      email: '',
      password:''
    });
  
  
  
    const { ...allData } = data;
  
 
    const canSubmit = [...Object.values(allData)].every(Boolean);
    const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
  <main className=" bg-[url('../public/bg.png')]  h-screen bg-cover items-center  justify-between py-8 bg-no-repeat  sm:max-h-screen sm:text-md " >
        <div className="flex justify-center w-full-xl max-h-fit bg-[#D4E1F3] rounded-lg m-0 sm:m-5 ">
          <div className="  w-[50vw]  sm:ml-10 ml-1 sm:p-5 text-black  p-1 ">
            <div className=" flex flex-col flex-nowrap items-center justify-center   ">
              <Image src="/logo.png"
                width={120}
                height={67}
                alt='logo' />
                </div>
            <div className="text-3xl  font-md font-serif m-5 text-center flex flex-col items-center justify-center "> SignIn </div>
            <form action="#" method="POST" className="  max-w-xl mb-0" onSubmit={handleSubmit} >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:mx-16 mx-0">
                <div className="sm:col-span-2">
                  <label html-for="email" className=" block  font-semibold leading-6 text-black text-md">Email</label>

                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value), setData({
                        ...data,
                        email: e.target.value
                      })
                    }}
                    className="mt-2  whitespace-nowrap block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-md text-black placeholder-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                    autoComplete="off"
                  
                    pattern="^[a-z0-9A-Z]+@[[vV][uU].[Ee][Dd][Uu]]+\.[[Pp][Kk]]{2,}\S*$"
                  />
                  <span className="mt-1 hidden text-md text-red-800">
                    Please enter a valid email address.{'userid@vu.edu.pk  '}
                    
                  </span>

                </div>

                <div className="sm:col-span-2">
 <div className="sm:col-span-2">
          <label className="block  text-md font-semibold leading-6 text-black">
            Password
          </label>
          <div className=" relative">
      <input
        value={password}
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder="Password"
        className={`whitespace-nowrap mt-2 block w-full rounded-lg border ${passwordValidity === 'valid' ? 'border-green-500' : (passwordValidity === 'invalid' ? 'border-red-400' : 'border-gray-300')} bg-gray-50 p-2.5 text-md ${passwordValidity === 'valid' ? 'text-black' : 'text-black'} placeholder-gray-300 focus:border-purple-500 focus:ring-purple-500 ${passwordValidity === 'valid' ? 'dark:border-green-500' : 'dark:border-gray-600 dark:text-white'} dark:bg-gray-700 dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500`}
        onChange={(e) => {
          setPassword(e.target.value), setData({
            ...data,
            password: e.target.value
          }),
          validatePasswordStrength(e.target.value)
        }}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute  transform -translate-y-8 right-4 text-gray-500 hover:text-gray-700 cursor-pointer items-center"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </button>
      <span className={`mt-1 text-md ${passwordValidity === 'invalid' ? 'text-red-800' : 'hidden'}`}>
        Password must be at least 8 characters, contain uppercase, lowercase, digits, and special characters.
      </span>
    </div>
</div>
                </div>
              </div> 
              <div className="text-sm mt-5 sm:ml-40 md:ml-80 ms-0">
                <a href="forgot" className=" text-gray-800 hover:text-black hover:font-bold ">FORGOT PASSWORD?</a>
              </div>

             

              <div className=" flex sm:mx-16 mx-0  justify-center mt-5">
                <button disabled={!canSubmit}  type="submit" className="hover:border  font-serif min-w-full text-white bg-[#445279] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">SignIn</button>
     </div>      
       
     </form>
            <div className="text-sm font-serif  text-center mt-2">
              Don’t have an Account ?
              <a className="font-bold text-black" href="../students/studentsignup">
                Register
              </a>
            </div>
          </div>
          <div className="flex justify-center rounded-lg m-2 bg-gradient-to-b from-top to-bottom  sm:max-h-fit ">
            <Image src="/building.png"
              width={748}
              height={482}
              alt='front' />
          </div>
        </div>



      </main></>
  )
}
export default Home