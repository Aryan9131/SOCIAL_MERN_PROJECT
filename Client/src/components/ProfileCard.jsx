import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import EditProfileDialog from './EditProfileDialog'


export default function ProfileCard({clickedUser, userFriendsLength, userPostsLength}) {
  const [expanded, setExpanded] = React.useState(false);
  const {user}=useSelector((state)=>state.user);
  const user_id=user._id;
  const [open, setOpen] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  function handleClick(e){
    e.target.style.color="red"
  }
  const handleClickOpen = () => {
    console.log('handle click open called !')
    setOpen(true);
};

  React.useEffect(()=>{
    console.log('open value changed to -->'+open)
  },[open])
  const ariaLabel = { 'aria-label': 'description' };
  const loggedIn=false;
  return (
    <Card sx={{ maxWidth: 376, width:376,minWidth:260, marginBottom:"15px", boxShadow:'0', border:"0px", borderRadius:"15px",padding:"10px 20px", boxSizing:"border-box"}} >
      <CardContent sx={{width:"100%", lineHeight:"40px"}}>
        <Box sx={{display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center",width:"100%"}}>
           <Avatar alt={user._id.toString()==clickedUser._id.toString() ? user.name : clickedUser.name} 
                   src={user._id.toString()==clickedUser._id.toString() ? user.avatar?.url : clickedUser.avatar?.url} variant="rounded" sx={{borderRadius:"30px", width:"100px", height:"100px", margin:"10px 6px"}}/>
            <h1 style={{fontWeight:"600"}}>{user._id.toString()==clickedUser._id.toString() ? user.name : clickedUser.name}</h1>
            <Typography variant="body2" color="text.secondary" sx={{margin:"4px 5px", textAlign:"center"}}>
                <b >About :</b> {user._id.toString()==clickedUser._id.toString() ? user.about : clickedUser.about}
            </Typography>
        </Box>
        <Typography variant="body2" color="text.primary" sx={{display:"flex", justifyContent:"space-evenly", marginTop:"20px", fontSize:"16px"}}>
                <span> {userPostsLength} Posts</span>
                <span>{userFriendsLength} Friends</span>
        </Typography>
        <Box sx={{display:"flex", justifyContent:"space-evenly", margin:"30px 2px"}}>
           {
              clickedUser && clickedUser._id.toString() === user_id.toString()
              ?
              <>
                <Button variant="contained" onClick={handleClickOpen} sx={{ boxShadow: "none", backgroundColor: "rgba(82, 214,105, 1)", padding: "13px 28px", borderRadius: "12px" }}>
                  Edit Profile
                </Button>
                {open && <EditProfileDialog open={open} setOpen={setOpen} />}
              </>
              :
              <Button variant="contained"  sx={{boxShadow:"none", backgroundColor:"rgba(82, 214,105, 1)", padding:"13px 28px", borderRadius:"12px"}}>
                 Add Friend 
              </Button>
           }
        </Box>
      </CardContent>
      
    </Card>
  );
}
