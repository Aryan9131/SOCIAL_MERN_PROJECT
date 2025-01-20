import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import getSocket from '../utils/socketManager';
import { Box, Button } from '@mui/material';
import ReactPlayer from 'react-player'
import peer from '../utils/peer';
import sendStreams from '../utils/sendStreamService';
import { setMyStream, setOtherPersonStream, removeMyTracks, removeOtherUserTracks } from '../features/streamingSlice';
import { useNavigate } from 'react-router-dom';
export const VideoCallPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const {myStream} = useSelector((state)=>state.stream);
  const { myStream } = useSelector((state) => state.stream);
  const { otherPersonStream } = useSelector((state) => state.stream);
  const { room_id } = useSelector((state) => state.conversations.direct_chat)
  const user = useSelector((state) => state.user).user;
  const [socket, setSocket] = useState(() => getSocket()); // Initialize socket immediately
  const { current_conversation } = useSelector((state) => state.conversations.direct_chat)
  useEffect(() => {
    // Set the dispatch function in PeerService
    peer?.setReduxDispatch(dispatch);
  }, [dispatch]);

  useEffect(() => {
    console.log('***** socket ' + socket.id);
  }, [socket])
  useEffect(() => {
    console.log('stream changed ', myStream);
  }, [myStream])

  const handleVideoCall = useCallback(async () => {
    try {
      if (!socket) {
        console.error('Socket not initialized');
        return;
      }
      console.log('inside handleVideoCall: ');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      console.log('inside handleVideoCall: ', stream);
      sendStreams(peer.peer, stream)
      dispatch(setMyStream({ myStream: stream })); // Update Redux state
      const offer = await peer?.getOffer();
      socket.emit('user:call', { otherPersonSocketId: current_conversation?.otherPersonSocketId, roomId: room_id, offer });
    } catch (error) {
      console.log('error inside handleVideoCall: ', error);
    }
  }, [dispatch, socket, current_conversation, room_id]);


  const handleNegoNeeded = useCallback(async () => {
    if (peer && !peer.isNegotiating) {
      const offer = await peer?.getOffer(); // Triggers negotiation
      await peer?.peer.setLocalDescription(offer); // Set as local description
      socket.emit('peer:nego:needed', { otherPersonSocketId: current_conversation?.otherPersonSocketId, offer });
    }
  }, [socket, current_conversation]);

  const handleEndCall = useCallback(async ()=>{
    console.log('handleEndCall called !')
    socket.emit('end:call', {to:current_conversation?.otherPersonSocketId})
    navigate('/messages')
  })
  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    console.log('negotiationneeded event listener running !')
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
      dispatch(removeMyTracks());
      dispatch(removeOtherUserTracks());
      peer.stopConnection()
    }
  }, [handleNegoNeeded])


  // Example usage
  useEffect(() => {
    console.log('otherpersonStream changed to ', otherPersonStream);
  }, [otherPersonStream])
  return (
    <Box>
      <div>VideoCallPage</div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ marginRight: '10px' }}>
          <p>my stream</p>
          {
            myStream
              ?
              <ReactPlayer playing muted url={myStream} width='200px' height='200px' />
              :
              null
          }
        </Box>
        <Box>
          <p>otherPerson stream</p>
          {
            otherPersonStream
              ?
              <ReactPlayer playing muted url={otherPersonStream} width='400px' height='450px' />
              :
              null
          }
        </Box>
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Button color='success' onClick={handleVideoCall}>Call</Button>
        <Button color='error' onClick={handleEndCall}>End</Button>
        <Button color='success' onClick={()=>{sendStreams(peer?.peer, myStream)}}>Stream</Button>
      </Box>
    </Box>

  )
}
