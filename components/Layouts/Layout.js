import ExpandLess from '@mui/icons-material/ExpandLess';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EmailIcon from '@mui/icons-material/Email';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PlaylistRemoveRoundedIcon from '@mui/icons-material/PlaylistRemoveRounded';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import axios from 'axios';
import Router from 'next/router';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { MenuItem ,Tooltip} from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ModalClose from '@mui/joy/ModalClose';
import { signOut, useSession } from "next-auth/react";
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import PhoneCallbackOutlinedIcon from '@mui/icons-material/PhoneCallbackOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
const drawerWidth = 240;
const createHandleMenuClick = (menuItem) => {
  return () => {
    console.log(`Clicked on ${menuItem}`);
  };
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({ 
 
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
   
  }), 
  backgroundColor:"#D4E1F3"
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function Layout({ children }) {
  const router = Router;

const handleSubmit = async () => {
  try {
    console.log('auth/signout/');
    const response = await axios.get('auth/signout/', {
      headers: {
        "Authorization": `Bearer ${session?.user.data.access_token}`
      }
    });
    console.log(response.data.message);
    router.push('/');
    await signOut();
    sessionStorage.clear();
    Swal.fire({
      title: "SIGNIN!",
      text: "You are Sign Out Successfully!",
      icon: "success"
    });
    console.log("Sign out successful:", response.data);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    });
  }
};
  const [open1, setOpen1] = React.useState(false);

  const handleClick = () => {
    setOpen1(!open1);
  };
 const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { data: session } = useSession();
  const userRoles = session?.user?.data?.user?.roles?.map((role) => role.name.toLowerCase()) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
          <IconButton
      color="black"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      sx={{ mr: 2, ...(open && { display: 'none' }) }}
    >
      <MenuIcon />
    </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <div className="flex items-center  ">
        
              <Image
        src="/logo.png"
        width={80}
        height={80}
        alt='logo'
        sx={{ display: { xs: 'none', md: 'block' } }} 
      />
              
              <Typography
        noWrap
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
       
        }}
        className='text-black font-serif font-bold text-lg '
      >
        INTERNSHIP SCREENING
      </Typography> 
              </div>
            </Typography>
            <div className="p-4">
              <Link href="/scan">
          
              </Link>
            </div>
         
            <Box sx={{ flexGrow: 0 }}>
            <Dropdown>
            <MenuButton>
              <Avatar />
            </MenuButton>
           
            <Menu className='bg-white w-40 p-6'>
            {userRoles.includes('student') && (
             <Link href={"/studentprofile"} >  <MenuItem className='hover:bg-[#2a549b] hover:text-white' >
                Profile
            </MenuItem></Link>)}
            {userRoles.includes('admin','coordinator') && (
             <Link href={"/profile"} >  <MenuItem className='hover:bg-[#2a549b] hover:text-white' >
                Profile
            </MenuItem></Link>)}
              <MenuItem className='mt-2'>
                <button onClick={handleSubmit} className="hover:border register font-serif text-white bg-[#002D74] hover:border-blue-400 hover:text-black rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">
                  Sign Out
                </button>
              </MenuItem>
            </Menu>
          </Dropdown>
            </Box>

         
          </Toolbar>
        </AppBar>
       <Drawer
       sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor:"rgba(67, 99, 153, 1)"
        
        },
      }}
      
        variant="persistent"
        anchor="left"
        open={open}
      >
          <ModalClose onClick={handleDrawerClose} style={{ color: 'white' }} />
          {userRoles.includes('admin') && (
           <List className='mt-10'> 

  <Link href='/admindashboard'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b]  text-white hover:font-bold'>
                <ListItemIcon>
                <DashboardIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton></Link>
            <Link href='/users'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  <GroupAddOutlinedIcon  style={{ color: 'white' }}/>
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton></Link>
            <Link href='/roles'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b]  text-white hover:font-bold'>
                <ListItemIcon>
                  <ManageAccountsIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Roles" />
              </ListItemButton></Link>
            <Link href='/semesters'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  < AssignmentIndIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Semesters" />
              </ListItemButton></Link>
            <Link href='/batches'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  <BatchPredictionIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Batches" />
              </ListItemButton></Link>
            <Link href='/degrees'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  <SchoolOutlinedIcon style={{ color: 'white' }} />

                </ListItemIcon>
                <ListItemText primary="Degrees" />
              </ListItemButton></Link>
            <Link href='/subjects'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                <ListItemIcon>
                  <AutoStoriesOutlinedIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Subjects" />
              </ListItemButton></Link>
            <Link href='/email'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                <ListItemIcon>
                  <EmailIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Email Template" />
              </ListItemButton></Link>
            <ListItemButton onClick={handleClick} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
              <ListItemIcon>
                <BadgeOutlinedIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Students" />
              {open1 ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open1} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className='font-serif'>
                <Link href='/students/registerlist'>

                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <SubjectIcon style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Registration List" />
                  </ListItemButton></Link>
                <Link href='/students/shortlisted'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <FormatListNumberedRtlIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Shortlisted List" />
                  </ListItemButton></Link>

                <Link href='/students/assesmentlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <ChecklistRtlIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Assesment List" />
                  </ListItemButton></Link>
                <Link href='/students/recommendlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <SpeakerNotesIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Recommended List" />
                  </ListItemButton></Link>
                <Link href='/students/invitedlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <EditNoteIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Invited List" />
                  </ListItemButton></Link>
                <Link href='/students/joinedlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      < PersonSearchIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Joinned List" />
                  </ListItemButton></Link>
                <Link href='/students/passoutlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <PlaylistAddCheckIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Passout List" />
                  </ListItemButton></Link>
                <Link href='/students/rejectedlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <  PlaylistRemoveRoundedIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Rejected List" />
                  </ListItemButton></Link>
                  <Link href='/students/studentlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <  PlaylistRemoveRoundedIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Student List" />
                  </ListItemButton></Link>
              </List>

            </Collapse>
            <Link href='/eligibilitycriteria'>
              <ListItemButton className='hover:text-white  text-white    hover:bg-[#2a549b]  hover:font-bold'>
                <ListItemIcon>
                  <FactCheckIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Eligibilty Criteria" />
              </ListItemButton></Link>
            <Divider />
            <Link href='/profile'>
              <ListItemButton className='hover:text-white text-white     hover:bg-[#2a549b]  hover:font-bold'>
                <ListItemIcon>
                  <AssignmentIndOutlinedIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton></Link></List>
  )}
           {userRoles.includes('coordinator') && (
           <List className='mt-10'> 
  <Link href='/coordinatordashboard'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b]  text-white hover:font-bold'>
                <ListItemIcon>
                  <DashboardIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton></Link>
            <Link href='/semesters'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  < AssignmentIndIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Semesters" />
              </ListItemButton></Link>
            <Link href='/batches'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  <BatchPredictionIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Batches" />
              </ListItemButton></Link>
            <Link href='/degrees'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white  hover:font-bold'>
                <ListItemIcon>
                  <SchoolOutlinedIcon  style={{ color: 'white' }} />

                </ListItemIcon>
                <ListItemText primary="Degrees" />
              </ListItemButton></Link>
            <Link href='/subjects'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                <ListItemIcon>
                  <AutoStoriesOutlinedIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Subjects" />
              </ListItemButton></Link>
            <Link href='/email'>
              <ListItemButton className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                <ListItemIcon>
                  <EmailIcon  style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Email Template" />
              </ListItemButton></Link>
            <ListItemButton onClick={handleClick} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
              <ListItemIcon>
                <BadgeOutlinedIcon  style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Students" />
              {open1 ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open1} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className='font-serif'>
                <Link href='/students/registerlist'>

                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <SubjectIcon  style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Registration List" />
                  </ListItemButton></Link>
                <Link href='/students/shortlisted'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <FormatListNumberedRtlIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Shortlisted List" />
                  </ListItemButton></Link>

                <Link href='/students/assesmentlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <ChecklistRtlIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Assesment List" />
                  </ListItemButton></Link>
                <Link href='/students/recommendlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <SpeakerNotesIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Recommended List" />
                  </ListItemButton></Link>
                <Link href='/students/invitedlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <EditNoteIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Invited List" />
                  </ListItemButton></Link>
                <Link href='/students/joinedlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      < PersonSearchIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Joinned List" />
                  </ListItemButton></Link>
                <Link href='/students/passoutlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <PlaylistAddCheckIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Passout List" />
                  </ListItemButton></Link>
                <Link href='/students/rejectedlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <  PlaylistRemoveRoundedIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Rejected List" />
                  </ListItemButton></Link>
                  <Link href='/students/studentlist'>
                  <ListItemButton sx={{ pl: 4 }} className='hover:text-white     hover:bg-[#2a549b] text-white hover:font-bold'>
                    <ListItemIcon>
                      <  PlaylistRemoveRoundedIcon style={{ color: 'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary="Student List" />
                  </ListItemButton></Link>
              </List>

            </Collapse>
            <Link href='/eligibilitycriteria'>
              <ListItemButton className='hover:text-white  text-white    hover:bg-[#2a549b]  hover:font-bold'>
                <ListItemIcon>
                  <FactCheckIcon style={{ color: 'white' }}/>
                </ListItemIcon>
                <ListItemText primary="Eligibilty Criteria" />
              </ListItemButton></Link>
            <Divider />
            <Link href='/profile'>
              <ListItemButton className='hover:text-white    text-white  hover:bg-[#2a549b]  hover:font-bold'>
                <ListItemIcon>
                  <AssignmentIndOutlinedIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton></Link></List>
  )}
  {userRoles.includes('student') && (
    <List className='mt-10'> 
     <Link href='/studentdashboard'>
                <ListItemButton className='hover:text-white     hover:bg-[#2a549b]  text-white hover:font-bold'>
                  <ListItemIcon>
                    <DashboardIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton></Link>
           
              <Divider />
              <Link href='/studentprofile'>
                <ListItemButton className='hover:text-white  text-white   hover:bg-[#2a549b]  hover:font-bold'>
                  <ListItemIcon>
                    <AssignmentIndOutlinedIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton></Link></List>
     )}
           

        </Drawer>
        <Main open={open}  className='bg-white mb-10 h-screen'>
        <DrawerHeader/>
          {children}


        </Main>
        <footer class="fixed  bottom-0 left-0 z-20 w-full mt-20  bg-[#D4E1F3] border-t border-gray-200 shadow md:flex md:items-center md:justify-between  dark:bg-gray-800 dark:border-gray-600">
          <div  className='p-2 flex flex-row gap-3'>
       
          <img
                     src={"/vu.png"}
  
        alt="Selected"
        className="selected-image " width={50} height={50}
      /> 
  
       
       <img
                     src={"logo_govt_of_pakistan.png"}
  
        alt="Selected"
        className="selected-image " width={40} height={40}
      /> 
   
          
</div>
<div  className='text-black font-serif font-bold text-lg'>
      Virtual University Software House
       
</div>
          <div className='flex   '>
            <ul className='pr-6  leading-0 text-sm'>
           <li>
          < PhoneCallbackOutlinedIcon/>    +92-42-111-880-880
            </li>
            <li>
            <RoomOutlinedIcon/> VU Software House Lahore, Lawrence Road, Jinnah Town, Lahore
              </li>
            </ul>
          </div>
        </footer>
      </Box>



    </Box>
  );
}
