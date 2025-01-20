import { createSlice } from '@reduxjs/toolkit';
import peer from '../utils/peer';

const initialState = {
    myStream: undefined,
    otherPersonStream: undefined
};

const streamingSlice = createSlice({
    name: 'streaming',
    initialState,
    reducers: {
        setMyStream: (state, action) => {
            state.myStream = action.payload.myStream;
        },
        setOtherPersonStream: (state, action) => {
            console.log('Got stream for other person:', action.payload.otherPersonStream);
            console.log('Previous state:', state.otherPersonStream); // Log previous state
            state.otherPersonStream = action.payload.otherPersonStream;
            console.log('Updated state:', state.otherPersonStream); // Log the updated state
        },                      
        // Cleanup function to remove existing tracks
        removeMyTracks: (state) => {
            console.log('REMOVE-MyTracks() called !')
            const existingSenders = peer.peer.getSenders();
            // Remove all current tracks
            existingSenders.forEach((sender) => {
                if (sender.track) {
                    peer.peer.removeTrack(sender);
                }
            });
            state.myStream.getTracks().forEach((track) => track.stop());
            state.myStream= undefined;
        },
        removeOtherUserTracks: (state) => {
            console.log('REMOVE-OtherUserTracks() called !')
            state.otherPersonStream.getTracks().forEach((track) => track.stop());
            // Remove all current tracks
            state.otherPersonStream=undefined;
        }
    },
});

export const { setMyStream, clearMyStream, setOtherPersonStream, clearOtherPersonStream, removeMyTracks, removeOtherUserTracks } = streamingSlice.actions;
export default streamingSlice.reducer;
