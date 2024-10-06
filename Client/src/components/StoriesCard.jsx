import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Avatar, CardActionArea, CardHeader, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import getSocket from '../utils/socketManager';
export default function StoriesCard({ story, onClick }) {
  const navigate = useNavigate(); // Ensure you have useNavigate from react-router-dom
  let user = useSelector((state) => state.user).user;
  const [socket, setSocket] = React.useState(undefined);
  React.useEffect(()=>{
      setSocket(getSocket());
  },[user])
  return (
    <Card
      sx={{
        position: 'relative',
        maxWidth: 250,
        minWidth: 200,
        margin: "20px 10px",
        height: 375,
        borderRadius: 2
      }}
      onClick={onClick}
    >
      <CardActionArea sx={{ position: 'relative' }}>
        {/* This Box will stack Avatar and title vertically */}
        {
          story.userId._id.toString() == user._id.toString()
            ?
            <IconButton sx={{
              position: "absolute",
              top: '0',
              right: '1%',
              color: 'black',
              opacity: '1',
              zIndex: '10',
              backgroundColor:'grey',
              '&:hover':{
                backgroundColor:"grey",
                color:'red'
              }
            }}
            onClick={(e) => {
              console.log("Deleting story --> "+JSON.stringify(story))
              e.stopPropagation(); // Stop event propagation
              socket.emit('deleteStory', {_id: story._id.toString(), userId: user._id.toString(), img:story.img });
            }}
            >
              <DeleteIcon />
            </IconButton>
            :
            null
        }
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translate(-50%, 0)', // Adjust to keep both elements centered
            zIndex: 10,
            color: 'white',
            opacity: 1
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://mui.com/static/images/avatar/2.jpg"
            variant="rounded"
            sx={{ height: "60px", width: "60px", cursor: "pointer", borderRadius: "15px", marginBottom: '8px' }} // Margin added to space out Avatar and title
            onClick={() => navigate(`profile/${story.user._id}`)}
          />
          <Typography
            variant="h7"
            sx={{ fontWeight: 800, textAlign: 'center' }} // Font weight and alignment
          >
            {story.userId.name}
          </Typography>
        </Box>

        <CardMedia
          component="img"
          image={story.img.url}
          alt="Story Image"
          sx={{objectFit:"cover", height: 375, opacity: 0.9 , }}
        />
      </CardActionArea>
    </Card>
  );
}
