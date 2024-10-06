import React from 'react'
import Box from '@mui/material/Box';
import { TiHomeOutline } from "react-icons/ti";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { MdNotificationsNone } from "react-icons/md";
import SocialMediaIcon from './Icon'
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowChattingDetails } from '../features/conversationSlice';
import ProfileMenu from './ProfileMenu';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';

function NavBar() {
    let user = useSelector((state) => state.user).user;
    const dispatch=useDispatch();
    return (
        <Box id="navbar" sx={{zIndex:100, height: { xs: "10vh", md: "100vh" }, width: { xs: "100vw", md: "500px" },flexDirection: { xs: "row", md: "column"} }}>
            <div id="logo">
                <SocialMediaIcon/>
            </div>
            <Box id="navitems" sx={{flexDirection: { xs: "row", md: "column"} }}>
               <NavLink to="/"><TiHomeOutline color="white" className='navIcon'/></NavLink> 
               <NavLink to="/events"><FaRegCalendarAlt  color="white"   className='navIcon' /></NavLink> 
               <NavLink to="/messages" onClick={()=>dispatch(toggleShowChattingDetails(false))}><FaRegEnvelope    color="white" className='navIcon'  /></NavLink> 
               <NavLink to="/stories"> <AutoStoriesIcon  sx={{fontSize:{xs:'25px', sm:'30px'}}}  className='navIcon'/></NavLink>
               <ProfileMenu/>
            </Box>
        </Box>
    )
}

export default NavBar