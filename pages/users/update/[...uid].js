import axios from 'axios';
import { useState, useEffect } from 'react';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Layout from '../../../components/Layouts/Layout';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { MenuItems } from '@headlessui/vue';
const UpdateUser = () => {
    const router = useRouter();
    const { uid } = router.query;
    const { data: session } = useSession();
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullName] = useState('');
    const [roleIds, setRoleIds] = useState([]);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (uid && session?.user?.data?.access_token) {
            axios.get(`/users/update/${uid}`, {
                headers: {
                    Authorization: `Bearer ${session.user.data.access_token}`,
                },
            })
            .then((res) => {
                setUsers(res.data.users);
                setRoles(res.data.roles);
                setFullName(res.data.users.fullname);
                setEmail(res.data.users.email);
                setUserName(res.data.users.username);
            })
            .catch((error) => {
                setIsError(true);
            });
        }
    }, [uid, session]);

    const payLoadData = {
        fullname: fullname,
        phone: phone,
        roleIds: roleIds,
    };

    const postData = async () => {
        if (uid && session?.user?.data?.access_token) {
            try {
                const response = await axios.patch(`/users/update/${uid}`, payLoadData, {
                    headers: {
                        Authorization: `Bearer ${session.user.data.access_token}`,
                    },
                });
                console.log(response.data);
                Swal.fire({
                    title: 'Success!',
                    text: 'Record updated successfully',
                    icon: 'success',
                });
            } catch (error) {
                console.log(error);
            }
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
     postData();
    };

    const [data, setData] = useState({
        fullname: "",
        phone: "",
        roleIds: "",
    });
    const { ...allData } = data;

    const canSubmit = [...Object.values(allData)].every(Boolean);
return (
        <Layout>

<Card >
        <div className='bg-bg p-2 text-center text-white text-2xl font-serif font-bold'>
       Update User
        </div> 
      <CardContent>
           <form action="" method="post" onSubmit={handleSubmit}>
                    <div className="md:flex flex-row   items-center mt-5 gap-36 mx-20">
                        <div className="w-full md:w-1/2 mr-auto flex flex-col mt-5">
                            <label className="font-semibold text-md leading-none">Email</label>
                            <input disabled type="email" name="email" value={email} onChange={(e) => {
                                setEmail(e.target.value), setData({
                                    ...data,
                                    email: e.target.value
                                })
                            }} readOnly className="leading-none text-black p-3 focus:outline-none focus:border-blue-700 mt-2 border rounded-md border-gray-500  " />
                        </div>
                        <div  className="w-full md:w-1/2 flex flex-col mt-5">
                            <label className="font-semibold text-md leading-none">User Name</label>
                            <input disabled readOnly type="text" className="leading-none text-black p-3 focus:outline-none focus:border-blue-700 mt-2 border rounded-md border-gray-500  " value={userName} />
                        </div>
                    </div>
                    <div className="md:flex flex-col md:flex-row  gap-36 mx-20">
                        <div className="w-full md:w-1/2 flex flex-col mt-5">
                            <label  className="font-semibold text-md leading-none">Name</label>
                            <input type="fullname" name="fullname" id="fullname" value={fullname} onChange={(e) => {
                                setFullName(e.target.value), setData({
                                    ...data,
                                    fullname: e.target.value
                                })
                            }} className="leading-none text-gray-900 p-3 focus:outline-none focus:border-blue-700 mt-2 border rounded-md border-gray-500  " />
                        </div>
                       <div className="w-full md:w-1/2 flex flex-col mt-5">
                            <label className="font-semibold text-md leading-none">Phone Number</label>
                            <input id="phone" value={phone} onChange={(e) => {
                                setPhone(e.target.value), setData({
                                    ...data,
                                    phone: e.target.value
                                })
                            }} type="text" className="leading-none text-gray-900 placeholder-gray-500 p-3 focus:outline-none focus:border-blue-700 mt-2 border rounded-md border-gray-500  " placeholder='Enter your Phone Number' />
                        </div> 
                    </div>
                    <div className="md:flex flex-col md:flex-row  gap-36 mx-20 ">

                        <div className="w-full md:w-1/2 flex flex-col mt-5">


                            <label className="font-semibold text-md leading-none mb-3">User Role</label>
                            <Select
                                id="roleIds"
                                multiple
                                required
                                className="h-11 leading-none bg-white text-gray-900  placeholder-gray-500 focus:outline-none focus:border-blue-700 border rounded-md border-gray-500  "
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
                               <MenuItems>
                
                <ListItemText >Select Your Role</ListItemText>
            </MenuItems> 
                               {roles
        
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((role) => (
            <MenuItem key={role.id} value={role.id}>
                
                <ListItemText primary={role.name} />
            </MenuItem>
            
        ))}
                            </Select>
                        </div> 
                         <div className="flex  md:w-1/2 w-full justify-center items-center mt-10 gap-8">
                        <Link href={"/users"}>
                            <button className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Cancel</button>
                        </Link>
                        <button  type='submit' className="w-28 h-10 hover:border  font-serif  text-white bg-[#445279]  hover:border-blue-400  hover:text-black rounded-xl  hover:scale-110 hover:bg-[#002c7424]  duration-300">Update</button>
                    </div>
                         </div>
                  
                </form>
      
      </CardContent>
     
    </Card>
           
             
          

        </Layout>


    )
}
export default UpdateUser




