const express=require('express');
const router=express.Router();
const commentController=require('../../../controllers/api/v1/comment_controller')
const passport=require('passport')


router.post('/create-comment',passport.authenticate('jwt', {session:false}),commentController.createComment)
router.post('/update-comment/:id',passport.authenticate('jwt', {session:false}),commentController.updateComment)
router.post('/delete-comment/:id',passport.authenticate('jwt', {session:false}),commentController.deleteComment)

module.exports=router