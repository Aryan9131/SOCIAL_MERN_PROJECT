import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton, Typography } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import getSocket from '../utils/socketManager';
import {toggleStoryLike} from '../features/conversationSlice'
export default function SwipeableTemporaryDrawer({ storyDrawerOpen, toggleStoryDrawer, clickedStory, index, handleStoryClick }) {
  let user = useSelector((state) => state.user).user;
  const { stories } = useSelector((state) => state.conversations.direct_chat);
  const [progress, setProgress] = React.useState(0);
  const [isStopped, setIsStopped] = React.useState(false);
  const [timerId, setTimerId] = React.useState(null); // Store the interval ID
  const [likeCount, setLikeCount]=React.useState(clickedStory.likes.length)
  const [socket, setSocket] = React.useState(undefined);
  const dispatch =useDispatch();
  const  [clickedStoryLike, setClickedStoryLiked]=React.useState( clickedStory ? clickedStory.isLiked : false)
  const handleStoryLike = async (e) => {
    try {
      if(clickedStoryLike==true){
          console.log('dis-liking the story')
          socket.emit('removeStoryLike',{storyId : clickedStory._id.toString(), userId:user._id.toString()}, (data)=>{
            dispatch(toggleStoryLike({storyId : clickedStory._id }))
            e.target.style.color= 'white'
            setLikeCount((prev)=>prev-1);
            console.log("removeLikeData : " + JSON.stringify(data))
            setClickedStoryLiked(false);
          })
      }else{ 
        console.log('liking the story')        
          socket.emit('addStoryLike',{storyId : clickedStory._id.toString(), userId:user._id.toString()},(data)=>{
            dispatch(toggleStoryLike({storyId : clickedStory._id }))
            e.target.style.color= 'blue'
            console.log("addLikeData : "+JSON.stringify(data))
            setLikeCount((prev)=>prev+1)
            setClickedStoryLiked(true);
          })
      }
    } catch (error) {
        console.log("Error while adding/removing like on Post : "+error);
    }
    }
  const handleStoryChange = () => {
    index++;
    handleStoryClick(stories[index], index);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isStopped) {
      startProgress();
    } else {
      stopProgress();
    }
    setIsStopped(!isStopped);
  };

  // Start the interval to update progress
  const startProgress = () => {
    const id = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          if (index < stories.length - 1) {
            handleStoryChange();
          } else {
            clearInterval(id);
            toggleStoryDrawer(false); // Close the drawer when all stories are viewed
          }
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    setTimerId(id); // Store the interval ID
  };

  // Stop the interval
  const stopProgress = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };
  React.useEffect(()=>{
    setSocket(getSocket())
  },[])
  // Start the interval when the story opens, and clear it when the component unmounts
  React.useEffect(() => {
    if (!isStopped) {
      startProgress(); // Start progress only if it's not paused
    }

    // Clean up the interval on unmount
    return () => {
      stopProgress();
    };
  }, [index, isStopped]);

  const list = () => (
    <Box
      sx={{ width: "100vw", backgroundColor: "#1f1f21" }}
      role="presentation"
    >
      <Grid container spacing={2} sx={{ flexDirection: { xs: "column", md: "row" },justifyContent:"center", alignItems:"center", boxSizing: "border-box", color: "whitesmoke" }}>
        <Grid item xs={12} md={11} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-around", boxSizing: "border-box" }}>
            <Button onClick={toggleStoryDrawer(false)} sx={{ margin: 2 }}>
              Back
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "5px" }}>
              <p style={{ marginRight: "5px" }}>Aryan Nayak</p>
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" variant="rounded" sx={{ borderRadius: "15px" }} />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
          </Grid>
          <Grid item sm={12} sx={{
                                  position:'relative',
                                  display:"flex",
                                  justifyContent:"center",
                                  alignItems: "center",
                                  boxSizing: "border-box",
                                  flexWrap: "wrap",
                                  alignContent: "center"
                                  }}>
            <Box sx={{maxWidth:{xs:'100vw', md:'60vw'}, boxSizing: "border-box", display: "flex", justifyContent: "center", margin: "20px 20px" }}>
              <img src={(clickedStory && clickedStory.img) ? clickedStory.img.url : ''} alt="Story" style={{ width: "100%", height: "80vh", borderRadius: "10px" }} />
            </Box>
             <Box sx={{display:"flex", flexDirection:{xs:'row', md:'column'}, color:"white", marginBottom:'10px'}}>
                <IconButton sx={{position:"absolute",top:'2%',right:'5%', color:"white", backgroundColor:'#85827b', '&:hover':{backgroundColor:'lightblue'}}}  onClick={togglePlayPause}>
                  {
                    isStopped
                      ?
                      <PlayArrowIcon />
                      :
                      <PauseIcon />
                  }
                </IconButton>
                <IconButton sx={{ margin:{xs:'0px 20px', md:'20px 0px'},color:clickedStoryLike ? 'blue' :'white' , 
                                  backgroundColor: "rgba(255, 255, 255, 0.397)", 
                                  padding: "8px 15px", borderRadius: "10px"
                                }}
                                onClick={handleStoryLike}
                                  >
                  <ThumbUpAltIcon/>
                  <Typography>{likeCount}</Typography>
                 </IconButton>
                <IconButton sx={{color:"white", backgroundColor: "rgba(255, 255, 255, 0.397)", padding: "8px 15px", borderRadius: "10px"}}><ReplyIcon/></IconButton>
             </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={storyDrawerOpen}
      onClose={toggleStoryDrawer(false)}
      onOpen={toggleStoryDrawer(true)}
    >
      {list()}
    </SwipeableDrawer>
  );
}
