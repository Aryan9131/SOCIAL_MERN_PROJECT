import { Outlet, useLocation  } from 'react-router-dom'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Search from '../components/Search';
import NavBar from '../components/NavBar'
import Notification from './Notification'
function Layout() {

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                <Grid container spacing={2} sx={{ flexDirection: { xs: "column", md: "row" } }}>
                        <Notification />
                    <Grid item xs={12} md={1.5} >
                        <NavBar />
                    </Grid>
                    <Grid item xs={12} md={10.5} id="mainContent" sx={{ backgroundColor: "whitesmoke", width:"100vw" }} >
                       {currentPath!='/messages' && currentPath!='/profile' ? <Search /> :null} 
                        <Outlet   />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Layout