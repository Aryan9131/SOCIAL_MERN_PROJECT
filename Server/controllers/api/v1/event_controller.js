const Post=require('../../../models/Post')
const Event=require('../../../models/Event')
const User=require('../../../models/User')
const Comment=require('../../../models/Comment')
const cloudinary=require('cloudinary').v2

module.exports.deleteEvent=async function(req, res){
    try {
        const deletedEvent= await Event.findByIdAndDelete(req.params.id);
        const participantsId= deletedEvent.interestedUsers;
        participantsId.forEach(async (userId) => {
            const user=await User.findById(userId);
            user.events=user.events.filter((eventId)=>eventId.toString()!=req.params.id.toString())
            user.save();
        });
        return res.status(200).json({
            message:'Event Deleted !',
            deletedEvent:deletedEvent
        })
    } catch (error) {
        console.log("Error while Deleting Event : "+error)
        return res.status(200).json({
            message:'Error while deleting Event :',
            error:error
        })
    }

}

module.exports.allEvents=async function(req, res){
    try {
        const allEvents=await Event.find().populate('user').populate('interestedUsers')
        return res.status(200).json({
            message:'all Events !',
            allEvents:allEvents
        })
    } catch (error) {
        console.log("Error while fethcing Events All Events : "+error)
        return res.status(200).json({
            message:'Error while feching Events :',
            error:error
        })
    }
}
module.exports.userEvents=async function(req, res){
    try {
        console.log("user id get in fetch UserEvents -->"+JSON.stringify(req.params))
        const user=await User.findById(req.params.id).populate('events')
        return res.status(200).json({
            message:'all Events !',
            userEvents:user.events
        })
    } catch (error) {
        console.log("Error while fethcing Events of User : "+error)
        return res.status(200).json({
            message:'Error while feching Events of User :',
            error:error
        })
    }
}

module.exports.updateEvent=async function(req, res){
    try {
        console.log("params data in update Event : "+req.params.id);
        console.log("body data in update Event : "+req.body);
        let preEvent=await Event.findOne({_id:req.params.id});
        if(preEvent && preEvent.img){
           const deletedImgresult = await cloudinary.uploader.destroy(preEvent.img.id);
        }
        preEvent.img=req.body.img;
        preEvent.data=req.body.data;
        preEvent.heading=req.body.heading;
        preEvent.date=req.body.date;
        preEvent.time=req.body.time;
        await preEvent.save();
        return res.status(200).json({
            message:"Event Updated",
            updatedPost:preEvent,
            status:"ok"
        })
    } catch (error) {
      console.log("Error while updatng post : "+error)
       return res.status(500).json({
         message :"Not able to Update Post",
         error :error
       })
    }
}
module.exports.addUserToEvent = async function (req, res) {
    try {
        console.log('inside addUserToEvent add comment'+req.body)
        const user = await User.findOne({ _id: req.body.userId });
        user.events.push(req.body.eventId);
        await user.save();

        const event =await Event.findById(req.body.eventId);
        event.interestedUsers.push(user._id.toString());
        await event.save();
        return res.status(200).json({
            message: "user Added to Event's interest List"
        })
    } catch (error) {
        console.log("Error while Adding user to Event's interest List: " + error)
        return res.status(500).json({
            message: "user Can't Added to Event's interest List",
            error: error
        })
    }
}
module.exports.deleteUserToEvent = async function (req, res) {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.events= user.events.filter((eventID)=>eventID.toString()!=req.body.eventId.toString());
        await user.save();
        const event =await Event.findById(req.body.eventId);
        event.interestedUsers= event.interestedUsers.filter((userID)=>userID.toString()!=req.body.userId.toString());
        await event.save();
        return res.status(200).json({
            message: "user deleted from Events interest List"
        })
    } catch (error) {
        console.log("user Can't deleted from Events interest List : " + error)
        return res.status(500).json({
            message: "user Can't deleted from Events interest List",
            error: error
        })
    }
}