import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { selectConversation, setClickedConversationId, toggleShowChattingDetails } from "../features/conversationSlice";
import { useState } from "react";
const ExistingConversations = ({ type }) => {
    let user = useSelector((state) => state.user).user;
    let user_id = user._id;
    const {clickedConversationId} = useSelector((state)=>state.conversations.direct_chat)
    const { conversations } = useSelector((state) => state.conversations.direct_chat);
    let dispatch = useDispatch()
    console.log("conversations->" + JSON.stringify(conversations))
    const handleConversationClicked = (conversation_id) => {
        dispatch(toggleShowChattingDetails(true));
        dispatch(selectConversation({ room_id: conversation_id }))
        dispatch(setClickedConversationId({conversationId :conversation_id}));
    }
    console.log("conversation get in existing conversation --> "+JSON.stringify(conversations))
    return (
        <Box sx={{ height: { xs: "100vh", md: "80vh" }, overflowY: 'auto' }} id="messagesContainer">
            {
                conversations
                &&
                conversations.map((conversation) => {
                    return (
                        type == 'single' && conversation.isGroup == false
                            ?
                            <Box key={conversation._id} sx={{ borderRadius: "8px", margin: "5px 2px", padding: "14px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: clickedConversationId == conversation._id ? "lightgrey" : "whitesmoke" }} onClick={() => handleConversationClicked(conversation._id)}>
                                <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" sx={{ height: "40px", width: "40px" }} />
                                <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                                    <Box sx={{ marginLeft: "30px", display: "flex", justifyContent: "space-between" }}>
                                        <p> {conversation.name}</p>
                                        <sub style={{ color: "grey", paddingRight:"10px",paddingLeft:"2px" }}>{conversation.time}</sub>
                                    </Box>
                                    <Box sx={{ marginLeft: "30px", marginRight: "10px",color:'grey' }}>
                                        <p>{conversation.msg}</p>
                                    </Box>
                                </Box>
                            </Box>
                            :
                            type == 'groups' && conversation.isGroup == true
                                ?
                                <Box sx={{ borderRadius: "8px", margin: "5px 2px", padding: "14px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: clickedConversationId == conversation._id ? "lightgrey" : "whitesmoke" }} onClick={() => handleConversationClicked(conversation._id)}>
                                    <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" sx={{ height: "40px", width: "40px" }} />
                                    <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
                                        <Box sx={{ marginLeft: "30px", display: "flex", justifyContent: "space-between" }}>
                                            <p> {conversation.name}</p>
                                            <sub style={{ color: "grey", paddingRight:"10px", paddingLeft:"2px" }}>{conversation.time}</sub>
                                        </Box>
                                        <Box sx={{ marginLeft: "30px", marginRight: "10px", color:'grey' }}>
                                            <p>{conversation.msg}</p>
                                        </Box>
                                    </Box>
                                </Box>
                               :
                            null
                    )
                })
            }

        </Box>
    )
}

export default ExistingConversations