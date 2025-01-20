import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Navigate, NavLink } from 'react-router-dom';
import ChattingDetails from './ChattingDetails'
import { useSelector, useDispatch } from 'react-redux';
import { Divider } from '@mui/material';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import FriendsDialog from './FriendsDialog'
import ExistingConversations from './ExistingConversations'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { fetchDirectConversations } from "../features/conversationSlice";
import getSocket from "../utils/socketManager"
import { useEffect, useState } from "react"
import { selectConversation, setClickedConversationId } from '../features/conversationSlice'
import { IconButton } from '@mui/material';
import CreateNewGroupDialog from './CreateGroupDialog';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

export default function BasicGrid() {
    const [allFriends, setAllFriends] = React.useState([]);
    const [allGroups, setAllGroups] = React.useState([]);
    const [socket, setSocket] = useState(undefined);
    const {showChattingDetails} = useSelector((state)=>state.conversations.direct_chat)
    let user = useSelector((state) => state.user).user;
    let user_id = user._id;
    let { room_id } = useSelector((state) => state.conversations.direct_chat)
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    console.log("room_id in messages.jsx -->" + room_id);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [value, setValue] = React.useState('Direct_messages');
    const [anchorNavEl, setAnchorNavEl] = React.useState(null);
    const openNav = Boolean(anchorNavEl);
    const handleClick = (event) => {
        setAnchorNavEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorNavEl(null);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        console.log("room id changed in messgae.jsx -->" + room_id)
    }, [room_id])
    useEffect(() => {
        setSocket(getSocket());
        const getUserDetails = async () => {
            const getAllUserFriendsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/get-friends`, {
                method: "Get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const getAllUserFriendsData = await getAllUserFriendsResponse.json();
            console.log("All frineds :--> " + JSON.stringify(getAllUserFriendsData.data))
            setAllFriends(getAllUserFriendsData.data);

            const getAllUserGroupsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/get-groups`, {
                method: "Get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const getAllUserGroupsData = await getAllUserGroupsResponse.json();
            console.log("All getAllUser GroupsData :--> " + JSON.stringify(getAllUserGroupsData.data))
            setAllGroups("groups --> " + JSON.stringify(getAllUserGroupsData.data));
        }
        getUserDetails();

        if (socket) {
            console.log("inside previos conversation event")
            socket.emit('previous_conversations', { user_id }, (data) => {
                console.log("fetched conversations -> " + JSON.stringify(data));
                dispatch(fetchDirectConversations({ conversations: data, userId:user_id }))
            })
        }
        return () => {
            // This cleanup function runs just before the component unmounts
            console.log('Component is unmounting or page is changing');
            // Place your cleanup logic here
            dispatch(setClickedConversationId({ conversationId: undefined }))
            dispatch(selectConversation({ room_id: undefined }))
        };
    }, [user, socket])
    return (
        <Grid container spacing={2} sx={{ width: {xs:'100vw', md:'100%'}, height: { xs: "90vh", md: "100vh" }, overflow: "hidden" }}>
            <Grid item xs={12} md={3.5} sx={{ display: { xs: showChattingDetails ? "none" : 'flex', md: "flex" }, flexDirection: "column" }}>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px", marginBottom: "15px" }}>
                    <h2>Chats</h2>
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", color: "rgba(79, 79, 79, 1)" }}>
                        <IconButton title="new Group" aria-label='group button'>
                            <CreateNewGroupDialog allFriends={allFriends} />
                        </IconButton>
                        <IconButton title="requests" aria-label='requests button'>
                            <FriendsDialog allFriends={allFriends} allGroups={allGroups} setAllFriends={setAllFriends} />
                        </IconButton>
                        <IconButton title="stories" aria-label='stories button' onClick={() => navigate('/stories')} >
                            <DonutLargeOutlinedIcon sx={{ margin: "0px 10px" }} />
                        </IconButton>
                    </Box>
                </Grid>

                <Grid item xs={12} sx={{ typography: 'body1' }}>
                    <TabContext value={value} >
                        <Box sx={{ width: "100%", overflowX: "auto", borderBottom: 1, borderColor: 'divider', }}>
                            <TabList onChange={handleChange} sx={{ width: "300px", overflowX: "auto" }} aria-label="lab API tabs example">
                                <Tab label="Direct" value="Direct_messages" />
                                <Tab label="Group" value="Group_messages" />
                                <Tab label="Archived" value="Archived" />
                            </TabList>
                        </Box>
                        <TabPanel value="Direct_messages" sx={{ padding: "0" }}>
                            <ExistingConversations type="single" />
                        </TabPanel>
                        <TabPanel value="Group_messages" sx={{ padding: "0" }}>
                            <ExistingConversations type="groups" />
                        </TabPanel>
                        <TabPanel value="Archived" sx={{ padding: "0" }}>
                            <ExistingConversations type="archived" />
                        </TabPanel>
                    </TabContext>
                </Grid>
            </Grid>
            <Grid item xs={12} md={8.5} sx={{display: { xs: showChattingDetails ? "flex" : 'none', md: "flex" }, width:{xs:'100vw', md:'100%'},
                                                         height: "100%",
                                                         backgroundColor: "#b9e2fa",
                                                         padding:'0px'
                                                      }}>
                <Box sx={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    {
                        room_id
                            ?
                            <ChattingDetails />
                            :
                            <>
                                <Box sx={{ backgroundColor: "rgba(246, 247,246, 1)", borderRadius: "55px" }}>
                                    <img src="https://dhws-production.s3.ap-south-1.amazonaws.com/66058bee22351b0015665eac/66064a39a7ab70001723c02a/66361aecdc6da000172a67f6/appSource/images/img_lock_gray_500.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQODH4IWPZWQNPYGZ%2F20240808%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240808T054100Z&X-Amz-Expires=25200&X-Amz-Signature=b580512ca96c978ceeb5a7c227c499b25792d8ed91350bc97374a24911656043&X-Amz-SignedHeaders=host" alt="" style={{ width: "80px", padding: "40px 50px" }} />
                                </Box>
                                <h1>
                                    It's nice to chat with someone
                                </h1>
                                <p>
                                    Pick a person from left menu and start your conversation
                                </p>
                            </>
                    }
                </Box>
            </Grid>
        </Grid>
    );
}
