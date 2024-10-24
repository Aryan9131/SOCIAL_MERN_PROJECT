const User = require('../../../models/User');
const Post = require('../../../models/Post');
const Event = require('../../../models/Event')
const FriendRequest = require('../../../models/FriendRequest')
const OneToOneMessages =require('../../../models/OneToOneMessage')
const jwt = require('jsonwebtoken');

module.exports.createUser = async function (req, res) {
    console.log(req.body);
    const newUser = new User(req.body);
    newUser.save();
    return res.status(200).json({
        message: "User created successfully !",
        user: newUser
    })
}

module.exports.createSession = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || req.body.password != user.password) {
            return res.status(422).json({
                message: "Invalid username/password"
            })
        }
        return res.status(200).json({
            message: "SignIn successful !",
            data: {
                token: jwt.sign(user.toJSON(), "Social", { expiresIn: "1d" })
            }
        })
    } catch (error) {
        console.log("Error while signing in :" + error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


module.exports.allPosts = async function (req, res) {
    try {
        const userPosts = await Post.find({ user: req.params.id }).populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        });
        const allPosts = await Post.find({ user: { $ne: req.params.id } }).populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        });

        return res.status(200).json({
            userPosts: userPosts,
            allPosts: allPosts
        })
    } catch (error) {
        console.log("error while find post of user :" + error);
        return res.status(522).json({
            error: error
        })
    }
}

module.exports.getAllFriendRequests=async function(req, res){
    try {
        const requests=await FriendRequest.find({recipient : req.user._id}).populate('sender').populate('recipient');
        return res.status(200).json({
            message:"found All friend requests",
            data : requests,
            status:"success"
        })
    } catch (error) {
        console.log("Error while finding friend Requests : " + error);
        return res.status(522).json({
            message:"Error while finding friend Requests",
            error : error,
            status:"error"
        })
    }    
}

module.exports.getAllFriends=async function(req, res){
    try {
        const user_id=req.user._id
        const user=await User.findOne({_id:user_id}).populate('friends.userId');
        return res.status(200).json({
            message:"found All friends",
            data : user.friends,
            status:"success"
        })
    } catch (error) {
        console.log("Error while finding friends : " + error);
        return res.status(522).json({
            message:"Error while finding friends",
            error : error,
            status:"error"
        })
    }    
}
module.exports.getAllGroups=async function(req, res){
    try {
        const user_id=req.user._id
        const oneToOneMessage= await OneToOneMessages.find({
            participants: { $all: [user_id] },
            isGroup: true
        }).populate(
            "participants",
            "name _id email status"
        );
        return res.status(200).json({
            message:"found All Groups",
            data : oneToOneMessage,
            status:"success"
        })
    } catch (error) {
        console.log("Error while finding Groups : " + error);
        return res.status(522).json({
            message:"Error while finding Groups",
            error : error,
            status:"error"
        })
    }    
}

module.exports.getAllUSers=async function(req, res){
    try {
        console.log('********* get all users except : '+req.params)
        const users = await User.find({ _id: { $ne: req.params.id } });
        return res.status(200).json({
            message:"found All Users ",
            data : users,
            status:"success"
        })
    } catch (error) {
        console.log("Error while finding All Users : " + error);
        return res.status(522).json({
            message:"Error while finding All Users",
            error : error,
            status:"error"
        })
    }    
}

module.exports.addFriend=async function(req, res){
      try {
        const user_id=req.user._id;
        const user=await User.findOne({_id:user_id});
        user.friends.push({
          userId:req.body.userId,
          status:"pending"
        })
        const newFriendRequest=new FriendRequest({
            sender:user_id,
            recipient:req.body.userId
        })
        await user.save();
        await newFriendRequest.save();
        const requestedFriend=await User.findOne({_id:req.body.userId});
        return res.status(200).json({
            message:"User added as a friend ! ",
            data : {
                userId:requestedFriend,
                status:"pending"
            },
            status:"success"
        })
      } catch (error) {
        console.log("Error while User as frind : " + error);
        return res.status(522).json({
            message:"Error while finding user as Friend",
            error : error,
            status:"error"
        })
      }
     
}

module.exports.acceptFriend=async function(req, res){
     try {
          const friendRequestId=req.body._id;
          const acceptedFriendRequest=await FriendRequest.findByIdAndDelete({_id:friendRequestId});
          const receivedUser=await User.findOne({_id:req.user._id});
          receivedUser.friends.push({
             userId:acceptedFriendRequest.sender,
             status:"accepted"
          })
          await receivedUser.save();

          const senderUser=await User.findOne({_id:acceptedFriendRequest.sender});
          senderUser.friends.map((obj, key)=>{
              if(obj.userId.toString() === req.user._id.toString()){
                  console.log("inside updation !");
                  obj.status='accepted'
              }
              return obj
          })
          senderUser.save();
          return res.status(200).json({
            message:"friend Request accepted ! ",
            data:{
                    userId:senderUser,
                    status :'accepted'
                 },
            status:"success"
        })

     } catch (error) {
        console.log("Error while Accepting as friend Request : " + error);
        return res.status(522).json({
            message:"Error while  Accepting as friend Request ",
            error : error,
            status:"error"
        })
     }
}

module.exports.getProfile =async function(req, res){
    try {
        console.log("getProfile get params -> "+req.params.id);
        const thisUser=await User.findById(req.params.id).populate({
            path : 'friends',
            match: { status: 'accepted' },
            populate:{
                path:'userId',
                Model :"User",
                select :"name _id avatar"
            }
        });
        const userPosts = await Post.find({user:req.params.id}).populate('user','name _id avatar').populate({
            path:"comments",
            populate:{
                path:"user",
                Model:"User",
                select :"name _id avatar"
            }
        })
        const userEvents = await Event.find({user:req.params.id}).populate('user','name _id avatar').populate('interestedUsers','name _id avatar')
        const userFriends =thisUser.friends;
        return res.status(200).json({
            message:"profile get successfully  ! ",
            posts:userPosts,
            events:userEvents,
            user:{
                _id:thisUser._id,
                name:thisUser.name,
                avatar:thisUser.avatar,
            },
            friends:userFriends,
            status:"ok"
        })

    } catch (error) {
        console.log("Error while  finding user Profile : " + error);
        return res.status(522).json({
            message:"Error while  finding user Profile ! ",
            error : error,
            status:"error"
        })
    }
}

module.exports.updateProfile =async function(req, res){
    try {
        console.log(" data for update profile --> "+JSON.stringify(req.body));
        const updatedUser=await User.findByIdAndUpdate(req.user._id,req.body, { new: true });
        return res.status(200).json({
            user:updatedUser,
            message:"Profile updated successfully !",
            status:"success"
        })
    } catch (error) {
        console.log("Error while  Updating user Profile : " + error);
        return res.status(522).json({
            message:"Error while  Updating user Profile ! ",
            error : error,
            status:"error"
        })
    }
}

