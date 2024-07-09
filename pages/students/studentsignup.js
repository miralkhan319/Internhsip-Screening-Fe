import { useState, useEffect } from "react";
import axios from "axios";
import Image from 'next/image'
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react"

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [cnic, setCnic] = useState("");
  const { data: session } = useSession();
  const [degrees, setDegrees] = useState([]);
  const [isError, setIsError] = useState('');


  useEffect(() => {
    axios.get('/students/create')
      .then((res) => {
        setDegrees(res.data.degrees);



      })
      .catch((error) => {
        setIsError(error);
      });
  }, []);
  const payLoadData = {
    "degreeId": degreeId,
    "name": name,
    "cnic": cnic,
    "phone": phone,
    "email": email,

  }
  const postData = async () => {
    axios.post("/students/create"
      , payLoadData,
      {
        headers: {
          "Authorization": `Bearer ${session?.user.data.access_token}`
        }
      }

    )
      .then((res) => {
        console.log(res.data)
        Swal.fire({
          title: "Sucess!",
          text: res.data.message,
          icon: "success"
        });
      })
      .catch((err) => {
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'An error Occured!',
          text: err.response.data.message,
        });
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
    console.log(phone);
    console.log(email);
    console.log(name);
    console.log(degreeId);
  }


  return (
    <main className=" bg-[url('../public/bg.png')] h-screen bg-cover items-center  justify-between py-8 bg-no-repeat  sm:max-h-screen sm:text-sm " >
      <div className=" justify-center flex w-full-xl max-h-fit bg-[#D4E1F3] rounded-lg m-0 sm:m-5 ">
      <div className="  w-[50vw]  sm:ml-10 ml-1 sm:p-5 text-black  p-1 ">
          <div className=" flex flex-col flex-nowrap items-center justify-center   ">
            <Image src="/logo.png"
              width={120}
              height={67}
              alt='logo' />
          </div>
          <div className="text-3xl  font-md font-serif mt-5 text-center flex flex-col items-center justify-center ">  Student SignUp </div>
          <form action="#" method="POST" className="mx-auto  max-w-xl mb-0" onSubmit={handleSubmit} >
            <div className=" sm:mx-16 mx-0">
              <div className="sm:col-span-2">
                <label html-for="email" className=" block  font-semibold leading-6 text-black text-sm">Email</label>
                <div className="">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" 
                  autoComplete="email" placeholder="Email" className=" whitespace-nowrap block w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-1 h-7 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"

                    pattern="^[a-z0-9A-Z]+@[[vV][uU].[Ee][Dd][Uu]]+\.[[Pp][Kk]]{2,}\S*$"
                  />
                  <span className="mt-1 hidden text-md text-red-800">
                    Please enter a valid email address.{'userid@vu.edu.pk  '}

                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label html-for="email" className="block  font-semibold leading-6 text-black text-sm">Name</label>
                <div className="">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="email" id="email" autoComplete="email" className=" block w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-1 h-7 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500" placeholder='Name' />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label html-for="email" className="block  font-semibold leading-6 text-black text-sm">Phone Number</label>
                <div className="">
                  <input type="phonenumber" value={phone} onChange={(e) => setPhone(e.target.value)} name="email" id="email" 
                  autoComplete="email" placeholder='Phone Number'    
                    className="   block w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-1 h-7 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                               
                                pattern="[+92[0-9]]{13,}$"
                            />
                            <span className="mt-1 hidden text-sm text-red-800">
                                Please enter a phonenumber{'+923012345678'}</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label html-for="email" className="block  font-semibold leading-6 text-black text-sm">CNIC</label>
                <div className="">
                  <input type="cnic" value={cnic} onChange={(e) => setCnic(e.target.value)} name="email" id="email" autoComplete="email" placeholder='35302-9389780-1'     className="   block w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-1 h-7 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500"
                               

                               pattern="\d{5}-\d{7}-\d"
                            />
                            <span className="mt-1 hidden text-sm text-red-800">
                                Please enter a Correct pattern{'35302-9389780-1'}</span>
                </div>

              </div>
              <div className="sm:col-span-2">
                <label html-for="email" className="block  font-semibold leading-6 text-black text-sm">Degree</label>
                <select value={degreeId} onChange={(e) => { setDegreeId(e.target.value) }} label=' Degree' type="text" className=" block w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5  h-7 text-md text-black placeholder-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500" placeholder=''  >
                  <option value="null">Degree</option>
                  {degrees.map((degree) => {
                    return <option value={degree.id}>{degree.title}</option>;
                  })}

                </select>


              </div>
            </div>

            <div className=" flex sm:mx-16 mx-0 items-center justify-center mt-5 sm:gap-10 gap-3">
              <button type="reset" className="  hover:border register font-serif  text-white bg-[#002D74] hover:border-blue-400  hover:text-black rounded-xl py-2 sm:px-9 px-3 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"><a href="/">Cancel</a></button>
              <button type="submit" className="  hover:border register font-serif text-white bg-[#002D74] hover:border-blue-400  hover:text-black rounded-xl py-2 sm:px-9  px-3 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">Save</button>
            </div>
            <div className="text-sm font-serif text-center mt-2">
              Already have an Account ?
              <a className="font-bold text-black" href="/">
                Login Instead
              </a>
            </div> </form>
        </div>

        <div className="flex justify-center rounded-lg m-2 bg-gradient-to-b from-top to-bottom  sm:max-h-fit ">
          <Image src="/building.png"
            width={748}
            height={482}
            alt='front' />
        </div>
      </div>
    </main>
  );
}
export default Signup


