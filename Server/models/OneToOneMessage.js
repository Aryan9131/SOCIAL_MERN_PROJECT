const mongoose=require('mongoose');

const oneToOneSchema= new mongoose.Schema({
   participants:[
    {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
   ],
   messages:[
       {
            to:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:'User'
            },
            from:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:'User'
            },
            type:{
                type:String,
                enum:['text', 'image/jpg', 'image/png' , 'image/jpeg' , 'application/pdf', 'video/x-matroska', 'video/mp4']
            },
            created_at:{
                type:Date,
                default:Date.now()
            },
            data:{
                type:String
            },
            repliedMsgData:{
                type:Object,
                default:undefined
            },
            file:{
                type:Object
            },
            sentBy:{
                type:"string"
            }
       }
   ],
  isGroup: { type: Boolean, default: false }, // Identify group chats
  groupName: { type: String, default: "" }, // For group chats
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ,// Admin of the group
  groupAbout :{type :String, default: ""}
})

const OneToOneMessages=mongoose.model('OneToOneMessages',oneToOneSchema);

module.exports=OneToOneMessages