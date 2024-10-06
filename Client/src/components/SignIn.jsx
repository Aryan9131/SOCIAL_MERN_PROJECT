import React from 'react'
import Box from '@mui/material/Box';
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
        <Box sx={{backgroundColor:"whitespace",height:"80vh", display:"flex",justifyContent:"center", alignItems:"center"}}>
             <Box >
                 <ToastContainer />
             </Box>  
            <Box sx={{backgroundColor:"white",padding:"10px",height:{xs:"80%",sm:"70%" , md:"70%"}, width:{xs:"70%",sm:"50%" , md:"40%"}, boxShadow:"1px 1px 5px grey", display:"flex", flexDirection:"column", justifyContent:'center', alignItems:'flex-start'}}>
                   <Box sx={{width:"90%",display:"flex", justifyContent:"center"}}>
                        <h1>SignIn</h1>
                   </Box>
                   <form action="/authenticate" method="post"  onSubmit={handleSignIn}>
                        <input type="text" name="email" id="email" placeholder='email' style={{padding:'10px 20px', borderRadius:"10px", width:"90%", margin:"10px 2px"}}/>
                        <input type="password" name="password" id="password" placeholder='Password' style={{padding:'10px 20px', borderRadius:"10px", width:"90%", margin:"10px 2px"}} />
                        <Box sx={{display:"flex", justifyContent:"flex-end" }}>
                           <button style={{padding:"5px 10px", borderRadius:"10px", backgroundColor:"blue", textDecoration:"none", color:"whitesmoke"}}>SignIn</button>
                        </Box>
                   </form>
                   <Box sx={{display:"flex",justifyContent:"flex-start"}}>
                        <NavLink to="/sign-up" style={{padding:"5px 10px", borderRadius:"10px", backgroundColor:"grey", textDecoration:"none", color:"whitesmoke"}}>SignUp</NavLink>
                   </Box>
            </Box>
        </Box>
    )
}

export default SignIn