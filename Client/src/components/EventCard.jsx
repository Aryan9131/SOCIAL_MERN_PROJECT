import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupAvatars from './AvatarGroup'
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import MoreIconToDelete from './MoreIconToDelete'

export default function ImgMediaCard({handleCardClick, event, deleteEvent, allEvents, setAllEvents , setUserEvents, handleEventLiked}) {
  const [interested, setInterested]=React.useState(false);
  let user = useSelector((state) => state.user).user;
  const user_id=user._id;
  const eventDate=new Date(event.date);
  const eventTime=new Date(event.time)
  return (
    <Card sx={{ maxWidth: 350, boxShadow:"none", borderRadius:"10px" ,margin:"20px 10px", boxSizing:"border-box", padding:"20px"}}  >
      <CardMedia
        component="img"
        alt="green iguana"
        height="180"
        image={event.img ? event.img.url :""}
        sx={{borderRadius:"10px"}}
        onClick={()=>handleCardClick(event)}
      />

      <CardHeader
         avatar={
            <Typography varient='h2' sx={{border:"2px solid rgba(155, 155, 155, 0.708)",borderRadius:"12px", padding:'6px 15px'}} >
                {event ? eventDate.getDate() : ''}
            </Typography>
        }
        action={
          deleteEvent && (event.user._id.toString() == user_id.toString()) ?
              <MoreIconToDelete post={event} deletePost={deleteEvent} allPosts={allEvents} setPosts={setAllEvents} />
            : null
        }
        title={event ? eventDate.toLocaleDateString('en-US', { weekday: 'long'}) : ''}
        subheader={event ? eventDate.toLocaleDateString('en-US', { year: 'numeric'}) : ''}
      />
      <CardContent sx={{display:"flex", flexDirection:"column", textAlign:"center"}}>
        <Typography gutterBottom variant="h5" component="div">
          {event.heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
             Starts at <Typography variant='span' sx={{fontWeight:"800"}}>{event ? eventTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }) : ''}</Typography> in Los Angeles
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex", justifyContent:'space-between'}}>
        <Button variant="contained"  sx={{boxShadow:"none", backgroundColor :event.isLiked ? "grey" : "green"}} onClick={()=>handleEventLiked(event)}>
           {
              event.isLiked
               ? 
                <span><CheckIcon/>Interested</span>
               : 
              "Interested" 
           }
        </Button>
        <GroupAvatars/>
      </CardActions>
    </Card>
  );
}