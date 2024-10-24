import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import Button from '@mui/material/Button';
import useImgPreview from '../hooks/handleImgPreview'
import PostDrawer from './PostDrawer'
import AddIcon from '@mui/icons-material/Add';

export default function PostCard({createPost}) {
    const [expanded, setExpanded] = React.useState(false);
    const imgRef=React.useRef(null);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    function handleClick(e) {
        e.target.style.color = "red"
    }
    const ariaLabel = { 'aria-label': 'description' };

    const {handleMediaChange, mediaUrl, isVideo} =useImgPreview() 

    return (
        <Card sx={{ maxWidth: 300, minWidth: { sx: 260, md: 300 } , marginBottom: "15px", boxShadow: '0', border: "0px", borderRadius: "15px", padding: "10px 20px", boxSizing: "border-box" }} >
            <CardHeader
                avatar={
                    <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                }
                sx={{display:"flex", justifyContent:"space-around", textAlign:"center",color:"grey"}}
                title="What are you thinking ?"
            // subheader="5 min ago"
            />

            <CardActions disableSpacing sx={{marginTop:"30px", overflow:"hidden"}}>
                <IconButton aria-label="add to favorites" onClick={()=>imgRef.current.click()}   sx={{padding:"8px", backgroundColor:"rgba(210, 210, 210, 0.599)", borderRadius:"10px"}}>
                    <input type="file" name="img" id="file-upload" placeholder ="hello" ref={imgRef} hidden  onChange={handleMediaChange}/>
                    <CameraAltIcon sx={{height:"15px", width:"15px"}}  />
                </IconButton>
                <IconButton aria-label="share"  sx={{padding:"8px", backgroundColor:"rgba(210, 210, 210, 0.599)", margin:"0px 5px", borderRadius:"10px"}}>
                    <VideocamIcon  sx={{height:"15px", width:"15px"}}  />
                </IconButton>
                <IconButton aria-label="share"  sx={{padding:"8px", backgroundColor:"rgba(210, 210, 210, 0.599)", borderRadius:"10px"}}>
                   <AddIcon  sx={{height:"15px", width:"15px"}}/>
                </IconButton>
                <PostDrawer createPost={createPost}/>
            </CardActions>
        </Card>
    );
}
