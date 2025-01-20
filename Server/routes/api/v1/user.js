const express=require('express');
const passport=require('passport')
const router=express.Router();
const UserController=require('../../../controllers/api/v1/user_controller')

router.post('/create-user',UserController.createUser)
router.post('/create-session',UserController.createSession)
router.get('/:id/posts', UserController.allPosts);
router.get('/get-friends',passport.authenticate('jwt', {session:false}), UserController.getAllFriends)
router.get('/get-groups',passport.authenticate('jwt', {session:false}), UserController.getAllGroups)
router.get('/profile/:id',UserController.getProfile)
router.get('/get-friend-request',passport.authenticate('jwt', {session:false}), UserController.getAllFriendRequests)
router.get('/get-users/:id',UserController.getAllUSers)
router.post('/add-friend',passport.authenticate('jwt', {session:false}), UserController.addFriend)
router.post('/accept-friend-request',passport.authenticate('jwt', {session:false}), UserController.acceptFriend);
router.post('/update-profile',passport.authenticate('jwt', {session:false}),UserController.updateProfile)
router.post('/:id/logout',UserController.logOut);
module.exports=router