const mongoose=require('mongoose');
const freindRequestSchema= new mongoose.Schema({
    sender:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    recipient:{
         type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const FriendRequest=mongoose.model('FriendRequest', freindRequestSchema);

module.exports=FriendRequest;