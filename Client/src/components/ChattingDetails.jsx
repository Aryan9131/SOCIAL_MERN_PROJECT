import { Box } from "@mui/material"
import Drawer from '@mui/material/Drawer';
import { Divider } from "@mui/material";
import Grid from '@mui/material/Grid';
import { Avatar } from "@mui/material";
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ChatMsgComponent from "./ChatMsgComponent";
import TextField from '@mui/material/TextField';
import MoodIcon from '@mui/icons-material/Mood';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { styled } from '@mui/system';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import getSocket from "../utils/socketManager";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { Typography } from "@mui/material"
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchCurrentParticipants, updateDirectConversation } from '../features/conversationSlice'
const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none', // Remove the border for the default state
        },
        '&:hover fieldset': {
            border: 'none', // Remove the border on hover
        },
        '&.Mui-focused fieldset': {
            border: 'none', // Remove the border when focused (on click)
        },
    },
    '& .MuiInputBase-input': {
        height: "100%",
    },
});
const ShowRepliedMsg = function ({ repliedMsg }) {
    console.log("setted msg is --> " + JSON.stringify(repliedMsg));
    let msgType = 'text';
    if (repliedMsg.type == 'image/jpg' || repliedMsg.type == 'image/png' || repliedMsg.type == 'image/jpeg') {
        msgType = 'img'
    } else if (repliedMsg.type == 'video/mp4' || repliedMsg.type == 'video/x-matroska') {
        msgType = 'mp4'
    } else if (repliedMsg.type == 'application/pdf') {
        msgType = 'pdf'
    }
    switch (msgType) {
        case 'text':
            return (
                <Typography sx={{ color: "grey", paddingLeft: "10px" }}>
                    {repliedMsg.data}
                </Typography>
            );
        case 'img':
            return (
                <Box sx={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", alignItems: "center" }}>
                    <img src={repliedMsg.file.url} alt="repliedMsgImage" width="40px" height="40px" />
                    {
                        repliedMsg.data
                            ?
                            <Typography sx={{ color: "grey", marginLeft: "10px" }}>
                                {repliedMsg.data}
                            </Typography>
                            :
                            null
                    }
                </Box>
            );
        case 'mp4':

            return (
                <Box sx={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", alignItems: "center" }}>
                    <video src={repliedMsg.file.url} width="40px" height="40px"></video>
                    {
                        repliedMsg.data
                            ?
                            <Typography sx={{ color: "grey", marginLeft: "10px" }}>
                                {repliedMsg.data}
                            </Typography>
                            :
                            null
                    }
                </Box>
            );
        case 'pdf':
            console.log(repliedMsg.file.name)
            return (
                <Box sx={{ display: "flex", justifyContent: "flex-start", paddingLeft: "10px", alignItems: "center" }}>
                    <Typography sx={{ color: "grey", marginLeft: "10px" }}>
                        {repliedMsg.file.name}
                    </Typography>
                    {
                        repliedMsg.data
                            ?
                            <Typography sx={{ color: "grey", marginLeft: "10px" }}>
                                {repliedMsg.data}
                            </Typography>
                            :
                            null
                    }
                </Box>
            );
    }
}
const ChattingDetails = function () {
    const [repliedMsg, setRepliedMsg] = useState(undefined);
    const [showPicker, setShowPicker] = useState(false);
    const [socket, setSocket] = useState(undefined);
    let user = useSelector((state) => state.user).user;
    let user_id = user._id;
    const { room_id } = useSelector((state) => state.conversations.direct_chat)
    const [value, setValue] = useState("");
    const inputRef = useRef(null);
    const imgRef = useRef(null);
    const [mediaFileValue, setMediaValue] = useState(undefined);
    const [mediaUrl, setMediaUrl] = useState(undefined);
    const messageListRef = useRef(null);
    let cloudinaryData = undefined;
    const { current_messages } = useSelector(
        (state) => state.conversations.direct_chat
    );
    const { current_conversation } = useSelector((state) => state.conversations.direct_chat)
    const toggleShowPicker = () => {
        setShowPicker((prev) => !prev)
    }
    const handleMessageSend = async () => {
        console.log("mediaFileValue -->" + JSON.stringify(mediaFileValue))
        console.log(' replied msg inside handleMessageSend --> ' + JSON.stringify(repliedMsg))
        setValue("")
        if (mediaFileValue) {
            const fileData = new FormData();
            fileData.append('file', mediaFileValue);
            fileData.append('upload_preset', 'Social-App');
            fileData.append('cloud_name', "anayak")
            try {
                const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/anayak/raw/upload', {
                    method: 'POST',
                    body: fileData
                });
                if (!cloudinaryResponse.ok) {
                    throw new Error('Failed to upload image');
                }
                cloudinaryData = await cloudinaryResponse.json();
                console.log("cloudinaryData in handleMsgSend --> " + JSON.stringify(cloudinaryData))
                socket.emit("text_message", {
                    data: value,
                    file: {
                        url: cloudinaryData ? cloudinaryData.url : null,
                        public_id: cloudinaryData ? cloudinaryData.public_id : null,
                        name: cloudinaryData ? mediaFileValue.name : ""
                    },
                    conversation_id: room_id,
                    from: user_id,
                    to: current_conversation.user_id,
                    type: mediaFileValue ? mediaFileValue.type : "text"
                });
            } catch (error) {
                console.log("error while Uploading Msg data in HandleMsgSend : " + error);
            }
        } else {
            console.log('sending replied msg --> ' + JSON.stringify(repliedMsg))
            socket.emit("text_message", {
                data: value,
                file: {
                    url: cloudinaryData ? cloudinaryData.url : null,
                    public_id: cloudinaryData ? cloudinaryData.public_id : null
                },
                conversation_id: room_id,
                from: user_id,
                to: current_conversation.user_id,
                type: mediaFileValue ? mediaFileValue.type : "text",
                repliedMsgData: {
                    fileUrl: repliedMsg ? repliedMsg.file.url : null,
                    data: repliedMsg ? repliedMsg.data : null
                }
            });
        }

        setMediaValue(undefined);
        setRepliedMsg(undefined)
        imgRef.current.value = null;
    }
    const handleEmojiClick = (emoji) => {
        console.log("emoji --> " + emoji)
        setValue((prev) => prev + emoji);
        console.log(value)
    }
    const [state, setState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState(open);
    };
    const [tabValue, setTabValue] = useState('Images');
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const ProfileInfo = () => {
        const { current_participants } = useSelector((state) => state.conversations.direct_chat)
        console.log("current_participants --> " + JSON.stringify(current_participants));
        return (
            <Box
                sx={{ width: 350, height: "100vh", overflow: "hidden" }}
                role="presentation"
                onKeyDown={toggleDrawer(false)}
            >
                <Box sx={{ lineHeight: "30px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "15px" }}>
                    <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" variant="rounded" sx={{ borderRadius: "15px", height: "80px", width: "90px" }} />
                    <h4>{current_conversation?.name}</h4>
                    <Divider sx={{ width: "100%" }} />
                    <Box sx={{ padding: "10px", width: "100%", display: "flex", justifyContent: "flex-start" }}>
                        <Typography sx={{ paddingLeft: "10px" }}>Participants : </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", width: "100%" }}>
                        {
                            current_participants
                                ?
                                current_participants.map((participant) => {
                                    return (
                                        <Box key={participant._id} sx={{ margin: "5px 10px", display: "flex", justifyContent: "center", backgroundColor: "whitesmoke" }}>
                                            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" variant="rounded" sx={{ borderRadius: "15px", height: "30px", width: "30px" }} />
                                            <Typography sx={{ margin: "2px 5px" }}>{participant.name}</Typography>
                                        </Box>
                                    )
                                })
                                :
                                null
                        }
                    </Box>
                    <Divider sx={{ width: "100%" }} />
                </Box>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <TabContext value={tabValue} sx={{ backgroundColor: 'purple', width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Images" value="Images" />
                                <Tab label="Docs" value="Docs" />
                                <Tab label="Links" value="Links" />
                            </TabList>
                        </Box>
                        <TabPanel value="Images" sx={{ height: "70vh", overflowY: "scroll", boxSizing: "border-box", width: "100%", padding: "0" }}>
                            <List sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                {
                                    current_messages.map((msg) => {
                                        return (
                                            msg.type === 'image/jpg' || msg.type == 'image/png' || msg.type == 'image/jpeg'
                                                ?
                                                <ListItem key={msg._id} disablePadding sx={{ width: "150px", margin: '5px' }}>
                                                    <Card sx={{ backgroundColor: "yellow", maxWidth: 150, minWidth: 150, height: 150, borderRadius: 2 }} >
                                                        <CardActionArea>
                                                            <CardMedia
                                                                component="img"
                                                                image={msg.file.url}
                                                                alt="green iguana"
                                                                sx={{ backgroundColor: "blue", height: 150 }}
                                                            />
                                                        </CardActionArea>
                                                    </Card>
                                                </ListItem>
                                                :
                                                null
                                        )
                                    })
                                }
                            </List>

                        </TabPanel>
                        <TabPanel value="Docs" sx={{ width: "100%", padding: "0" }}>
                            <List sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                {
                                    current_messages.map((msg) => {
                                        return (
                                            msg.type === 'application/pdf'
                                                ?
                                                <ListItem key={msg._id} disablePadding sx={{ width: "90%", margin: '5px' }}>
                                                    <Box sx={{ width: "100%", padding: "15px 5px", backgroundColor: msg.isSent ? "lightblue" : "#87c986", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                        <PictureAsPdfIcon />
                                                        <Typography>
                                                            {msg.file.name}
                                                        </Typography>
                                                        <DownloadIcon />
                                                    </Box>
                                                </ListItem>
                                                :
                                                null
                                        )
                                    })
                                }
                            </List>
                        </TabPanel>
                        <TabPanel value="Links" sx={{ width: "100%", padding: "0" }}>
                            Links
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        )
    };


    const dispatch = useDispatch()
    useEffect(() => {
        setSocket(getSocket());
        // Scroll to the bottom of the message list when new messages are added
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        if (socket) {
            socket.emit('fetch_current_participants', { conversation_id: room_id }, (data) => {
                console.log("participants in fetch_current_participants --> " + JSON.stringify(data))
                dispatch(fetchCurrentParticipants({ participantList: data }))
            })
        }
        return () => {
            // This cleanup function runs just before the component unmounts
            setRepliedMsg(undefined)
        };
    }, [socket, current_messages])
    return (
        <Grid container id="chattingDetailsId" sx={{ position: "relative", height: "100vh", display: "flex", backgroundColor: "#b9e2fa" }} >
            <Grid item xs={12} sx={{ height: "10%", backgroundColor: "white", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", position: "sticky", top: "0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{width:'100%', display: "flex", justifyContent: "space-between", alignItems: "center" }}  >
                    <Box onClick={toggleDrawer(true)} sx={{ width: "75%", display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "10px" }}>
                        <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" variant="rounded" sx={{ borderRadius: "15px", height: "40px", width: "50px" }} />
                        <Box sx={{ marginLeft: {xs:'20px', md:"30px"} }}>
                            <p>{current_conversation?.name}</p>
                        </Box>
                    </Box>
                    <Box sx={{ width: "25%", display: "flex", justifyContent: "flex-end" ,alignItems:"center"}}>
                        <CallOutlinedIcon className="chatNavIcon" sx={{ marginRight: "10px", color: "rgba(50, 50, 50, 1)", height: "22px" }} />
                        <VideocamOutlinedIcon className="chatNavIcon" sx={{ marginRight: {xs:'0px', md:"10px"}, color: "rgba(50, 50, 50, 1)", height: "23px" }} />
                        <SearchIcon className="chatNavIcon" sx={{ marginRight: {xs:'0px', md:"10px"}, color: "rgba(50, 50, 50, 1)", height: "23px" }} />
                    </Box>
                </Box>

            </Grid>
            <Grid item xs={12} sx={{
                overflowY: "auto",
                height: "70%",
                backgroundColor: "#b9e2fa",
                paddingTop: "15px",
                marginBottom: "10px",
                '&::-webkit-scrollbar': {
                    width: '2px', // Decrease scrollbar width
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888', // Customize scrollbar thumb color
                    borderRadius: '4px', // Make scrollbar thumb rounded
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555', // Darker color on hover
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1', // Track color
                },

            }} ref={messageListRef} onClick={() => setShowPicker(false)}>
                <ChatMsgComponent setRepliedMsg={setRepliedMsg} />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", position: "sticky", bottom: "0", height: "auto", backgroundColor: "white", boxSizing: "border-box" }}>
                <Paper elevation={3} sx={{ zIndex: 10, backgroundColor: "whitesmoke", display: repliedMsg ? "flex" : 'none', flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", bottom: "90%", height: "40px", width: "100%" }}>
                    {
                        repliedMsg
                            ?
                            <ShowRepliedMsg repliedMsg={repliedMsg} />
                            :
                            null
                    }
                    <IconButton aria-label="cancel icon" onClick={() => setRepliedMsg(undefined)} sx={{ color: "grey" }}>
                        <CancelIcon />
                    </IconButton>
                </Paper>
                <Paper elevation={3} sx={{ zIndex: 10, backgroundColor: "whitesmoke", display: mediaFileValue ? "flex" : "none", flexDirection: "column", position: "absolute", bottom: "100%", height: "250px", width: "250px" }}>
                    <Box sx={{ width: "100%", height: "10%", display: "flex", justifyContent: "flex-end" }}>
                        <IconButton
                          aria-label="delete"
                        onClick={
                            () => {
                                setMediaValue(undefined)
                                imgRef.current.value = null;
                            }
                        }>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: "90%" }}>
                        {
                            mediaFileValue && (mediaFileValue.type == 'image/jpg' || mediaFileValue.type == 'image/jpeg' || mediaFileValue.type == 'image/png')
                                ?
                                <img src={mediaFileValue ? mediaUrl : ""} width="100%" height="100%" alt="preview"  style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} />
                                :
                                <Box sx={{display:"flex",flexDirection:"column", alignItems :"center"}}>
                                   <h2>No Preview Available</h2>
                                   <Divider sx={{ width: "100%" }} />
                                   <br />
                                   <sub>{mediaFileValue?.name}</sub>
                                </Box>
                        }
                    </Box>
                </Paper>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                    <IconButton aria-label="open media" onClick={() => imgRef.current.click()}>
                        <input type="file" name="img" id="file-upload" ref={imgRef} hidden onChange={(event) => {
                            const file = event.target.files[0];
                            console.log("set file is --> ", file);
                            setMediaValue(file);
                            if (file && (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png')) {
                                const imageUrl = URL.createObjectURL(file);
                                setMediaUrl(imageUrl); // store the image preview URL in state
                            }
                        }} />
                        <AttachFileIcon  />
                    </IconButton>
                    {showPicker && (
                        <Box sx={{ position: "absolute", bottom: "100%", left: "1%" }}>
                            <Picker
                                data={data}
                                onEmojiSelect={(emoji) => {
                                    handleEmojiClick(emoji.native);
                                }}
                            />
                        </Box>
                    )}
                    <IconButton aria-label="toggle picker"  onClick={toggleShowPicker}>
                        <MoodIcon />
                    </IconButton>
                    <StyledTextField
                        inputRef={inputRef}
                        value={value}
                        onChange={(event) => {
                            setValue(event.target.value);
                            console.log("new Input value -> " + value);
                        }}
                        onClick={() => setShowPicker(false)}
                        id="outlined-multiline-flexible"
                        placeholder="write a message"
                        multiline
                        maxRows={4}
                        sx={{ width: "100%", height: "auto", boxSizing: "border-box", backgroundColor: "white" }}
                    />
                    <IconButton aria-label="send icon" onClick={handleMessageSend}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Grid>

            <Drawer
                anchor="right"
                open={state}
                onClose={toggleDrawer(false)}
            >
                {ProfileInfo()}
            </Drawer>
        </Grid>
    )
}

export default ChattingDetails