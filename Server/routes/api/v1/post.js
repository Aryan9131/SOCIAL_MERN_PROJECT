const express=require('express');
const passport=require('passport')
const router=express.Router();
const postController=require('../../../controllers/api/v1/post_controller');

router.post('/get-post/:id',passport.authenticate('jwt', {session:false}),postController.getPost)
router.post('/create-post',passport.authenticate('jwt', {session:false}), postController.createPost);
router.delete('/delete-post/:id',passport.authenticate('jwt', {session:false}), postController.deletePost);
router.post('/update-post/:id',passport.authenticate('jwt', {session:false}),postController.updatePost)
router.get('/add-post-like/:id',passport.authenticate('jwt', {session:false}),postController.addLikeToPost)
router.get('/remove-post-like/:id',passport.authenticate('jwt', {session:false}),postController.removeLikeFromPost)

module.exports=router
