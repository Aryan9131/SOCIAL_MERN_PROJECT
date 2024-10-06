import { createSlice } from '@reduxjs/toolkit';
const user = JSON.parse(window.localStorage.getItem("user"));
const user_id = user ? user._id : null;

const initialState = {
  direct_chat: {
    current_messages: [],
    current_conversation: null,
    conversations: [],
    clickedConversationId: null,
    room_id: null,
    current_participants: [],
    stories:[],
    showChattingDetails :false
  },
}

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    toggleShowChattingDetails:(state, action)=>{
      console.log("toggling showChattingDetails from -->"+state.direct_chat.showChattingDetails)
      state.direct_chat.showChattingDetails = action.payload
      console.log("toggling showChattingDetails to -->"+action.payload)
    },
    fetchStories:(state, action)=>{
      console.log('fetching all Stories : '+JSON.stringify(action.payload))
      state.direct_chat.stories = action.payload.stories.map((story) => {
        return (
          {
            ...story,
            isLiked: story.likes.includes(user._id.toString()),
          }
        )
      });
    },
    addStory:(state, action)=>{
      console.log('adding a new Story : '+JSON.stringify(action.payload))
      state.direct_chat.stories.push(action.payload.story);
    },
    deleteStory :(state, action)=>{
        console.log('deliting a Story : '+JSON.stringify(action.payload))   
        state.direct_chat.stories = state.direct_chat.stories.filter((story)=>story._id.toString()!= action.payload.storyId.toString())
    },
    toggleStoryLike :(state, action)=>{
      console.log('toggleStoryLike triggered '+JSON.stringify(action.payload));
      state.direct_chat.stories=state.direct_chat.stories.map((story)=>{
         if(story._id.toString()== action.payload.storyId.toString()){
            story.isLiked=!story.isLiked;
            return story;
         }else{
            return story;
         }
      })
    },
    fetchDirectConversations: (state, action) => {
      console.log("conversations get in fetchDirectConversations --> " + JSON.stringify(action.payload.conversations))
      const list = action.payload.conversations.map((oneToOneMessage) => {
        let otherUser = oneToOneMessage.participants.find(
          (participant) => participant._id.toString() != user_id.toString()
        )
        const lastMsg=oneToOneMessage.messages.length>0 ? oneToOneMessage.messages[oneToOneMessage.messages.length-1] : undefined;
        const lastTime = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false // Use true for 12-hour format, false for 24-hour format
                                  })
                                 : undefined;
        return {
          _id: oneToOneMessage._id,
          user_id: otherUser?._id,
          name: oneToOneMessage.isGroup ? oneToOneMessage.groupName : `${otherUser.name}`,
          online: otherUser?.status === "Online",
          avatar: `https://mui.com/static/images/avatar/2.jpg`,
          msg: lastMsg ? lastMsg.data : "",
          time: lastTime,
          unread: 0,
          pinned: false,
          isGroup: oneToOneMessage.isGroup ? oneToOneMessage.isGroup : false
        };
      })

      state.direct_chat.conversations = list
    },
    updateDirectConversation: (state, action) => {
      const this_conversation = action.payload.conversation;
      const lastMsg=this_conversation.messages.length>0 ? this_conversation.messages[this_conversation.messages.length-1] : undefined;
      const lastTime = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false // Use true for 12-hour format, false for 24-hour format
                                })
                               : undefined;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?._id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              _id: this_conversation._id,
              user_id: user?._id,
              name: `${user.name}`,
              online: user?.status === true,
              avatar: "https://mui.com/static/images/avatar/2.jpg",
              msg: lastMsg ? lastMsg.data : undefined,
              time: lastTime,
              unread: 0,
              pinned: false,
              isGroup: this_conversation.isGroup
            };
          }
        }
      );
    },
    addDirectConversation: (state, action) => {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?._id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        _id: this_conversation._id,
        user_id: user?._id,
        name: `${user.name}`,
        online: user?.status === true,
        avatar: "https://mui.com/static/images/avatar/2.jpg",
        msg: undefined,
        time: undefined,
        unread: 0,
        pinned: false,
        isGroup: this_conversation.isGroup
      });
    },
    setCurrentConversation: (state, action) => {
      console.log("################ setCurrentConversation called ################")
      state.direct_chat.current_conversation = action.payload;
    },
    fetchCurrentMessages: (state, action) => {
      const messages = action.payload.messages;

      const formatted_messages = messages.map((el) => ({
        _id: el._id,
        userName: el.sentBy,
        type: el.type,
        data: el.data,
        file: el.file,
        repliedMsgData: el.repliedMsgData,
        isSent: el.from.toString() === user_id.toString(),
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage: (state, action) => {
      console.log("action.payload in addDirectMSG --> " + JSON.stringify(action.payload.message));
      state.direct_chat.current_messages.push(action.payload.message);
      const lastMsg=action.payload.message;
        const lastTime = lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false // Use true for 12-hour format, false for 24-hour format
                                  })
                                 : undefined;
      const updatedConversation={
        ...state.direct_chat.current_conversation,
         msg: lastMsg.data ? lastMsg.data : lastMsg.file.url,
         time : lastTime
      }
       // Update the direct_chat.conversations with the updated conversation
      state.direct_chat.conversations = state.direct_chat.conversations.map(conversation => {
        if (conversation._id === updatedConversation._id) {
          return updatedConversation;
        }
        return conversation;
      });
    },
    deleteDirectMessage: (state, action) => {
      console.log("action.payload in deleteDirectMessage --> " + JSON.stringify(action.payload));
      const { msgId, conversationId } = action.payload
      state.direct_chat.current_messages = state.direct_chat.current_messages.filter((msg) => {
        console.log("messageId->" + msg._id + (msg._id.toString() == msgId.toString()))
        return (
          msg._id.toString() != msgId.toString()
        )
      })
    },
    setClickedConversationId: (state, action) => {
      state.direct_chat.clickedConversationId = action.payload.conversationId
    },
    selectConversation: (state, action) => {
      console.log("*********** selectConversation called ****************")
      console.log("with room_id -->" + action.payload.room_id)
      state.direct_chat.room_id = action.payload.room_id;
    },
    fetchCurrentParticipants: (state, action) => {
      console.log("*********** selectConversation called ****************")
      console.log("with room_id -->" + action.payload.room_id)
      state.direct_chat.current_participants = action.payload.participantList;
    }

  }
})

export const { 
               toggleShowChattingDetails,
               fetchStories,
               addStory,
               toggleStoryLike,
               deleteStory,
               fetchDirectConversations,
               updateDirectConversation,
               addDirectConversation, 
               setCurrentConversation,
               fetchCurrentMessages, 
               addDirectMessage, 
               deleteDirectMessage,
               setClickedConversationId, 
               selectConversation, 
               fetchCurrentParticipants } = conversationSlice.actions;
export default conversationSlice.reducer;