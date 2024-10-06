import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { NavLink } from 'react-router-dom';
import StoryDrawer from './StoryDrawer';
import { fetchStories } from '../features/conversationSlice';
import getSocket from "../utils/socketManager"
import StoriesCard from './StoriesCard'; // Assuming StoriesCard is another component
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';


export default function Stories() {
  let user = useSelector((state) => state.user).user;
  let user_id = user._id;
  const [socket, setSocket] = React.useState(undefined);
  const [index, setIndex] = React.useState(0)
  const { stories } = useSelector((state) => state.conversations.direct_chat);
  const dispatch = useDispatch();
  const [storyDrawerOpen, setStoryDrawerOpen] = React.useState(false);
  const [clickedStory, setClickedStory] = React.useState(undefined);
  useEffect(() => {
    setSocket(getSocket())
    if (socket) {
      fetchAllStories();
    }
  }, [socket])

  const fetchAllStories = () => {
    if (socket) {
      socket.emit('fetchStories', (storydata) => {
        console.log('Stories get --> ' + storydata.stories)
        dispatch(fetchStories({ stories: storydata.stories }));
      })
    }
  }

  const toggleStoryDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    console.log("Toggling drawer to:", open); // Debug log
    setStoryDrawerOpen(open);
    setClickedStory(undefined)
  };

  const handleStoryClick = (story, index) => {
    console.log("index of story " + index)
    console.log("story changed -->" + JSON.stringify(story))
    setClickedStory(story);
    setIndex(index);
    console.log("Card clicked"); // Debug log
    setStoryDrawerOpen(true);
  };
  return (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", backgroundColor: "rgb(40, 40, 40)" }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <h1 style={{ color: "white", padding: "10px 25px" }}>Stories</h1>
          <ul id="storiesNav">
            <li><NavLink className='storiesNavItems'>For You</NavLink></li>
            <li><NavLink className='storiesNavItems'>Following</NavLink></li>
          </ul>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap" }}>
          {
            stories
              ?
              stories.map((story, key) => {
                return (
                  <StoriesCard story={story} onClick={() => handleStoryClick(story, index)} />
                )
              })
              :
              null
          }

          {
            clickedStory
              ?
              <Grid item xs={8} sm={4} md={3} sx={{ display: "flex", justifyContent: "center" }}>
                <StoryDrawer storyDrawerOpen={storyDrawerOpen} toggleStoryDrawer={toggleStoryDrawer} clickedStory={clickedStory} index={index} handleStoryClick={handleStoryClick} />
              </Grid>
              :
              null
          }
        </Grid>
      </Grid>
    </Box>
  );
}
