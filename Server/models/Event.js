const mongoose=require('mongoose');
const eventSchema=new mongoose.Schema({
    postType:{
        type:String
    },
    heading:{
        type:String
    },
    data:{
        type:String
    },
    img:{
        type:Object
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    interestedUsers:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:"User"
        }
    ],
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    }
},{
    timestamps:true
})

const Event=mongoose.model('Event', eventSchema);

module.exports=Event