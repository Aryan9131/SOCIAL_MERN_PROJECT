import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { NavLink } from 'react-router-dom';
import DrawerTemplate from './DrawerTemplate';
import EventCard from './EventCard'
import StoriesCard from './StoriesCard'; // Assuming StoriesCard is another component
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function Events({ handleCardClick, open, toggleDrawer, clickedPost }) {
    let user = useSelector((state) => state.user).user;
    const [userEvents, setUserEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    const likedEventsStatus = React.useMemo(() => {
      const userEventsIds = userEvents.map(evnt => evnt._id.toString());
          return allEvents.map(evnt => ({
              ...evnt,
              isLiked: userEventsIds.includes(evnt._id.toString()),
          })); 
    }, [allEvents, userEvents]);

    useEffect(() => {
        if (user) {
            fetchUserEvents();
        }
    }, [user]);
    const fetchUserEvents = async () => {
        try {
            const allEventsresponse = await fetch(`${import.meta.env.VITE_BASE_URL}/event/all-events`);
            const allEventsData = await allEventsresponse.json();
            setAllEvents(allEventsData.allEvents);
            const userEventsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/event/user-events/${user._id}`);
            const userEventsData = await userEventsResponse.json();
            setUserEvents(userEventsData.userEvents)
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }
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

    const handleEventLiked=async (evnt)=>{
        if(userEvents){
           const isPresent = userEvents.findIndex((obj) => obj._id.toString() == evnt._id.toString());
           if(isPresent!=-1){
            try {
                console.log('inside try block to of remove user to event')
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/event/delete-event-user`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    userId: user._id,
                    eventId: evnt._id
                  })
                });
                const data = await response.json();
                evnt.interestedUsers=evnt.interestedUsers.filter((prevUser)=>prevUser._id.toString() != user._id.toString())
                setUserEvents((prev)=>prev.filter((obj)=>obj._id.toString()!=evnt._id.toString()))
                console.log(data);
              } catch (error) {
                console.error('Error Deleting event from users list :', error);
              }
         }else{
            try {
                console.log('inside try block to add comment')
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/event/add-event-user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: user._id,
                  eventId: evnt._id
                })
              });
              const data = await response.json();
              evnt.interestedUsers.push(user)
              setUserEvents((prev)=>[evnt, ...prev]);
              console.log(data);
            } catch (error) {
              console.error('Error adding event  from users list :', error);
            }
           }
        }
         
     }
    return (
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ height: "90vh" }}>
                <Grid item sm={12} md={9} sx={{ backgroundColor: "whitesmoke", marginTop: "20px", display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
                    {
                           likedEventsStatus.length > 0
                            ?
                            likedEventsStatus.map((event) => (<EventCard key={event._id} handleCardClick={handleCardClick} event={event} allEvents={allEvents} setAllEvents={setAllEvents}  deleteEvent={handleDeleteEvent}  setUserEvents={setUserEvents} handleEventLiked={handleEventLiked} />))
                            :
                            null
                    }
                </Grid>
                <Grid item xs={12} md={3} sx={{borderTopLeftRadius:"10px",borderBottomLeftRadius:"10px", overflowY:"scroll", backgroundColor: "rgba(30, 31,33, 1)", marginTop: "20px", display:"flex", flexDirection:"column", alignItems:"center", color:"white" }}>
                    <Box sx={{marginBottom:"20px"}}> 
                        <h1>My next Events : </h1>
                    </Box>
                    <Box >
                        {
                            userEvents.map((event) => (
                                <Card key={event._id} sx={{ maxWidth: 250 ,margin:"15px 0px", color:"white", backgroundColor:"rgba(30, 31,33, 1)", boxShadow:"none", borderRadius:"0px"}} onClick={()=>handleCardClick(event)}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={event.img ? event.img.url : ""}
                                            alt="green iguana"
                                            sx={{borderRadius:"10px"}}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {event.heading}
                                            </Typography>
                                            <Typography variant="body2" color="whitesmoke">
                                                {event.date}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))
                        }
                    </Box>
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
            </Grid>
        </Box>
    );
}
