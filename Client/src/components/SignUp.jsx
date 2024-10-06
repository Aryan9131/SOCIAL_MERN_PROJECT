import React from 'react'
import Box from '@mui/material/Box';
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
            <Box sx={{backgroundColor:"white",padding:"10px",height:{xs:"80%",sm:"70%" , md:"70%"}, width:{xs:"70%",sm:"50%" , md:"40%"}, boxShadow:"1px 1px 5px grey", display:"flex", flexDirection:"column", justifyContent:'center', alignItems:'flex-start'}}>
                   <Box sx={{width:"90%",display:"flex", justifyContent:"center"}}>
                      <h1>SignUp</h1>
                   </Box>
                   <form action="/api/v1/user/create-user" method="post" onSubmit={handleSignUp}>
                        <input type="text" name="name" id="name" placeholder='name' style={{padding:'10px 20px', borderRadius:"10px", width:"90%", margin:"10px 2px"}}/>
                        <input type="text" name="email" id="email" placeholder='email' style={{padding:'10px 20px', borderRadius:"10px", width:"90%", margin:"10px 2px"}}/>
                        <input type="password" name="password" id="password" placeholder='Password' style={{padding:'10px 20px', borderRadius:"10px", width:"90%", margin:"10px 2px"}} />
                        <Box sx={{display:"flex", justifyContent:"flex-end" }}>
                           <button type='submit' style={{padding:"5px 10px", borderRadius:"10px", backgroundColor:"blue", textDecoration:"none", color:"whitesmoke"}}>SignUp</button>
                        </Box>
                   </form>
                   <Box sx={{display:"flex",justifyContent:"flex-start"}}>
                        <NavLink to="/sign-in" style={{padding:"5px 10px", borderRadius:"10px", backgroundColor:"grey", textDecoration:"none", color:"whitesmoke"}}>SignIn</NavLink>
                   </Box>
            </Box>
        </Box>
    )
}

export default SignUp