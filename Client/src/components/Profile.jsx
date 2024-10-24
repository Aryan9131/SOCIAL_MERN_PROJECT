import '../index.css';
import * as React from 'react';
import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ProfileCard from './ProfileCard';
import PostCard from './PostCard';

import Card from './Card';
import EventCard from './EventCard';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DrawerTemplate from './DrawerTemplate';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Profile({ handleCardClick, open, toggleDrawer, clickedPost }) {
  let user = useSelector((state) => state.user).user;
  let user_id = user._id;
  const location = useLocation();
  const currentPath = location.pathname;
  // Split the path by "/" and get the last part (the ID)
  const thisUserId = currentPath.split("/").pop();
  console.log(thisUserId);
  console.log(currentPath);
  let navigate = useNavigate();
  const [thisUser, setThisUser] = React.useState(undefined);
  const [userPosts, setUserPosts] = React.useState(undefined);
  const [userEvents, setUserEvents] = React.useState(undefined);
  const [userFriends, setUserFriends] = React.useState(undefined);
  const [value, setValue] = React.useState('Posts');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleDeletePost = async (postId, imgId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/post/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({imgId:imgId})
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      const data = await response.json();
      if (data.status===200) {
        setUserPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
        console.log("post deleted successfully !")
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const handleDeleteEvent = async (eventId, imgId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/event/delete-event/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({imgId:imgId})
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete Event');
      }
      
      const data = await response.json();
      if (data.status===200) {
        setUserPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
        console.log("Event deleted successfully !")
      }
      setUserEvents((prevEvents)=>{
          return(
            prevEvents.filter((event)=>event._id.toString()!=eventId.toString())
          )
      })
      setAllEvents((prevEvents)=>{
        return(
          prevEvents.filter((event)=>event._id.toString()!=eventId.toString())
        )
    })
    } catch (error) {
      console.error('Error deleting Event :', error);
    }
  };
  React.useEffect(() => {
    const fetchUser = async () => {
      const gettedUserResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${currentPath}`, {
        method: "Get",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!gettedUserResponse.ok) {
        throw new Error('Failed to Fetch user Profile ! ');
      }

      const gettedUserData = await gettedUserResponse.json();
      console.log("get user profile Response data --> " + JSON.stringify(gettedUserData.user));
      setThisUser(gettedUserData.user)
      setUserPosts(gettedUserData.posts)
      setUserEvents(gettedUserData.events)
      setUserFriends(gettedUserData.friends)
    }
    fetchUser();
  }, [currentPath])
  return (
    <Box sx={{ flexGrow: 1, marginTop: "50px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} id="leftContent">
          {thisUser ? (
            <>
               <ProfileCard
                  clickedUser={thisUser}
                  userFriendsLength={userFriends.length}
                  userPostsLength={userPosts.length}
                />
                <Box>
                  <Typography>
                    {thisUser.about}
                  </Typography>
                </Box>
                {
                  thisUser._id.toString()===user_id.toString()
                  ?
                  <Box>
                      <PostCard />
                  </Box>
                  :
                  null
                }
            </>
          ) : (
            <div>Loading...</div>
          )}
          
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <TabContext value={value} sx={{backgroundColor:"whitesmoke"}} >
            <Box sx={{ display: "flex", justifyContent: "space-evenly", borderBottom: 1, borderColor: 'divider', width: "100%", backgroundColor: "white", borderRadius:"10px" }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Posts" className='storiesNavItems' value="Posts" />
                <Tab label="Events" value="Events" />
                <Tab label="Friends" value="Friends" />
              </TabList>
            </Box>
            <TabPanel value="Posts" sx={{ padding: "10px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", backgroundColor: "whitesmoke" }}>
              {userPosts && userPosts.length > 0
                ?
                userPosts.map((post) => (
                  <Card key={post._id} post={post} deletePost={handleDeletePost} allPosts={userPosts} setPosts={setUserPosts} onClick={() => handleCardClick(post)} sx={{ margin: "10px" }} />
                ))
                :
                null
              }
            </TabPanel>
            <TabPanel value="Events" sx={{ padding: "10px", paddingTop: "0", display: "flex", justifyContent: "space-around", flexWrap: "wrap", backgroundColor: "whitesmoke" }}>
              {userEvents && userEvents.length > 0
                ?
                userEvents.map((event) => (
                  <EventCard key={event._id} event={event} handleCardClick={handleCardClick} deleteEvent={handleDeleteEvent} setAllEvents={setUserEvents} allEvents={userEvents} />
                ))
                :
                null
              }
            </TabPanel>
            <TabPanel value="Friends" sx={{ padding: "10px", paddingTop: "0", display: "flex", flexWrap: "wrap", backgroundColor: "whitesmoke" }}>
              {userFriends && userFriends.length > 0
                ?
                userFriends.map((friend) => (
                  <Box
                    key={friend.userId._id}
                    sx={{
                      cursor: "pointer",
                      position: "relative", // Ensure the parent Box has a relative position for ::before to work
                      margin:"10px",
                      zIndex: "1", // Make sure this is on top of other elements
                      '&:hover': {
                        '&::before': {
                          opacity: 0.3,  // Show the overlay on hover
                        },
                      },
                      '&::before': {
                        content: '""', // Required for pseudo-elements
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.5)",  // Glassy effect (semi-transparent white)
                        opacity: 0,  // Initially hidden
                        transition: "opacity 0.3s ease",  // Smooth transition for the hover effect
                        zIndex: 10, // Ensure it appears above the inner Box content
                        borderRadius: "15px"  // Match the border radius of the inner box
                      }
                    }}
                    onClick={() => navigate(`/profile/${friend.userId._id}`)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        padding:"5px",
                        color: "grey",
                        borderRadius: "10px",
                        position: "relative",
                        zIndex: 2  // Ensure it's above the hover overlay
                      }}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={friend.userId.avatar ? friend.userId.avatar.url : "https://mui.com/static/images/avatar/2.jpg"}
                        variant="rounded"
                        sx={{ borderRadius: "15px", height: "70px", width: "70px" }}
                      />
                      <Typography>
                        {friend.userId.name}
                      </Typography>
                    </Box>
                  </Box>

                ))
                :
                null
              }
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
      {
       clickedPost
        ?
        <Grid item xs={8} sm={4} md={3} sx={{ display: "flex", justifyContent: "center" }}>
          <DrawerTemplate open={open} toggleDrawer={toggleDrawer} clickedPost={clickedPost} />
         </Grid>
      :
      null
      }
    </Box>
  );
}
