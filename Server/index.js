const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const User = require('./models/User');
const OneToOneMessages = require('./models/OneToOneMessage');
const Story = require('./models/Stories')
const db = require('./config/mongoose');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require("./config/passport-jwt-strategy")
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 8000;
const server = createServer(app);
const cron = require('node-cron');

dotenv.config();

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN_URL, // Frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.use('/', require('./routes'))

const getUserSocketId = async (userId) => {
    const user = await User.findById(userId);
    console.log("user of participant list ->" + JSON.stringify(user))
    const userSocketId = user.socket_id;
    console.log("socketId of user --> " + userSocketId + " type-->" + typeof user.socket_id)
    return userSocketId; // Returns the socket ID (string)
};

io.on('connection', async (socket) => {
    const user_id = socket.handshake.query["user_id"];
    const socket_id = socket.id
    console.log('a user connected' + socket.id);
    if (Boolean(user_id)) {
        await User.findByIdAndUpdate(user_id, { socket_id })
    }
    cron.schedule('*/10 * * * * *', async () => {
        try {
            const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // 60 seconds ago
        const fiftySecondsAgo = new Date(now.getTime() - 50 * 1000); // 50 seconds ago

        // Find stories that were created between 50 and 60 seconds ago
        const storiesToExpire = await Story.find({ createdAt: { $gte: oneMinuteAgo, $lt: fiftySecondsAgo } });
        storiesToExpire.forEach(async (story) => {
            // Emit 'storyExpiring' event to notify all clients
            const deletedStrory=await Story.deleteOne({_id: story._id});
            const user=await User.findById(story.userId);
            user.stories =user.stories.filter((stryId)=>stryId.toString()!=story._id.toString());
            user.save();
            const deletedMediaResult = await cloudinary.uploader.destroy(story.img.id);
            console.log('expiring story '+JSON.stringify(story));
            console.log('emiting storyExpiring event with storyId '+story._id)
            socket.emit('storyExpiring', story._id);
        });
        } catch (error) {
            console.log('Erro in cron job : '+error)
        }
    });
    socket.on('deleteStory', async (story)=>{
        try {
            console.log('delete story event triggered' +JSON.stringify(story))
            const deletedStrory=await Story.deleteOne({_id: story._id});
            const user=await User.findById(story.userId);
            user.stories =user.stories.filter((stryId)=>stryId.toString()!=story._id.toString());
            user.save();
            const deletedMediaResult = await cloudinary.uploader.destroy(story.img.id);
            console.log("deletedMediaResult -->" + JSON.stringify(deletedMediaResult));
            socket.emit('deleteStory', story._id);
        } catch (error) {
            console.log('Error while deleting Stroy : '+JSON.stringify(error))
        }
    })
    socket.on('fetchStories', async (callback) => {
        try {
            const stories = await Story.find().populate('userId');
            callback({ stories: stories });
        } catch (error) {
            console.log("error while fetching stories : " + error);
        }

    })
    socket.on('createStory', async (storyObject, callback) => {
        try {
            console.log("get data for creating Stroy : " + storyObject);
            const newStory = await Story.create(storyObject);
            const populatedStory = await newStory.populate('userId');

            const user = await User.findById(storyObject.userId);
            user.stories.push(newStory._id);
            user.save();
            callback({
                message: "story created !",
                story: populatedStory
            })
        } catch (error) {
            console.log("Error while creating story : " + error);
        }
    })
    socket.on('addStoryLike', async (obj, callback) => {
        try {
            console.log('addLike to story event triggered ' + JSON.stringify(obj))
            const story =await Story.findById(obj.storyId);
            story.likes.push(obj.userId);
            story.save();
            callback({ message: "story liked" });
        } catch (error) {
            console.log("error while addStoryLike stories : " + error);
        }
    })
    socket.on('removeStoryLike', async (obj, callback) => {
        try {
            console.log('remove like to story event triggered ' + JSON.stringify(obj))
            const story =await Story.findById(obj.storyId);
            story.likes=story.likes.filter((user)=>user.toString()!=obj.userId.toString());
            story.save();
            callback({ message: "story disliked" });
        } catch (error) {
            console.log("error while removeStoryLike stories : " + error);
        }
    })
    socket.on('request_sent', async (data) => {
        console.log("Received request_sent event on server", data);
        const toUser = await User.findOne({ _id: data.to });
        console.log("user on request Sent -> " + user_id);
        console.log("socket_id of user at request sent -> " + socket_id)

        // Emit the event back to the same user who sent the request
        socket.emit('request_sent', data);

        // Emit the event back to all clients
        if (toUser && toUser.socket_id) {
            socket.to(toUser.socket_id).emit('new_friend_request', {
                message: "New Friend Request Recieved !"
            });
        }
        console.log("Emitted new_friend_request event to clients");
    });

    socket.on('previous_conversations', async ({ user_id }, callback) => {
        const existing_conversation = await OneToOneMessages.find({
            participants: { $all: [user_id] }
        })
        const populated_exiting_conversation = await OneToOneMessages.populate(existing_conversation, { path: 'participants', select: '_id name username email status' });

        console.log("existing_conversation in previous conversaton --> " + populated_exiting_conversation);
        callback(populated_exiting_conversation)
    })

    socket.on('start_conversation', async (data) => {
        const { to, from } = data;
        const otherUser = await User.findById(to);
        const existing_conversations = await OneToOneMessages.find({
            participants: { $size: 2, $all: [to, from] },
        }).populate("participants", "name _id email status");

        console.log("Existing Conversation in start_conversation -> " + existing_conversations[0]);

        if (existing_conversations.length == 0) {
            let new_chat = await OneToOneMessages.create({
                participants: [to, from],
            });

            new_chat = await OneToOneMessages.findById(new_chat).populate(
                "participants",
                "name _id email status"
            );

            console.log("new_chat in start conversation --> " + new_chat);
            socket.emit("start_chat", new_chat);
            socket.to(otherUser.socket_id).emit("start_chat_by_other_user", new_chat);
        } else {
            socket.emit("start_chat", existing_conversations[0])
            socket.to(otherUser.socket_id).emit("start_chat_by_other_user", existing_conversations[0]);
        }
    })

    socket.on("get_messages", async (data, callback) => {
        try {
            const { messages } = await OneToOneMessages.findById(
                data.conversation_id
            ).select("messages");
            callback(messages);
        } catch (error) {
            console.log("error while finding in socket event get_messages : " + error);
        }
    });
    socket.on("fetch_current_participants", async (data, callback) => {
        try {
            const participants = await OneToOneMessages.findById(data.conversation_id).select('participants').populate(
                "participants",
                "name _id email status"
            );
            callback(participants.participants);
        } catch (error) {
            console.log("error while finding in socket event fetch_current_participants : " + error);
        }
    });

    socket.on('text_message', async (messageData) => {
        const { to, from, type, data, file, conversation_id, repliedMsgData } = messageData;
        const conversation = await OneToOneMessages.findById(conversation_id);
        console.log('messageSent backend -->'+JSON.stringify(messageData));
        let to_user;
        if (conversation.isGroup == false)
            to_user = await User.findById(to);

        const from_user = await User.findById(from);
        console.log('from user get -->'+JSON.stringify(from_user))
        const new_message = {
            to: conversation.isGroup ? undefined : to,
            from: from,
            type: type,
            created_at: Date.now(),
            data: data,
            file: file,
            sentBy: from_user.name,
            repliedMsgData: repliedMsgData
        };
        console.log("messageData get --> " + JSON.stringify(messageData));
        conversation.messages.push(new_message);

        await conversation.save();
        // emit incoming_message -> to user
        const newMessageWithId = conversation.messages[conversation.messages.length - 1];

        if (conversation.isGroup) {
            console.log("yes this is group message !")
            conversation.participants.forEach(async (userId) => {
                const socketId = await getUserSocketId(userId);
                console.log("socketId of participants in group -->" + JSON.stringify(socketId))
                if (socketId && socketId != socket_id) {
                    io.to(socketId.toString()).emit('new_message', { conversation_id, message: newMessageWithId, }); // Join the group room
                }
            });
        } else {
            console.log("emitting new_message to user --> "+JSON.stringify(newMessageWithId))
            io.to(to_user?.socket_id).emit("new_message", {
                conversation_id,
                message: newMessageWithId,
            });
        }


        // emit outgoing_message -> from user
        console.log("emitting new_message from user --> "+JSON.stringify(newMessageWithId))
        io.to(from_user?.socket_id).emit("new_message", {
            conversation_id,
            message: newMessageWithId,
        });
    })
    socket.on('delete_message', async (messageData) => {
        try {
            console.log("messageData in delete_message -->" + JSON.stringify(messageData));
            const conversation = await OneToOneMessages.findById(messageData.conversationId);
            let to_user;
            if (conversation.isGroup == false)
                to_user = await User.findById(messageData.to);

            const from_user = await User.findById(messageData.from);
            conversation.messages = conversation.messages.filter((msg) => msg._id.toString() != messageData.msgId.toString());
            await conversation.save();

            if (messageData.file.url) {
                console.log("messageData.file.public_id -->" + messageData.file.public_id + " " + typeof messageData.file.public_id)
                const deletedMediaResult = await cloudinary.uploader.destroy(messageData.file.public_id, { resource_type: 'raw' });
                console.log("deletedMediaResult -->" + JSON.stringify(deletedMediaResult));
            }


            if (conversation.isGroup) {
                console.log("yes this is group message for deletion !")
                conversation.participants.forEach(async (userId) => {
                    const socketId = await getUserSocketId(userId);
                    console.log("socketId of participants in group while delete msg -->" + JSON.stringify(socketId))
                    if (socketId && socketId != socket_id) {
                        io.to(socketId.toString()).emit("message_deleted", {
                            conversation_id: messageData.conversationId,
                            msgId: messageData.msgId
                        });
                    }
                });
            } else {
                io.to(to_user?.socket_id).emit("message_deleted", {
                    conversation_id: messageData.conversationId,
                    msgId: messageData.msgId
                });
            }
            // emit outgoing_message -> from user
            io.to(from_user?.socket_id).emit("message_deleted", {
                conversation_id: messageData.conversationId,
                msgId: messageData.msgId
            });
        } catch (error) {
            console.log("Error while deleting msg ->" + JSON.stringify(error))
        }
    })

    // Make a new Group with the data come from frontEnd
    socket.on('new_group', async (groupData) => {
        console.log("groupData --> " + JSON.stringify(groupData));
        const { groupName, otherUsersId, groupAbout } = groupData;
        const participants = [...otherUsersId, user_id];
        // Create new group in the database
        const newGroup = await OneToOneMessages.create({
            groupName,
            participants,
            isGroup: true,
            groupAdmin: user_id,
            groupAbout
        });

        await newGroup.save();
        socket.emit("group_created", { newGroup })
        // Notify all participants about the new group and make them join the group room
        participants.forEach(userId => {
            const socketId = getUserSocketId(userId);
            if (socketId) {
                io.to(socketId).emit('new_group', { groupName, groupId: newGroup._id });
            }
        });
    })

});

server.listen(port, (err) => {
    if (err) {
        console.log(`error which listening server : ${err}`)
    } else {
        console.log(`server is listening at port : ${port}`)
    }
});
