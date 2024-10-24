import '../index.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from './Card';
import PostCard from './PostCard';
import FeaturedStories from './FeaturedStories';
import { NavLink } from "react-router-dom";
import DrawerTemplate from './DrawerTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import StoryDialog from './StoryDialog';
import { fetchStories } from '../features/conversationSlice';
import getSocket from "../utils/socketManager"
import StoryDrawer from './StoryDrawer'
import { addNotification } from '../features/socketSlice';
import { useNavigate } from 'react-router-dom';

export default function Home({ handleCardClick, open, toggleDrawer, clickedPost }) {
  let user = useSelector((state) => state.user).user;
  const { notifications } = useSelector((state) => state.socket)
  let user_id = user._id;
  const token = localStorage.getItem('token'); // Make sure 'token' is the string key
  const [commentData, setCommentData] = React.useState("");
  const [updatedCommentData, setUpdatedCommentData] = React.useState('')
  const [userPosts, setUserPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [socket, setSocket] = React.useState(undefined);
  const [index, setIndex] = React.useState(undefined)
  const { stories } = useSelector((state) => state.conversations.direct_chat);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  useEffect(() => {
    setSocket(getSocket())
    if (user) {
      fetchPosts();
    }
  }, [user, socket]);
  useEffect(() => {
    if (socket) {
      fetchAllStories();
    }
  }, [socket])

  const fetchAllStories = () => {
    if (socket) {
      socket.emit('fetchStories', (storydata) => {
        console.log('Stories get --> ' + storydata.stories)
        const fetchedStoriesWithIsLikedStatus = storydata.stories.map((stry) => {
          return (
            {
              ...stry,
              isLiked: stry.likes.includes(user._id.toString()),
            }
          )
        })
        dispatch(fetchStories({ stories: fetchedStoriesWithIsLikedStatus }));
      })
    }
  }
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${user._id}/posts`);
      const data = await response.json();
      console.log('user id ' + user._id)
      console.log("fetchedPost data -->" + JSON.stringify(data))

      // setting User Posts state
      setUserPosts(data.userPosts.map((pst) => {
        return (
          {
            ...pst,
            isLiked: pst.likes.includes(user._id.toString()),
          }
        )
      }))
      // setting all Posts state
      setAllPosts(data.allPosts.map((pst) => {
        return (
          {
            ...pst,
            isLiked: pst.likes.includes(user._id.toString()),
          }
        )
      }))
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  const handleCreatePost = (newPost) => {
    dispatch(addNotification({ message: 'post created sucessfully !' }));
    setUserPosts((prev) => [newPost, ...prev]);
  }

  const handleDeletePost = async (postId, imgId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/post/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imgId: imgId })
      });

      if (response.status == 401 || response.status == 204) {
        console.log('this is running to handle unautherized ***')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/sign-in')
      } else {
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        const data = await response.json();
        if (data.status === 200) {
          setUserPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
          dispatch(addNotification({ message: 'post deleted sucessfully !' }));
          console.log("post deleted successfully !")
        }
      }

    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const handleEditCommentSubmit = async (commentId, setPostComments) => {
    try {
      if (updatedCommentData.trim().length > 0) {
        const updatedCommentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/comment/update-comment/${commentId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: updatedCommentData,
          })
        })
        if (updatedCommentResponse.status == 401 || updatedCommentResponse.status == 204) {
          console.log('this is running to handle unautherized ***')
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/sign-in')
        } else {
          const updatedCommentResponseData = await updatedCommentResponse.json();
          console.log("updatedCommentData--> " + JSON.stringify(updatedCommentResponseData))
          if (updatedCommentResponseData.status == 'ok') {
            setPostComments((prev) => {
              return prev.map((cmnt) => {
                if (cmnt._id.toString() == commentId.toString()) {
                  cmnt.data = updatedCommentData;
                  return cmnt;
                } else {
                  return cmnt;
                }
              })
            })
          } else {
            console.log("can't update comment !")
          }
        }
      }

    } catch (error) {
      console.log("Error while updating Comment : " + error)
    }
  };
  const handleCommentSubmit = async (postId, setPostComments) => {
    try {
      if (commentData.trim().length > 0) {
        const createCommentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/comment/create-comment`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: commentData,
            post: postId,
            user: user._id
          })
        })
        if (createCommentResponse.status == 401 || createCommentResponse.status == 204) {
          console.log('this is running to handle unautherized ***')
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/sign-in')
        }else{
          if (!createCommentResponse.ok) {
            throw new Error('Failed to create post');
          }
          const createCommentResponseData = await createCommentResponse.json();
          setPostComments((prev) => [...prev, createCommentResponseData.comment])
          setCommentData("");
          console.log("createCommentResponseData ->" + JSON.stringify(createCommentResponseData.comment))
        }
        
      }
    } catch (error) {
      console.log("Error while creating Comment : " + error)
    }
  }

  const handleCommentDelete = async (postId, commentId, setPostComments) => {
    try {
      const deleteCommentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/comment/delete-comment/${commentId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: postId
        })
      })
      if (deleteCommentResponse.status == 401 || deleteCommentResponse.status == 204) {
        console.log('this is running to handle unautherized ***')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/sign-in')
      }else{
        if (!deleteCommentResponse.ok) {
          throw new Error('Failed to delete post');
        }
        const deleteCommentResponseData = await deleteCommentResponse.json();
        setPostComments((prev) => {
          return (
            prev.filter((cmnt) => cmnt._id.toString() != commentId)
          )
        })
        console.log("deleteCommentResponseData ->" + JSON.stringify(deleteCommentResponseData))
      }
      
    } catch (error) {
      console.log("Error while deleting Comment : " + error)
    }
  }
  const [storyDrawerOpen, setStoryDrawerOpen] = React.useState(false);
  const [clickedStory, setClickedStory] = React.useState(undefined);
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
    <Box sx={{ flexGrow: 1, marginTop: "50px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} sx={{ marginLeft: "10px", display: "flex", justifyContent: "space-between" }}>
          <h4>Stories: </h4>
          <h5><NavLink to="/stories">See All</NavLink></h5>
        </Grid>
        <Grid item xs={12} sm={12} id="featuredStories" sx={{ marginLeft: "10px", width: "100vw", display: "flex", overflow: "hidden" }}>
          <Box sx={{
            width: "55px",
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "1px 10px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <StoryDialog />
            <Typography sx={{ fontWeight: "700", fontSize: ".6rem" }}> Add Story</Typography>
          </Box>
          <Box sx={{ display: "flex", overflowX: "scroll", '&::-webkit-scrollbar': { display: "none" } }}>
            {
              stories
                ?
                stories.map((story, index) => {
                  return (
                    <FeaturedStories story={story} key={story._id} index={index} handleStoryClick={handleStoryClick} />
                  )
                })
                :
                null
            }
            {
              clickedStory
                ?
                <StoryDrawer storyDrawerOpen={storyDrawerOpen} toggleStoryDrawer={toggleStoryDrawer} clickedStory={clickedStory} index={index} handleStoryClick={handleStoryClick} />
                :
                null
            }
          </Box>
          {/* Repeat FeaturedStories with handleCardClick as necessary */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} id="leftContent">
          <PostCard id="postCard" createPost={handleCreatePost} />

          {
            userPosts.map((post) => (
              <Card key={post._id}
                post={post} deletePost={handleDeletePost}
                allPosts={userPosts} setPosts={setUserPosts}
                commentData={commentData}
                setCommentData={setCommentData}
                updatedCommentData={updatedCommentData}
                setUpdatedCommentData={setUpdatedCommentData}
                handleCommentSubmit={handleCommentSubmit}
                handleCommentDelete={handleCommentDelete}
                handleEditCommentSubmit={handleEditCommentSubmit}
                onClick={() => handleCardClick(post)} />
            ))
          }
        </Grid>
        <Grid item xs={12} sm={6} md={8} id="rightContent">
          {
            allPosts.map((post) => (
              <Card post={post} key={post._id}
                allPosts={allPosts} setPosts={setAllPosts}
                commentData={commentData}
                setCommentData={setCommentData}
                updatedCommentData={updatedCommentData}
                setUpdatedCommentData={setUpdatedCommentData}
                handleCommentSubmit={handleCommentSubmit}
                handleCommentDelete={handleCommentDelete}
                handleEditCommentSubmit={handleEditCommentSubmit}
                onClick={() => handleCardClick(post)} />
            ))
          }
        </Grid>
        {
          clickedPost
            ?
            <Grid item xs={8} sm={4} md={3} sx={{ display: "flex", justifyContent: "center" }}>
              <DrawerTemplate open={open}
                toggleDrawer={toggleDrawer}
                clickedPost={clickedPost}
                commentData={commentData}
                setCommentData={setCommentData}
                updatedCommentData={updatedCommentData}
                setUpdatedCommentData={setUpdatedCommentData}
                handleCommentSubmit={handleCommentSubmit}
                handleCommentDelete={handleCommentDelete}
                handleEditCommentSubmit={handleEditCommentSubmit}
              />
            </Grid>
            :
            null
        }
      </Grid>

    </Box>
  );
}
