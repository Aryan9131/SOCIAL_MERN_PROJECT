const Post=require('../../../models/Post')
const Event=require('../../../models/Event')
const User=require('../../../models/User')
const Comment=require('../../../models/Comment')
const cloudinary=require('cloudinary').v2

module.exports.getPost= async function(req, res){
      try {
          console.log('request to fetch a post --> '+req.params);
          console.log('request to fetch a post --> '+req.body.postType);
           if(req.body.postType=='Post'){
            const fetchedPost=await Post.findById(req.params.id).populate('user').populate({
              path: 'comments',
              populate: {
                  path: 'user',
                  model: 'User'
                }
             });
             return res.status(200).json({
                message:"Post fetched !",
                data:fetchedPost
             })
           }else{
             const fetchedEvent=await Event.findById(req.params.id).populate('user','_id, name postType').populate('interestedUsers','_id name');
             return res.status(200).json({
                message:"Event fetched !",
                data:fetchedEvent
             })
           }
      } catch (error) {
        console.log('Error while getting single Post : '+error)
        return res.status(404).json({
            message:"Could not get single Post !",
            error:error
        })
      }

}
module.exports.createPost=async function(req, res){
    try {
      const user=await User.findById(req.body.user)
         if(req.body.postType=='Post'){
            const newPost=new Post(req.body);
            await newPost.save();
            user.posts.push(newPost._id);
             await user.save();
             const createdPost=await Post.findById(newPost._id).populate('user').populate({
              path: 'comments',
              populate: {
                  path: 'user',
                  model: 'User'
              }
          });
          console.log("createdPost -->"+createdPost)
            return res.status(200).json({
                message:"Post Created !",
                post:createdPost
            })
         }else{
            const newEvent=new Event(req.body);
            await newEvent.save();
            user.events.push(newEvent._id);
            await user.save();
            const createdEvent=await Event.findById(newEvent._id).populate('user').populate('interestedUsers');
            return res.status(200).json({
                message:"Event Created !",
                post:createdEvent
            })
         }
    } catch (error) {
      console.log('Error while creating Post : '+error)
        return res.status(404).json({
            message:"Could not Created Post !",
            error:error
        })
    }
}
 
exports.updatePost=async function(req, res){
     try {
      let prePost=await Post.findOne({_id:req.params.id});
      if(prePost && prePost.img){
        const deletedImgresult = await cloudinary.uploader.destroy(prePost.img.id);
      }
      prePost.postType=req.body.postType;
      prePost.img=req.body.img;
      prePost.data=req.body.data;
      await prePost.save();
      return res.status(200).json({
         message:"post Updated",
         updatedPost:prePost
      })
     } catch (error) {
       console.log("Error while updatng post : "+error)
        return res.status(500).json({
          message :"Not able to Update Post",
          error :error
        })
     }
}

exports.deletePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const user=await User.findById(req.user._id);
      console.log(`Attempting to delete post with ID: ${postId} and ${req.body.imgId} with typeof ${typeof req.body.imgId}`);
      
      if(req.body.imgId){
        const deletedImgresult = await cloudinary.uploader.destroy(req.body.imgId);
      }
      const result = await Post.findByIdAndDelete({_id: postId});
      if (!result) {
        console.log('Post not found');
        return res.status(404).json({ status: 404, message: 'Post not found' });
      }
      user.posts=user.posts.filter((post)=>post.toString()!=result._id.toString());
      await user.save();
  
      res.status(200).json({ status: 200, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error.message); // Log only the error message
      res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
  };
  
exports.addLikeToPost=async (req, res)=>{
    try {
       console.log("request to like the post "+req.params);
       const post=await Post.findById(req.params.id);
       post.likes.push(req.user._id);
       await post.save();
       return res.status(200).json({
         message:"post liked"
       })
    } catch (error) {
      console.log("error to like the post "+error);
      return res.status(200).json({
        message:"Error to like the Post !",
        error:error
      })
    }
}

exports.removeLikeFromPost=async (req, res)=>{
  try {
     console.log("request to dislike the post "+req.params);
     const post=await Post.findById(req.params.id);
     post.likes=post.likes.filter((userId)=>userId.toString()!=req.user._id.toString());
     await post.save();
     return res.status(200).json({
       message:"like removed"
     })
  } catch (error) {
    console.log("error while removing like the post "+error);
    return res.status(200).json({
      message:"Error while removing like the Post !",
      error:error
    })
  }
}