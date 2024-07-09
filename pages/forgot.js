import React from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useState,useEffect } from 'react'
import Swal from 'sweetalert2'
import Link from 'next/link';
const forgot = () => {
  // const router = Router;
  const [email, setEmail] = useState("");
 


  const payLoadData = {
    "email": email,

  }

  const postData = async () => {
    axios.post("/auth/forgot_password", payLoadData)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          title: "Sucess!",
          text: "Reset password link has been sent to your email!",
          icon: "success"
        });

      })
      .catch((error) => {
       
        console.error("email not send :",error.message);
        Swal.fire({
          icon: 'error',
          title: 'An error Occured!',
          text:"email not send",
        });
      }
      )
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('handle submit inside')

    postData();
    console.log(email);
  }
  const [data, setData] = useState({
    email: '',
  });

  const { ...allData } = data;
  const canSubmit = [...Object.values(allData)].every(Boolean);
  return (
  <>
   <main className=" bg-[url('../public/bg.png')] h-screen bg-cover items-center  justify-between py-8 bg-no-repeat  sm:max-h-screen sm:text-md " >
        <div className="flex justify-center w-full-xl max-h-fit bg-[#D4E1F3] rounded-lg m-0 sm:m-5 ">
        <div className="  w-[50vw]  sm:ml-10 ml-1 sm:p-5 text-black  p-1 ">

            <div className=" flex flex-col flex-nowrap items-center justify-center   ">
              <Image src="/logo.png"
                width={120}
                height={67}
                alt='logo' />
                </div>
            <div className="text-3xl  font-md font-serif m-5 text-center flex flex-col items-center justify-center "> Forgot Password
        <p className="mt-5 text-sm  text-black ">
            <a className="text-black decoration-2 ml-3 font-medium hover:text-indigo-500" href="/" >
              Login here
            </a>
          </p>
    </div>

   
            <form action="#" method="POST" className="mx-auto  max-w-xl mb-0" onSubmit={handleSubmit} >
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
                    className=" mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                    autoComplete="off"
                  
                    pattern="[a-z0-9A-Z$]+@[[vV][uU].[Ee][Dd][Uu]]+\.[[Pp][Kk]]{2,}\S*$"
                  />
                  <span className="mt-1 hidden text-sm text-red-900">
                    Please enter a valid email address.{'userid@vu.edu.pk  '}
                    
                  </span>

                </div>


             </div>

              <div className=" flex  sm:mx-16 mx-0 justify-center mt-5   ">
         <button disabled={!canSubmit}  type="submit" className=" w-full  hover:border register font-serif sm:text-md text-white bg-[#002D74] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 text-sm hover:bg-[#002c7424] font-semibold duration-300">  <a href='/'>    Send Link</a> </button>

              </div>      
       
     </form>

</div>
<div className="flex justify-center rounded-lg m-2 bg-gradient-to-b from-top to-bottom  sm:max-h-fit ">
            <Image src="/building.png"
          width={748}
              height={482}
              alt='front' />
          </div>
        </div>
    </main> 
  
  
  </>
  )
}

export default forgot