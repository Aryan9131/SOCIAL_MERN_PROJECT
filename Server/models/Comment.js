const mongoose=require('mongoose');
const commentSchema= new mongoose.Schema({
    data:{
        type:String
    },
    post:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Post"
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    }
})

const Comment=mongoose.model('Comment', commentSchema);

module.exports=Comment;