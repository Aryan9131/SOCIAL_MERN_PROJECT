import React from 'react'
import {Box, TextField, Button} from '@mui/material';
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';
import { signInUser } from '../api/userApi';
import { addNotification } from '../features/socketSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignIn(){
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignIn = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        try {
            const response = await signInUser(data);
            if (response.data && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                const user = JSON.parse(atob(token.split('.')[1]));
                dispatch(addNotification({message : 'Login SuccessFul'}))
                dispatch(setUser(user));
                navigate('/');
            }
        } catch (error) {
            toast('Invalid Username/Password !')
            console.error('Error:', error);
        }
    };
    return(
        <Box sx={{position:'absolute', backgroundColor:"whitespace",height:"80vh",width:'100%', display:"flex",justifyContent:"center", alignItems:"center", alignContent:'center'}}>
             <Box >
                 <ToastContainer />
             </Box>  
            <Box sx={{backgroundColor:"white",padding:"10px",height:{xs:"50%",sm:"60%" , md:"70%"}, width:{xs:"70%",sm:"50%" , md:"40%"}, boxShadow:"1px 1px 5px grey", display:"flex", flexDirection:"column", justifyContent:'center', alignItems:'flex-start'}}>
                   <Box sx={{width:"90%",display:"flex", justifyContent:"center", marginBottom:'10px'}}>
                        <h1>SignIn</h1>
                   </Box>
                   <form action="/authenticate" method="post"  onSubmit={handleSignIn}>
                        <TextField fullWidth label="email" name="email" id="email" />
                        <TextField fullWidth label="password" name="password" id="password" type="password" sx={{margin:'5px 0px'}} />
                        <Box sx={{display:"flex", justifyContent:"flex-end" }}>
                           <Button variant="outlined" type='submit'>SignIn</Button>
                        </Box>
                   </form>

                   <Button variant="outlined" type='submit' sx={{position:'sticky',bottom:'5%'}}><NavLink to="/sign-up" style={{textDecoration:"none"}}>SignUp</NavLink></Button>
            </Box>
        </Box>
    )
}

export default SignIn