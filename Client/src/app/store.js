import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import socketReducer from '../features/socketSlice';
import conversationReducer from '../features/conversationSlice';
import streamingReducer from '../features/streamingSlice';

const store = configureStore({
    reducer: {
        user: userReducer,        // State slice for user
        socket: socketReducer,    // State slice for socket events
        conversations: conversationReducer,
        stream: streamingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore the action type for setMyStream
                ignoredActions: ['streaming/setMyStream', 'streaming/setOtherPersonStream'],
                // Ignore the path for myStream in the state
                ignoredPaths: ['stream.myStream','stream.otherPersonStream' ],
            },
        }),
});

export default store;
