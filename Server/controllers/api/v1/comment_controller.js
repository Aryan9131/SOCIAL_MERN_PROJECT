const Comment=require('../../../models/Comment');
const Post=require('../../../models/Post')
exports.createComment=async function(req, res){
     try {
        const newComment= new Comment(req.body);
        await newComment.save();
    
        const post=await Post.findOne({_id:req.body.post});
        post.comments.push(newComment._id);
        await post.save();
        const populatedUserIncomment=await newComment.populate('user');
        return res.status(200).json({
            message:"Comment Posted !",
            comment:populatedUserIncomment
        })
     } catch (error) {
        console.log("Error while Creating comment : "+error);
        return res.status(500).json({
            error:error,
        })
     }
}

exports.updateComment=async function(req, res){
  try {
    console.log('update comment data --> '+req.body.data);
    console.log('update comment params --> '+req.params);
    const comment=await Comment.findById(req.params.id);
    comment.data=req.body.data;
    await comment.save();
    return res.status(200).json({
        message:"comment updated",
        updatedComment :comment,
        status:'ok'
    })
  } catch (error) {
    console.log("Error while updating comment : "+error);
    return res.status(500).json({
        error:error,
    })
  }
}
exports.deleteComment=async function(req, res){
    try {
      console.log('delete comment data of post --> '+req.body);
      console.log('delete comment params --> '+req.params);
      const post=await Post.findOne({_id :req.body.postId});
      const comment=await Comment.deleteOne({_id: req.params.id});
      post.comments=post.comments.filter((comment)=>comment.toString()!=req.params.id.toString());
      await post.save();
      return res.status(200).json({
          message:"comment deleted",
          status:'ok'
      })
    } catch (error) {
      console.log("Error while deleting comment : "+error);
      return res.status(500).json({
          error:error,
      })
    }
  }