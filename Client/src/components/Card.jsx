import * as React from 'react';
import Card from '@mui/material/Card';
import { Box } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreIconToDelete from './MoreIconToDelete'
import FormDialog from './CommentDrawer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GeneralCard(props) {
  const { post, deletePost, allPosts, setPosts , onClick }=props;
  const {commentData, setCommentData, updatedCommentData, setUpdatedCommentData, handleCommentSubmit, handleEditCommentSubmit, handleCommentDelete}=props
  let navigate = useNavigate();
  const [postComments, setPostComments]=React.useState(post.comments);
  const createdAt = new Date(post.createdAt);
  const today = new Date();
  let user = useSelector((state) => state.user).user;
  let user_id = user._id;
  const token = localStorage.getItem('token'); // Make sure 'token' is the string key
  const [likeCount, setLikeCount]=React.useState(post.likes.length)
  const isToday = createdAt.toDateString() === today.toDateString();
  const displayTime = isToday
    ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : createdAt.toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' });
  
    const handlePostLike = async (e) => {
    try {
      if(post.isLiked==true){
          const removeLikeResponse=await fetch(`${import.meta.env.VITE_BASE_URL}/post/remove-post-like/${post._id}`,{
            method: "Get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if(removeLikeResponse.status==401 || removeLikeResponse.status==204){
            console.log('this is running to handle unautherized ***')
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/sign-in')
          }else{
            const removeLikeData= await removeLikeResponse.json();
            post.isLiked=false;
            e.target.style.color= 'blueviolet'
            setLikeCount((prev)=>prev-1)
            console.log("removeLikeData : " + removeLikeData)
          }
          
      }else{
          const addLikeResponse=await fetch(`${import.meta.env.VITE_BASE_URL}/post/add-post-like/${post._id}`,{
            method: "Get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if(addLikeResponse.status==401 || addLikeResponse.status==204){
            console.log('this is running to handle unautherized ***')
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/sign-in')
          }else{
            const addLikeData= await addLikeResponse.json();
            post.isLiked=true;
            e.target.style.color= 'red'
            console.log("addLikeData : "+addLikeData)
            setLikeCount((prev)=>prev+1)
          }
          
      }
    } catch (error) {
        console.log("Error while adding/removing like on Post : "+error);
    }
    }
  return (
    <Card sx={{ maxWidth: 300, minWidth: { sx: 260, md: 300 }, marginBottom: "15px", boxShadow: '0', border: "0px", borderRadius: "15px", padding: "10px 20px", boxSizing: "border-box" }}  >
      <CardHeader
        avatar={
          <Avatar alt={post.user.name} src={post.user.avatar ? post.user.avatar.url : ""} variant="rounded" sx={{ cursor:"pointer", borderRadius: "15px" }} onClick={()=>navigate(`profile/${post.user._id}`)} />
        }
        action={
          deletePost && (post.user._id.toString()=== user_id.toString()) ?
              <MoreIconToDelete post={post} deletePost={deletePost} allPosts={allPosts} setPosts={setPosts} />
            : null
        }
        title={post.user.name}
        subheader={displayTime}
      />
      <Box onClick={onClick}>
        {
          post.img 
          ?
            <CardMedia
            component="img"
            height="194"
            image={post.img.url ? post.img.url :""}
            alt="Paella dish"
            sx={{ borderRadius: "10px", display: post.img ? "block" : "none" }}
          />
          :
          null
        }
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {post.data}
          </Typography>
        </CardContent>
      </Box>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"  onClick={handlePostLike}>
          <FavoriteIcon  
              sx={{color:post.isLiked ? "red" : 'blueviolet'}}
          />
        </IconButton>
        <Typography variant="body2" color="text.secondary" title="likes">
            {likeCount}
          </Typography>
        <IconButton aria-label="share" title="share">
          <ShareIcon />
        </IconButton>
        <FormDialog postComments={postComments} 
                    setPostComments={setPostComments}
                    commentData={commentData}
                    setCommentData={setCommentData}
                    updatedCommentData={updatedCommentData}
                    setUpdatedCommentData={setUpdatedCommentData}
                    handleCommentSubmit={handleCommentSubmit}
                    handleCommentDelete={handleCommentDelete}
                    handleEditCommentSubmit={handleEditCommentSubmit} 
                    postId={post._id}/>
        <Typography variant="body2" color="text.secondary" title="comments">
          {postComments.length}
        </Typography>
      </CardActions>  
    </Card>
  );
}
