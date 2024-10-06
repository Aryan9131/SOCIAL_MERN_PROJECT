import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import getSocket from '../utils/socketManager';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem('token'); // Make sure 'token' is the string key
  let user = useSelector((state) => state.user).user;
  const navigate = useNavigate();

  // Media query to detect screen size
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs')); // For extra-small screens
  const [socket, setSocket]=React.useState(undefined)
   // handleLogout
   const handleLogOut = ()=>{
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload()
      } catch (error) {
        console.log('error while deleting from localstorage for logOut : '+error)
      }
   }   
  // Toggle the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // Get user data and navigate
  
  React.useEffect(()=>{
    setSocket(getSocket())
  },[])
  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FaRegUser color="white" className="navIcon" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        // Set position beside the icon
        anchorOrigin={{
          vertical: 'center', // Align to the center vertically (relative to the icon)
          horizontal: 'right', // Right side of the button
        }}
        transformOrigin={{
          vertical: 'center', // Keep it from moving vertically too much
          horizontal: 'left',  // Opens towards the left (ensuring it opens from the side)
        }}
      >
        <MenuItem onClick={() =>{ navigate(`/profile/${user._id}`) ;
                                  handleClose()
                                }}>
                <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24 }} />
                </ListItemIcon>Profile
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
           <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
