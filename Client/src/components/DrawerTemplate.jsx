import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import MenuPopper from './MenuPopper';

export default function DrawerTemplate(props) {
  const { open, toggleDrawer, clickedPost }=props;
  const {commentData, setCommentData, updatedCommentData, setUpdatedCommentData, handleCommentSubmit, handleEditCommentSubmit, handleCommentDelete}=props
  let user = useSelector((state) => state.user).user;
  const token = localStorage.getItem('token'); // Make sure 'token' is the string key
  const [fetchedPost, setFetchedPost] = React.useState(undefined);
  const [postComments, setPostComments]=React.useState([]);
  const [readOnlyStates, setReadOnlyStates] = React.useState({});
  const eventDate=new Date(fetchedPost ? fetchedPost.date : '')
  const eventTime=new Date(fetchedPost ? fetchedPost.time : '')
  const handleReadOnlyStates = (commentId, value) => {
    let obj = {};
    obj[commentId] = value
    setReadOnlyStates((prev) => ({ ...prev, ...obj }))
}
 React.useEffect(()=>{
      console.log("UpdatedComment data value -->"+updatedCommentData)
 },[updatedCommentData])
  React.useEffect(() => {
    if(clickedPost.postType=='Post'){
      let obj = {}
    postComments.map((comment) => {
        const commentId = comment._id
        obj[commentId] = true;
    })
    setReadOnlyStates(obj)
    }
}, [postComments])
  React.useEffect(() => {
    if (clickedPost && clickedPost._id) {
      const getPost = async () => {
        const fetchedPostResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/post/get-post/${clickedPost._id}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postType: clickedPost.postType
          })
        });
        const fetchedPostResponseData = await fetchedPostResponse.json();
        console.log('fetched Post/Event --> ' + JSON.stringify(fetchedPostResponseData.data))
        setFetchedPost(fetchedPostResponseData.data);
        setPostComments(fetchedPostResponseData.data.comments)
      }
      getPost();
    }
  }, [clickedPost])
  const list = () => (
    <Box
      sx={{ width: { xs: "100vw", md: "90vw" }, height: "100vh", overflowX: "hidden", overflowY:{md:'hidden', sm:'scroll'}, backgroundColor: "whitesmoke" }}
      role="presentation"
    >
      <Grid container spacing={2} sx={{ flexDirection: { xs: "column", md: "row" }, boxSizing: "border-box", color: "whitesmoke" }}>
        <Grid item sm={11} md={8} sx={{ height: {md:"100vh", xs:'auto'}, overflow: "hidden", display: "flex", justifyContent: "flex-start", flexDirection: "column" }}>
          <Grid item sm={12} sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", boxSizing: "border-box", maxHeight: "50px", backgroundColor: "lightblue" }}>
            <Button onClick={toggleDrawer(false)} sx={{ margin: 2, height: "40px" }}>
              Back
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "5px" }}>
              <p style={{ marginRight: "9px" }}>{fetchedPost ? fetchedPost.user.name : "Guest"}</p>
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" variant="rounded" sx={{ borderRadius: "15px" }} />
            </Box>
          </Grid>
          <Grid item sm={12} sx={{ overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: 'column', alignItems: 'center', boxSizing: "border-box" }}>
            <Box sx={{ width: { xs: "100%", md: "70%", lg: "60%" }, boxSizing: "border-box", display: "flex", justifyContent: "center", margin: "20px 20px" }}>
              <img src={fetchedPost ? fetchedPost.img.url : ''} alt="Story" style={{ width: "auto", height: "auto", maxHeight: "500px", maxWidth: "95%", borderRadius: "10px" }} />
            </Box>
            {
              fetchedPost && fetchedPost.postType=='Event'
              ?
              <>
                <Box sx={{ width: { xs: "100%", md: "70%", lg: "60%" },borderRadius:"10px", backgroundColor:"white",justifyContent:"space-around", display: "flex", flexDirection: "row",alignItems:"flex-start", alignContent:"center", margin: "20px 20px", color: "black" }}>
                    <Box sx={{display:"flex", alignItems:"center"}}>
                      <Typography sx={{border:"2px solid grey",borderRadius:"10px", display:"inline-block", width:'fit-content', padding:"15px", fontWeight:'800'}}>{fetchedPost ? eventDate.getDate() : ''}</Typography>
                      <Box sx={{display:"flex", flexDirection:"column", alignItems:"flex-start", margin:"2px 10px"}}>
                        <Typography sx={{display:"flex"}}>{fetchedPost ? eventDate.toLocaleDateString('en-US', { weekday: 'long'}) : ''}</Typography>
                        <Typography sx={{display:"flex"}}>{fetchedPost ? eventDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{display:"flex", alignItems:"center"}}>
                      <Typography sx={{display:"flex", margin:"2px 10px"}}>Starts At </Typography>
                      <Typography  sx={{border:"2px solid grey",borderRadius:"10px", display:"inline-block", width:'fit-content', padding:"15px 10px", fontWeight:'800'}}>{fetchedPost ? eventTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }) : null }</Typography>
                    </Box>
                </Box>
                <Box sx={{ width: { xs: "100%", md: "70%", lg: "60%" }, display: "flex", flexDirection: "row", justifyContent:"center", color: "black" }}>
                  <Typography variant='h5' sx={{display:"flex"}}>{fetchedPost ? fetchedPost.heading : null}</Typography>
                </Box>
              
              </>
              :
              null
            }
            <Box sx={{ width: { xs: "100%", md: "70%", lg: "60%" }, display: "flex", flexDirection: "column", justifyContent: "flex-start", textAlign: "center", margin: "20px 20px", color: "black" }}>
              <Typography paragraph>{fetchedPost ? fetchedPost.data : ''}</Typography>
            </Box>
          </Grid>
        </Grid>
        {
          fetchedPost && fetchedPost.postType == 'Post'
            ?
            <Grid item sm={11} md={4} sx={{ display: "flex", flexDirection: "column", height:{xs: "60vh",md: "100vh"}, overflow: "hidden", backgroundColor: "rgba(30, 31,33, 1)", borderTopLeftRadius: "10", overflowY: "scroll" }}>
              <Box sx={{ padding: "20px", flex: 1 }}>
                <h1>Comments :</h1>
                <List>
                  {
                    fetchedPost && postComments
                      ?
                      postComments.map((comment, key) => {
                        const readOnly = readOnlyStates[comment._id]
                                        return (
                                            <>
                                                <ListItem alignItems="flex-start" id={comment._id}>
                                                    <ListItemAvatar >
                                                        <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} src="https://mui.com/static/images/avatar/3.jpg" />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={comment.user ? comment.user.name : 'guest'}
                                                        secondary={
                                                            <React.Fragment>

                                                                <Box id='editComment' >
                                                                    <TextField
                                                                        id={comment._id + "_textField"}
                                                                        multiline
                                                                        maxRows={6}
                                                                        variant="standard"
                                                                        InputProps={{
                                                                            readOnly: readOnly,
                                                                        }}
                                                                        value={readOnly ? comment.data : updatedCommentData}
                                                                        onChange={(e) => setUpdatedCommentData(e.target.value)}
                                                                        sx={{
                                                                            width: "100%",
                                                                            '& .MuiInput-underline:before': {
                                                                                borderBottom: 'none',
                                                                            },
                                                                            '& .MuiInput-underline:hover:before': {
                                                                                borderBottom: 'none',
                                                                            },
                                                                            '& .MuiInput-underline:after': {
                                                                                borderBottom: 'none',
                                                                            },
                                                                            '& .MuiInput-underline :hover': {
                                                                                borderBottom: 'none'
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Box sx={{
                                                                        display: readOnlyStates[comment._id] ? 'none' : 'flex',
                                                                        justifyContent: 'space-between', textTransform: 'lowercase',
                                                                        borderTop:"1px solid black"
                                                                       }}>
                                                                    <Button size="small"
                                                                        onClick={(event) => {
                                                                          handleReadOnlyStates(comment._id, true)
                                                                          setUpdatedCommentData("");
                                                                        }}
                                                                    >
                                                                        cancel
                                                                    </Button>
                                                                    <Button size="small" 
                                                                        onClick={(event) => {
                                                                            event.preventDefault();
                                                                            handleEditCommentSubmit(comment._id, setPostComments)
                                                                        }} >
                                                                        edit
                                                                    </Button>
                                                                    </Box>
                                                                </Box>

                                                            </React.Fragment>
                                                        }
                                                    />

                                                    {/* to Edit the comments */}
                                                    {
                                                      (comment.user._id.toString() == user._id.toString()) 
                                                            && 
                                                        readOnlyStates[comment._id] 
                                                       ?
                                                        <MenuPopper commentId={comment._id}
                                                                    handleReadOnlyStates={handleReadOnlyStates}
                                                                    handleCommentDelete={handleCommentDelete} 
                                                                    setPostComments={setPostComments}  
                                                                    setUpdatedCommentData={setUpdatedCommentData}
                                                                    commentData={comment.data}
                                                                    postId={fetchedPost._id} 
                                                        /> 
                                                       :
                                                       null
                                                     }

                                                </ListItem>

                                                <Divider variant="inset" component="li" />
                                            </>)
                      })
                      :
                      null
                  }
                </List>
              </Box>
              <Box sx={{ position: "sticky", bottom: "0px", backgroundColor: "rgba(30, 31,33, 1)" }} >
                <form action="comment/create-comment" method="post"
                  onClick={(e)=>{
                    e.preventDefault();
                    handleCommentSubmit(fetchedPost._id, setPostComments)
                  }}
                  style={{ display: "flex", alignItems: "flex-end",
                          flexWrap: "nowrap", justifyContent: "center",
                          paddingBottom: "10px", backgroundColor: "rgba(30, 31,33, 1)"
                        }}>
                  <TextField
                    autoFocus
                    required
                    id="name"
                    name="text"
                    type="text"
                    placeholder='Comment'
                    variant="standard"
                    value={commentData}
                    onChange={(e) => setCommentData(e.target.value)}
                    sx={{ position: "sticky", bottom: "-21px", marginTop: "15px", backgroundColor: "whitesmoke", width: "80%", height: "45px", paddingLeft: "10px" }}
                    InputProps={{
                      sx: {
                        height: "100%", // Ensure the input field takes the full height of the TextField
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'grey', // Optional: customize the border color
                          height: "45px", // Ensure the border height matches the TextField height
                        },
                      },
                    }}
                  />
                  <button style={{ height: "45px", backgroundColor: "grey", borderTopRightRadius: "10px", borderBottomRightRadius: '5px' }} >
                    <SendIcon sx={{ height: "25px", width: "35px", }} />
                  </button>
                </form>
              </Box>
            </Grid>
            :
            <Grid item sm={11} md={4} sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "rgba(30, 31,33, 1)", borderTopLeftRadius: "10", overflowY: "scroll" }}>
              <Box sx={{ padding: "20px", flex: 1 }}>
                <h1>Interested Users : </h1>
                <List>
                  {
                    fetchedPost && fetchedPost.interestedUsers
                      ?
                      fetchedPost.interestedUsers.map((interestedUser, key) => {
                        return (
                          <>
                            <ListItem alignItems="flex-start" id={interestedUser._id} sx={{ border: "1px solid whitesmoke", display: "flex", alignItems: "center" }}>
                              <ListItemAvatar >
                                <Avatar alt="Remy Sharp" sx={{ width: 34, height: 34 }} src="https://mui.com/static/images/avatar/3.jpg" />
                              </ListItemAvatar>
                              <ListItemText
                                primary={interestedUser.name ? interestedUser.name : 'guest'}
                              />
                            </ListItem>
                          </>)
                      })
                      :
                      null
                  }
                </List>
              </Box>
            </Grid>
        }

      </Grid>
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {list()}
    </SwipeableDrawer>
  );
}
