import React from 'react'
import {Box, TextField, Button} from '@mui/material';
import { NavLink , useNavigate  } from "react-router-dom";
function SignUp(){

    let navigate = useNavigate();

    const handleSignUp = async function(e){
        try {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
             fetch(`${import.meta.env.VITE_BASE_URL}/user/create-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              navigate('/sign-in');
            })
            .catch(error => console.error('Error:', error));
            
          } catch (error) {
            console.error(error.message);
          }
    };

    return(
        <Box sx={{backgroundColor:"whitespace",height:"80vh", display:"flex",justifyContent:"center", alignItems:"center"}}>
            <Box sx={{position:'absolute', backgroundColor:"white",padding:"10px",height:{xs:"50%",sm:"60%" , md:"70%"}, width:{xs:"70%",sm:"50%" , md:"40%"}, boxShadow:"1px 1px 5px grey", display:"flex", flexDirection:"column", justifyContent:'center', alignItems:'flex-start'}}>
                   <Box sx={{width:"90%",marginBottom:"10px",display:"flex", justifyContent:"center"}}>
                      <h1>SignUp</h1>
                   </Box>
                   <form action="/api/v1/user/create-user" method="post" onSubmit={handleSignUp}>
                        <TextField fullWidth label="name" name="name" id="name" />
                        <TextField fullWidth label="email" name="email" id="email" sx={{margin:"5px 0px"}} />
                        <TextField fullWidth label="password" type="password" name="password" id="password" sx={{marginBottom:"5px"}} />
                        <Box sx={{display:"flex", justifyContent:"flex-end" }}>
                           <Button variant="outlined" type='submit'>SignUp</Button>
                        </Box>
                   </form>

                  <Button variant="text" type='submit' sx={{position:'sticky',bottom:'5%'}}><NavLink to="/sign-in" style={{textDecoration:"none"}}>SignIn</NavLink></Button>
            </Box>
        </Box>
    )
}

export default SignUp