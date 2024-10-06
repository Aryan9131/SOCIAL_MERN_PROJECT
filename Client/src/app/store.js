import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import socketReducer from '../features/socketSlice';
import conversationReducer from '../features/conversationSlice';

const store = configureStore({
    reducer: {
        user: userReducer,        // State slice for user
        socket: socketReducer,    // State slice for socket events
        conversations: conversationReducer
    }
});

export default store;
