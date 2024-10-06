import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import { Box } from "@mui/material"
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useSelector, useDispatch } from "react-redux"
import useImgPreview from '../hooks/handleImgPreview'
import { setUser } from '../features/userSlice';
export default function FormDialog() {
    const {user}=useSelector((state)=>state.user);
    const [open, setOpen] = React.useState(false);
    const [imgFile, setImgFile] = React.useState(null);
    const { handleMediaChange, mediaUrl} = useImgPreview(user.avatar ? user.avatar : null, setImgFile )

    const imgInputRef = React.useRef(null);
    const [userName, setUserName] = React.useState( user ? user.name : undefined);
    const [userAbout, setUserAbout] = React.useState(user ? user.about : undefined);
    const [userAvatar, setUserAvatar] = React.useState(user && user.avatar.url ? user.avatar.url : undefined);
    const [userEmail, setUserEmail] = React.useState(user ? user.email : undefined);
    const [userPassword, setUserPassword] = React.useState(user ? user.password : undefined);
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key

    const dispatch=useDispatch()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit=async ()=>{
        let updatedUserProfile=undefined;
        console.log("selected avatar --> "+JSON.stringify(userAvatar));
        if(imgFile){
            const data = new FormData();
            data.append('file',imgFile);
            data.append('upload_preset','Social-App');
            data.append('cloud_name',"anayak");
            const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/anayak/image/upload', {
                method: 'POST',
                body: data
            });
            if (!cloudinaryResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const cloudinaryData = await cloudinaryResponse.json();
             updatedUserProfile={
                name:userName,
                about:userAbout,
                email:userEmail,
                password:userPassword,
                avatar:{
                    url:cloudinaryData.url,
                    id:cloudinaryData.public_id
                }
            }

        }else{
            updatedUserProfile={
                name:userName,
                about:userAbout,
                email:userEmail,
                password:userPassword,
            }
        }
        const updateUserProfileResponse=await fetch(`${import.meta.env.VITE_BASE_URL}/user/update-profile`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify(updatedUserProfile)
        })
        if (!updateUserProfileResponse.ok) {
            throw new Error('Failed to create post');
        }

        const updateUserProfileResponseData = await updateUserProfileResponse.json();
        console.log("updated User Profile Data"+ JSON.stringify(updateUserProfileResponseData));
         dispatch(setUser(updateUserProfileResponseData.user))
         localStorage.setItem('user', JSON.stringify(updateUserProfileResponseData.user))
        handleClose();
    }
    React.useEffect(()=>{
        setUserAvatar
        console.log("selected avatar --> "+JSON.stringify(userAvatar));
    }, [mediaUrl])
    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen} sx={{ boxShadow: "none", backgroundColor: "rgba(82, 214,105, 1)", padding: "13px 28px", borderRadius: "12px" }}>
                Edit Profile
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box
                            sx={{
                                position: "relative", // Make the Box relative to position elements inside
                                width: "fit-content",
                                '&:hover .camera-icon': {
                                    opacity: 1, // Show the camera icon on hover
                                },
                                '&:hover::before': {
                                    opacity: 1,  // Show the glassy overlay on hover
                                },
                                '&::before': {
                                    content: '""', // Required for pseudo-elements
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",  // Glassy effect (semi-transparent white)
                                    backdropFilter: "blur(5px)",  // Adds a blur effect
                                    opacity: 0,  // Initially hidden
                                    transition: "opacity 0.3s ease",  // Smooth transition
                                    zIndex: 1, // Ensure the glassy look is above the Avatar but below the icon
                                    borderRadius: "30px"  // Match the border radius of the Avatar
                                }
                            }}
                            onClick={() => imgInputRef.current.click()}
                        >
                            <Avatar alt="Remy Sharp" src={mediaUrl ? mediaUrl : (userAvatar ? userAvatar : "")} variant="rounded" 
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: "30px",
                                    width: "60px",
                                    height: "60px",
                                    position: "relative",
                                    zIndex: 2,  // Ensure Avatar is above the glassy background
                                }}
                            />
                            <PhotoCameraIcon
                                className="camera-icon"
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",  // Center the icon
                                    opacity: 0,  // Initially hidden
                                    transition: "opacity 0.3s ease",  // Smooth transition for appearance
                                    zIndex: 3,  // Ensure the icon is above both the Avatar and overlay
                                    cursor: "pointer",
                                    color:"whitesmoke"
                                }}
                            />
                            <input
                                type="file"
                                hidden
                                ref={imgInputRef}
                                onChange={handleMediaChange}
                            />
                        </Box>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="name"
                            type="text"
                            value={userName}
                            onChange={(e)=>setUserName(e.target.value)}
                            variant="standard"
                            sx={{margin:"5px"}}
                        />
                    </Box>
                    <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
                       <TextField
                            required
                            margin="dense"
                            id="about"
                            name="about"
                            label="about"
                            type="text"
                            variant="standard"
                            sx={{margin:"5px"}}
                            value={userAbout}
                            onChange={(e)=>setUserAbout(e.target.value)}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="email"
                            name="email"
                            label="email"
                            type="email"
                            variant="standard"
                            sx={{margin:"5px"}}
                            value={userEmail}
                            onChange={(e)=>setUserEmail(e.target.value)}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="password"
                            name="password"
                            label="password"
                            type="password"
                            variant="standard"
                            sx={{margin:"5px"}}
                            value={userPassword}
                            onChange={(e)=>setUserPassword(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button  onClick={handleSubmit}>update</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
