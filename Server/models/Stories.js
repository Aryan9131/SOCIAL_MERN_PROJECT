const mongoose = require('mongoose');

// Define the story schema
const storySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // reference to the user who posted the story
    required: true 
  },
  data: { 
    type: String, 
    required: true // content could be an image URL, video URL, or text
  },
  img:{
    type: Object, 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, // set the current date and time when the story is created
    expires: '24h' // MongoDB TTL index, story will be deleted after 24 hours
  },
  likes:[
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
  ]
});

// Create the Story model
const Story = mongoose.model('Story', storySchema);

module.exports = Story;
