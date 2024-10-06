import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeNotification } from '../features/socketSlice'; 

const GlobalNotifications = () => {
    const notifications = useSelector((state) => state.socket.notifications);
    const dispatch = useDispatch();
    const [processing, setProcessing] = React.useState(false); // Track notification processing
    useEffect(() => {
        // Only process if there's a notification and we're not already processing one
        if (notifications.length > 0 && !processing) {
            setProcessing(true);  // Mark that a notification is being processed

            // Display the notification at 0th index
            toast(notifications[0].message, {
                onClose: () => {
                    // Once the notification closes, remove it and allow processing of the next one
                    dispatch(removeNotification());
                    setProcessing(false); // Allow the next notification to be processed
                }
            });
        }
    }, [notifications, dispatch, processing]);

    return (
        
        <Box >
        <ToastContainer />
        </Box>   
        
    )// This component doesn't need to render anything visually.
};

export default GlobalNotifications;
