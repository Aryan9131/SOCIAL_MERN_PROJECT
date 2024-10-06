const mongoose=require('mongoose');
const postSchema= new mongoose.Schema({
    postType:{
        type:String
    },
    img:{
        type:Object
    },
    data:{
        type:String
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    comments:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:"Comment"
        }
    ],
    likes:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:"User"
        }
    ]
},{
    timestamps:true
})

const Post=mongoose.model('Post', postSchema);

module.exports=Post;