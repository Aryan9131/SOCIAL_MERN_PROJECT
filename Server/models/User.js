const mongoose = require('mongoose');

// Define a subdocument schema for friends
const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    archive:{
        type:Boolean,
        default:false
    }
});

// Define the main user schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    mobile: Number,
    about:String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    friends: [friendSchema],  // Use the subdocument schema here
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story'
        }
    ],
    
    avatar: {
        type:Object
    },
    status: Boolean,
    socket_id: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
