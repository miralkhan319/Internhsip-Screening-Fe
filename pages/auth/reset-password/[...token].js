import React from 'react'
import Image from 'next/image'
import axios from 'axios'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect } from 'react'
const reset = () => {
    const router = useRouter();
    const { token } = router.query;
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[A-Za-z\d~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{8,}$/;
    const isValidPassword = (password) => {
      return strongPasswordPattern.test(password);
    };
    const [passwordValidity, setPasswordValidity] = useState('');
    const [passwordValidity1, setPasswordValidity1] = useState('');
    const postData = async () => {
  const patchURL = `/auth/reset_password/${token}`;
      if (password === confirmPassword) {
        axios.patch(`/auth/reset_password/${token}`,
          {
  
            "password": password,
            "confirmPassword": confirmPassword
          })
          .then((res) => {
            Swal.fire({
              title: "Sucess!",
              text: " Password has been reset successfully",
              icon: "success"
            });
            console.log(res.data);
  router.push('/');
  
          })
          .catch((err) => {
            console.log(err)
            Swal.fire({
              icon: 'error',
              title: 'An error Occured!',
              text:"Something Went Wrong",
            });
          })
      } else {
        console.log('password does not match')
        Swal.fire({
          icon: 'error',
          title: 'An error Occured!',
          text:"password does not match",
        });

      }

    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      postData();
      console.log(password);
      console.log(confirmPassword);
    }
    const [data, setData] = useState({
      password: '',
      confirmPassword: ''
    });
  

    const { ...allData } = data;
  
    const validatePasswordStrength = (password) => {
      const isValid = strongPasswordPattern.test(password);
    
      setPasswordValidity(isValid ? 'valid' : 'invalid');
    };
    const validatePasswordStrength1 = (password) => {
      const isValid = strongPasswordPattern.test(password);
    
      setPasswordValidity1(isValid ? 'valid' : 'invalid');
    };
    const canSubmit = [...Object.values(allData)].every(Boolean);
  
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
  
      };
      const togglePasswordVisibility1 = () => {
    
        setShowConfirmPassword(!showconfirmPassword);
      };
    return (
        
            <main className=" bg-[url('../public/bg.png')] h-screen bg-cover items-center  justify-between py-8 bg-no-repeat  sm:max-h-screen sm:text-md " >
        <div className="flex justify-center w-full-xl max-h-fit bg-[#D4E1F3] rounded-lg m-0 sm:m-5 ">
        <div className="  w-[50vw]  sm:ml-10 ml-1 sm:p-5 text-black  p-1 ">
            <div className=" flex flex-col flex-nowrap items-center justify-center   ">
              <Image src="/logo.png"
                width={120}
                height={67}
                alt='logo' />
                </div>
            <div className="text-3xl  font-md font-serif m-5 text-center flex flex-col items-center justify-center ">Reset Password </div>

                            <form action="#" method="POST" className="mx-auto  max-w-xl mb-0" onSubmit={handleSubmit} >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:mx-16 mx-0">
                <div className="sm:col-span-2">
                  <label html-for="email" className=" block  font-semibold leading-6 text-black text-md">Password</label>
                                        <div className="mt-2 relative">
            <input
          value={password}
          onChange={(e) => {
              setPassword(e.target.value), setData({
                  ...data,
                  password: e.target.value
              })
              validatePasswordStrength(e.target.value)
          }}
          
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className={`whitespace-nowrap block w-full rounded-lg border ${passwordValidity === 'valid' ? 'border-green-500' : (passwordValidity === 'invalid' ? 'border-red-400' : 'border-gray-300')} bg-gray-50 p-2.5 text-sm ${passwordValidity === 'valid' ? 'text-black' : 'text-gray-900'} placeholder-gray-300 focus:border-purple-500 focus:ring-purple-500 ${passwordValidity === 'valid' ? 'dark:border-green-500' : 'dark:border-gray-600 dark:text-white'} dark:bg-gray-700 dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500`}
              autoComplete="off"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute  transform -translate-y-8 right-4 text-gray-500 hover:text-gray-700 cursor-pointer items-center"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
            <span className={`mt-1 text-sm ${passwordValidity === 'invalid' ? 'text-white' : 'hidden'}`}>
        Password must be at least 8 characters, contain uppercase, lowercase, digits, and special characters.
      </span>
          </div>
                                     

                                    </div>
                                    <div className="sm:col-span-2">
                                        <label html-for="email" className=" block  font-semibold leading-6 text-black text-md">Confirm Password</label>
                                        <div className="mt-2.5 relative">
            <input
         value={confirmPassword}
                                            
         onChange={(e) => {
             setConfirmPassword(e.target.value), setData({
                 ...data,
                 confirmPassword: e.target.value
             })
             validatePasswordStrength1(e.target.value)
         }}
          
              type={showconfirmPassword  ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className={`block whitespace-nowrap w-full rounded-lg border ${passwordValidity1 === 'valid' ? 'border-green-500' : (passwordValidity1 === 'invalid' ? 'border-red-400' : 'border-gray-300')} bg-gray-50 p-2.5 text-sm ${passwordValidity1 === 'valid' ? 'text-black' : 'text-gray-900'} placeholder-gray-300 focus:border-purple-500 focus:ring-purple-500 ${passwordValidity1 === 'valid' ? 'dark:border-green-500' : 'dark:border-gray-600 dark:text-white'} dark:bg-gray-700 dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500`}
              autoComplete="off"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility1}
              className="absolute  transform -translate-y-8 right-4 text-gray-500 hover:text-gray-700 cursor-pointer items-center"
            >
              {showconfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
            <span className={`mt-1 text-sm ${passwordValidity1 === 'invalid' ? 'text-white' : 'hidden'}`}>
        Password must be at least 8 characters, contain uppercase, lowercase, digits, and special characters.
      </span>
          </div>
                                      

                                    </div>

                                </div>

                                <div className=" flex sm:mx-16 mx-0  justify-center mt-5 gap-10 sm:gap-3 ">
                                    <button type='reset' className="hover:border register font-serif sm:w-36 text-white bg-[#002D74] hover:border-blue-400 sm:text-md  hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300 w-24 text-sm">Cancel</button>
                                    <button disabled={!canSubmit}  type='submit' className=" sm:w-36 w-24 hover:border register font-serif sm:text-md text-white bg-[#002D74] hover:border-blue-400  hover:text-black rounded-xl py-2 px-5 hover:scale-110 text-sm hover:bg-[#002c7424] font-semibold duration-300">Save</button>
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


          



      
    )
}

export default reset