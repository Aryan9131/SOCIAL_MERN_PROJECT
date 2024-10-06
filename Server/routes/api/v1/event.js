const express=require('express');
const passport=require('passport')
const router=express.Router();

const eventController=require('../../../controllers/api/v1/event_controller')



router.get('/all-events',eventController.allEvents)
router.get('/user-events/:id',eventController.userEvents)
router.delete('/delete-event/:id',passport.authenticate('jwt', {session:false}),eventController.deleteEvent)

//   update-event/${post._id}
router.post('/update-event/:id',passport.authenticate('jwt', {session:false}),eventController.updateEvent)
router.post('/add-event-user', eventController.addUserToEvent);
router.post('/delete-event-user',eventController.deleteUserToEvent)
module.exports=router