import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        notifications: [],
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state) => {
            state.notifications.shift();
        },
    },
});

export const { addNotification, removeNotification } = socketSlice.actions;
export default socketSlice.reducer;
