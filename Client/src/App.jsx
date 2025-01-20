import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Stories from './components/Stories';
import Events from './components/Events'
import Messages from './components/Messages'
import Profile from './components/Profile';
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Rehydrate from './components/RehydrateUser';
import { useDispatch, useSelector } from 'react-redux';
import getSocket, { connectSocket, disconnectSocket } from './utils/socketManager';
import { VideoCallPage } from './components/VideoCallPage';
import { setNavigate } from './utils/navigationService';

const App = () => {
  let user = useSelector((state) => state.user).user;
  const navigate= useNavigate();
  
  React.useEffect(() => {
    setNavigate(navigate); // Set the navigation function globally
  }, [navigate]);

  useEffect(() => {
    if (user) {
      let user_id = user._id;
      const token = localStorage.getItem('token'); // Make sure 'token' is the string key
      let socket=getSocket();
      if (!socket) {
        console.log("Calling socket connect !")
        connectSocket(user_id)
      }
      // Clean up the socket connection when the component unmounts
      return () => {
        disconnectSocket();
      };
    }
  }, [user]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [clickedPost, setClickedPost] = React.useState(undefined);
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    console.log("Toggling drawer to:", open); // Debug log
    if(open==false){
      setClickedPost(undefined)
    }
    setDrawerOpen(open);
  };

  const handleCardClick = (post) => {
    console.log("Card clicked"); // Debug log
    setClickedPost(post);
    toggleDrawer(true)();
  };

  return (
    <Rehydrate>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/video-call" element={<VideoCallPage />} />
          <Route path="/" element={user ? <Layout /> : <Navigate to="/sign-up" />}>
            <Route path="/" element={user ? <Home handleCardClick={handleCardClick} open={drawerOpen} toggleDrawer={toggleDrawer} clickedPost={clickedPost} /> : <Navigate to="/sign-up" />} />
            <Route path="/stories" element={user ? <Stories /> : <Navigate to="/sign-up" />} />
            <Route path="/events" element={user ? <Events handleCardClick={handleCardClick} open={drawerOpen} toggleDrawer={toggleDrawer} clickedPost={clickedPost} /> : <Navigate to="/sign-up" />} />
            <Route path="/messages" element={user ? <Messages /> : <Navigate to="/sign-up" />} />
            <Route path="/profile/:id" element={user ? <Profile handleCardClick={handleCardClick}  open={drawerOpen} toggleDrawer={toggleDrawer} clickedPost={clickedPost} /> : <Navigate to="/sign-up" />} />
          </Route>
        </Routes>
    </Rehydrate>
  );
};

export default App;
