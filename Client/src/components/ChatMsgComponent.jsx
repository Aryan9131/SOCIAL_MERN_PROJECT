import { Box } from "@mui/material"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { setCurrentConversation, fetchCurrentMessages } from "../features/conversationSlice"
import { useSelector, useDispatch } from "react-redux"
import getSocket from "../utils/socketManager"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { Tooltip } from "@mui/material"
import Paper from '@mui/material/Paper';

const MessageDeleteAndUpdate = ({ msg, setRepliedMsg }) => {
    const {isSent, _id, file, data}=msg
    console.log("msgId get -->"+_id)
    const {user}=useSelector((state)=>state.user);
    const user_id=user._id;
    const [socket, setSocket] =useState(undefined);
    const {current_conversation} =useSelector((state)=>state.conversations.direct_chat)
    console.log("current_conversation in MessageDeleteAndUpdata --> "+JSON.stringify(current_conversation))
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(()=>{
         setSocket(getSocket())
    },[socket])
    return (
        <>
            <IconButton
                aria-label="open more"
                onClick={handleClick}
            >
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={()=>socket.emit('delete_message',{msgId:_id, conversationId:current_conversation._id, to :current_conversation.user_id , from :user_id, file:file})}>
                    <Tooltip title="delete" placement={isSent ? "left-start" : "right-start"}>
                        <DeleteIcon sx={{ width: "20px" }} />
                    </Tooltip>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Tooltip title="reply" placement={isSent ? "left-start" : "right-start"} onClick={()=>setRepliedMsg(msg)}>
                        <ReplyIcon sx={{ width: "20px" }} />
                    </Tooltip>
                </MenuItem>
            </Menu>
        </>
    );
}
const RepliedComponent = function ({ msg , setRepliedMsg }) {
    const {current_conversation} =useSelector((state)=>state.conversations.direct_chat)
    // console.log("Replied compoent called with isGroup ->" + JSON.stringify(current_conversation))
    console.log("Replied message component called --> "+JSON.stringify(msg))
    return (
        <Box sx={{ margin: "10px 10px", backgroundColor:"#b9e2fa", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: msg.isSent ? "flex-end" : "flex-start" }}>
            {
                msg.isSent
                    ?
                    <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                        <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg} />
                    </Box>
                    :
                    null
            }
            <Box sx={{display:"flex", flexDirection:"column", backgroundColor: msg.isSent ? "rgba(104, 106,236, 1)" : "white",borderRadius :msg.isSent ? "10px" :"0px", borderBottomRightRadius: msg.isSent ? "1px" : "10px",  color: msg.isSent ? "white" : "grey" }}>
                <Box>
                    {
                        current_conversation.isGroup && msg.isSent==false
                        ?
                        <Typography sx={{ paddingLeft:"5px", fontSize:'10px', backgroundColor: msg.isSent ? "rgba(104, 106,236, 1)" : "white", borderTopLeftRadius: "10px", borderTopRightRadius:"10px" , color: "black" }}>
                            {msg.userName}
                        </Typography>
                        :
                        null
                    }
                </Box>
                <Paper elevation={5} sx={{display:"flex", justifyContent:"space-between",alignItems:"center", margin:"5px 10px",padding:"2px 10px", backgroundColor:"rgba(255, 255, 255, 0.397)", borderRadius:"25px", color: msg.isSent ? "white" : "grey"}}>
                    {
                        msg.repliedMsgData && msg.repliedMsgData.fileUrl
                          ?
                         <img src={msg.repliedMsgData ? msg.repliedMsgData.fileUrl : ""} alt="RepliedMsgImg" width="40px" height="40px" style={{borderRadius:"10px"}} />
                          :
                          null
                    }
                    <Typography>
                        {msg.repliedMsgData.data}
                    </Typography>
                </Paper>
                <Typography sx={{color: msg.isSent ? "white" : "grey", padding:"5px 15px" }}>
                    {msg.data}
                </Typography>
            </Box>
            {
                !msg.isSent
                    ?
                    <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                        <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg} />
                    </Box>
                    :
                    null
            }
        </Box>
    )
}
const TxtComponent = function ({ msg , setRepliedMsg }) {
    const {current_conversation} =useSelector((state)=>state.conversations.direct_chat)
    console.log("text compoent called with isGroup ->" + JSON.stringify(current_conversation))
    console.log("text message component called --> "+JSON.stringify(msg))
    return (
        <Box sx={{ margin: "10px 10px", backgroundColor:"#b9e2fa", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: msg.isSent ? "flex-end" : "flex-start" }}>
            {
                msg.isSent
                    ?
                    <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                        <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg} />
                    </Box>
                    :
                    null
            }
            <Box>
                {
                    current_conversation.isGroup && msg.isSent==false
                    ?
                    <Typography sx={{ paddingLeft:"5px", fontSize:'10px', backgroundColor: msg.isSent ? "rgba(104, 106,236, 1)" : "white", borderTopLeftRadius: "10px", borderTopRightRadius:"10px" , color: "black" }}>
                        {msg.userName}
                    </Typography>
                    :
                    null
                }
                <Typography sx={{ backgroundColor: msg.isSent ? "rgba(104, 106,236, 1)" : "white", padding:"6px 15px", borderRadius :msg.isSent ? "10px" :"0px", borderBottomRightRadius: msg.isSent ? "1px" : "10px",  color: msg.isSent ? "white" : "grey" }}>
                    {msg.data}
                </Typography>
            </Box>
            {
                !msg.isSent
                    ?
                    <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                        <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg} />
                    </Box>
                    :
                    null
            }
        </Box>
    )
}
const ImgComponent = function ({ msg , setRepliedMsg}) {
    return (
        <Box sx={{ zIndex: 10, margin: "10px 10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: msg.isSent ? "flex-end" : "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {
                    msg.isSent
                        ?
                        <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                            <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg}  />
                        </Box>
                        :
                        null
                }
                <Box sx={{ backgroundColor: msg.isSent ? "rgba(104, 106,236, 1)" : "white", border: "0.01px solid lightgrey", borderRadius: "15px", borderBottomRightRadius: msg.isSent ? "1px" : "15px" }} >
                    <Box >
                        <img src={msg.file.url} alt="img" style={{ width: "200px", height: "150px", borderRadius: "15px", borderBottomRightRadius: msg.isSent ? "1px" : "15px", borderTopLeftRadius: msg.isSent ? "15px" : "1px", }} />
                    </Box>
                    {
                        msg.data
                            ?
                            <Typography sx={{ padding: "5px 15px", color: msg.isSent ? "white" : "grey" }}>
                                {msg.data}
                            </Typography>
                            :
                            null
                    }
                </Box>
                {
                    !msg.isSent
                        ?
                        <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                            <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg} />
                        </Box>
                        :
                        null
                }
            </Box>
        </Box>
    )
}
const DocComponent = function ({ msg, setRepliedMsg }) {
    return (
        <Box sx={{ margin: "10px 10px", backgroundColor: "#b9e2fa", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: msg.isSent ? "flex-end" : "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
                    {
                        msg.isSent
                            ?
                            <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                                <MessageDeleteAndUpdate msg={msg} setRepliedMsg={setRepliedMsg}  />
                            </Box>
                            :
                            null
                    }
                </Box>
                <Box sx={{ padding: "4px 6px", color: msg.isSent ? "grey" : "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: msg.isSent ? "rgba(104, 106,236, 1)" : "white", borderRadius: "15px", borderBottomRightRadius: msg.isSent ? "1px" : "15px" }}>
                    <Box sx={{ padding: "5px 5px", backgroundColor: msg.isSent ? "whitesmoke" : "#87c986", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <PictureAsPdfIcon />
                        <Typography>
                            {msg.file.name}
                        </Typography>
                        <DownloadIcon />
                    </Box>
                    <Box>
                        {
                            msg.data
                                ?
                                <Typography sx={{ padding: "5px 15px", color: msg.isSent ? "white" : "grey" }}>
                                    {msg.data}
                                </Typography>
                                :
                                null
                        }
                    </Box>
                </Box>
                <Box>
                    {
                        !msg.isSent
                            ?
                            <Box sx={{ opacity: 0, '&:hover': { opacity: 1 }, margin: "5px" }}>
                                <MessageDeleteAndUpdate msg={msg}  setRepliedMsg={setRepliedMsg} />
                            </Box>
                            :
                            null
                    }
                </Box>
            </Box>
        </Box>
    )
}
const ChatMsgComponent = function ({setRepliedMsg}) {
    const { conversations, current_messages } = useSelector((state) => state.conversations.direct_chat);
    console.log("current_messages in ChatMsgComponent -->" + JSON.stringify(current_messages))
    const { room_id } = useSelector((state) => state.conversations.direct_chat);
    const [socket, setSocket] = useState(undefined);
    const dispatch = useDispatch();
    useEffect(() => {
        setSocket(getSocket());
        console.log("conversations in chatMsgComponent --> " + JSON.stringify(conversations))
        console.log("roomId ->" + room_id)
        console.log(conversations[0]._id === room_id)
        console.log(conversations[0]._id.toString() === room_id.toString())

        const current = conversations.find((el) => el?._id === room_id);
        console.log("current -> " + JSON.stringify(current))
        if (socket) {
            socket.emit("get_messages", { conversation_id: current?._id }, (data) => {
                // data => list of messages
                console.log("List of messages in ChatMsgComponent -->" + JSON.stringify(data));
                dispatch(fetchCurrentMessages({ messages: data }));
            });

        }

        dispatch(setCurrentConversation(current));
    }, [socket, room_id])
    return (
        <Box>
            {
                current_messages.map((msg) => {
                    let msgType = 'text';
                    if (msg.type == 'image/jpg' || msg.type == 'image/png' || msg.type == 'image/jpeg') {
                        msgType = 'img'
                    } else if (msg.type == 'video/mp4' || msg.type == 'video/x-matroska') {
                        msgType = 'mp4'
                    } else if (msg.type == 'application/pdf') {
                        msgType = 'pdf'
                    }
                    if(msg.repliedMsgData && (msg.repliedMsgData.fileUrl || msg.repliedMsgData.data)){
                        msgType='reply'
                    }
                    switch (msgType) {
                        case 'img':
                            return (<ImgComponent key={msg._id} msg={msg} setRepliedMsg={setRepliedMsg} />)
                        case 'text':
                            return (<TxtComponent  key={msg._id}  msg={msg} setRepliedMsg={setRepliedMsg}/>)
                        case 'pdf':
                            return (<DocComponent  key={msg._id}  msg={msg} setRepliedMsg={setRepliedMsg}/>)
                        case 'mp4':
                            return (<h1  key={msg._id} >this is mp4</h1>)
                        case 'reply':
                            return (<RepliedComponent  key={msg._id}  msg={msg} setRepliedMsg={setRepliedMsg} />)
                        default:
                            return (<h1  key={msg._id} >NOTHING</h1>)
                    }
                })
            }
        </Box>
    )

}

export default ChatMsgComponent