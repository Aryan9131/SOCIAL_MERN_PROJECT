import io from 'socket.io-client';
import  store  from '../app/store';  // Make sure to export your store from the appropriate file
import { addNotification } from '../features/socketSlice';
import {selectConversation} from '../features/conversationSlice' 
import {deleteDirectMessage, addDirectMessage, addDirectConversation, updateDirectConversation } from '../features/conversationSlice';
import { setClickedConversationId, deleteStory } from "../features/conversationSlice";

let socket;
export const connectSocket = (user_id) => {
    if (!socket) {
         socket = io(import.meta.env.VITE_BACKEND_URL, {
            query: { user_id: user_id }
        });
        socket.on('connect', () => {
            console.log("Socket connected with ID:", socket.id);
        });
        console.log("socket on socketManager ---->"+(socket))
        console.log("Socket connected globally!");
        
        socket.on('storyExpiring',(data)=>{
            console.log('story is expiring : '+data)
            store.dispatch(deleteStory({storyId : data}));
        })
        socket.on('deleteStory',(data)=>{
            console.log('story is deleting : '+data)
            store.dispatch(deleteStory({storyId : data}));
        })
        // Listen for events and dispatch actions to Redux
        socket.on('request_sent', (data) => {
            console.log("request_sent Event triggered !")
            store.dispatch(addNotification(data));
            // alert("New Request sent: " + data.message);
        });

        socket.on('new_friend_request', (data) => {
            console.log("new_friend_request Event triggered ! -->"+data.message)
            store.dispatch(addNotification(data));
            // alert("New Request Received: " + data.message);
        });

        socket.on('request_accepted', (data) => {
            store.dispatch(addNotification(data));
            // alert("Request accepted: " + data.message);
        });
        socket.on('group_created',(data)=>{
            console.log("group created data in socketManager --> "+data);
            store.dispatch(addNotification({message : 'New Group Created !'}));
        })
        socket.on('group_message',(data)=>{
            console.log("group message data in socketManager --> "+data)
        })
        socket.on('start_chat', (data) => {
            console.log("start chat event data --> " + JSON.stringify(data));
            const state = store.getState();
            const conversations = state.conversations.direct_chat.conversations;

            const existing_conversation = conversations.find(
                (el) => el?._id === data._id
            );
            if (existing_conversation) {
                // Update direct conversation
                console.log("updateDirectConversation called ")
                store.dispatch(updateDirectConversation({ conversation: data }));
            } else {
                // Add direct conversation
                console.log("addDirectConversation called ")
                store.dispatch(addDirectConversation({ conversation: data }));
            }
            store.dispatch(setClickedConversationId({conversationId :data._id}))
            store.dispatch(selectConversation({ room_id: data._id }));
        });
        socket.on('start_chat_by_other_user', (data) => {
            console.log("start chat event data --> " + JSON.stringify(data));
            const state = store.getState();
            const conversations = state.conversations.direct_chat.conversations;

            const existing_conversation = conversations.find(
                (el) => el?._id === data._id
            );
            if (existing_conversation) {
                // Update direct conversation
                console.log("updateDirectConversation called ")
                store.dispatch(updateDirectConversation({ conversation: data }));
            } else {
                // Add direct conversation
                console.log("addDirectConversation called ")
                store.dispatch(addDirectConversation({ conversation: data }));
            }
        });
        
        socket.on("new_message", (data) => {
            const state = store.getState();
            const {conversations, current_conversation} = state.conversations.direct_chat;

            const message = data.message;
            console.log("new_message --> "+JSON.stringify(message));
            // check if msg we got is from currently selected conversation
            if (current_conversation?._id === data.conversation_id) {
              store.dispatch(addNotification({message : "new Message "}));
              store.dispatch(
                addDirectMessage(
                  {
                    message :{
                            _id: message._id,
                            userName : message.userName,
                            type: message.type,
                            data: message.data,
                            file: message.file,
                            isSent: message.from === user_id,
                            userName:message.sentBy,
                            repliedMsgData : message.repliedMsgData,
                            created_at : message.created_at
                        }
                  })
              );
            }
          });

        socket.on('message_deleted',(data)=>{
            console.log("message_delete triggered")
            const state = store.getState();
            store.dispatch(deleteDirectMessage(data))
        })
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected globally!");
    }
};
const getSocket = () => {
    return socket;
};
setTimeout(()=>{
    console.log("socket on socketManager -->"+ getSocket())
}, 2000)

export default getSocket