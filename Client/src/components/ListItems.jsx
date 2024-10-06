import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Tooltip from '@mui/material/Tooltip';
import { Button, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import socketSlice, { addNotification } from '../features/socketSlice';
import { useEffect } from 'react';
import getSocket from '../utils/socketManager';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

const FriendList = ({ handleClose, friends, allGroups }) => {
    console.log("friends in friends list --> " + friends);
    console.log("groups in friends list --> " + allGroups);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(undefined);
    let user = useSelector((state) => state.user).user;
    let user_id = user._id;
    const handleChatIconClick = (item_id) => {
        socket.emit('start_conversation', { to: item_id, from: user_id })
        handleClose();
    }
    useEffect(() => {
        setSocket(getSocket());
    }, [])
    return (
        <>
            {friends && friends.map((item) => (
                <ListItem
                    key={item._id} // Ensure each item has a unique key
                    secondaryAction={
                        <Tooltip title="Chat" placement="right-start">
                            <IconButton edge="end" aria-label="chat" onClick={() => handleChatIconClick(item.userId)} sx={{ color: "rgba(103, 107, 236, 1)" }}>
                                <ChatBubbleOutlineOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    }
                >
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" sx={{ height: "40px", width: "40px" }} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.userId.name}
                    />
                </ListItem>
            ))}
        </>
    );
};

const ExploreList = ({ handleAddFriend , friends}) => {
    let user = useSelector((state) => state.user).user;
    let user_id = user._id;
    const [allUsers, setAllUsers] = useState([]);
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    useEffect(() => {
        const getAllUsers = async () => {
            const getAllUsersResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/get-users/${user._id}`);
            const getAllUsersData = await getAllUsersResponse.json();
            setAllUsers(getAllUsersData.data);
        };
        getAllUsers();
    }, []); // Empty dependency array means this runs once after the initial render

    return (
        <>
            {allUsers.map((item) => {
               const isFriendIndex = friends.findIndex(frnd => frnd.userId._id.toString() == item._id.toString());
                if (isFriendIndex==-1) {
                    return (
                        <ListItem
                            key={item._id} // Ensure each item has a unique key
                            secondaryAction={
                                <Tooltip title="Add Friend" placement="right-start">
                                    <IconButton edge="end" aria-label="add" onClick={() => handleAddFriend(item._id)}>
                                        <PersonAddIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" sx={{ height: "40px", width: "40px" }} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.name}
                            />
                        </ListItem>
                    )
                }
            })}
        </>
    );
};

const RequestsList = ({ handleAcceptRequest }) => {
    let user = useSelector((state) => state.user).user;
    let user_id = user._id;
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    const [allRequests, setAllRequests] = useState([]);

    useEffect(() => {
        const getAllRequests = async () => {
            const getAllFriendRequestsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/get-friend-request`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const getAllFriendRequestsData = await getAllFriendRequestsResponse.json();
            setAllRequests(getAllFriendRequestsData.data);
        };
        getAllRequests();
    }, []);

    return (
        <>
            {allRequests.map((item) => (
                <ListItem
                    key={item._id} // Ensure each item has a unique key
                    secondaryAction={
                        <Tooltip title="Accept" placement="right-start">
                            <IconButton edge="end" aria-label="accept">
                                <Button onClick={() => handleAcceptRequest(item._id)}>Accept</Button>
                            </IconButton>
                        </Tooltip>
                    }
                >
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" sx={{ height: "40px", width: "40px" }} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.sender.name}
                    />
                </ListItem>
            ))}
        </>
    );
};

const ListItems = ({ handleClose, listValues, allGroups, type, setAllFriends }) => {
    const token = localStorage.getItem('token'); // Make sure 'token' is the string key
    const handleAddFriend = async (friend_id) => {
        let socket = getSocket();
        const AddFriendResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/add-friend`, {
            method: 'Post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: friend_id })
        })
        const AddFriendResponseData = await AddFriendResponse.json()
        setAllFriends((prev) => [AddFriendResponseData.data, ...prev])
        console.log("request sent data --> " + JSON.stringify(AddFriendResponseData.data));
        console.log("Socket inside addFriend -->" + socket);
        socket.emit('request_sent', {
            message: "New Request Sent",
            to: friend_id
        })
    }

    const handleAcceptRequest = async (request_id) => {
        const AcceptFriendResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/user/accept-friend-request`, {
            method: 'Post',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ _id: request_id })
        })
        const acceptFriendResponseData = await AcceptFriendResponse.json()
        console.log("Recieved Data after accept --> " + JSON.stringify(acceptFriendResponseData))


    }
    console.log("Socket outside -->" + getSocket());
    return (
        <List>
            {
                (() => {
                    switch (type) {
                        case 'friends':
                            return <FriendList handleClose={handleClose} allGroups={allGroups} friends={listValues} />;
                        case 'requests':
                            return <RequestsList handleAcceptRequest={handleAcceptRequest} />;
                        case 'explore':
                            return <ExploreList handleAddFriend={handleAddFriend} friends={listValues} />;
                        default:
                            return <div>Nothing To Show !</div>;
                    }
                })()
            }
        </List>
    )

}

export default ListItems;