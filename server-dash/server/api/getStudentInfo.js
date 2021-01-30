import { Meteor } from "meteor/meteor";
import Sessions from "../models/Rooms";
import Rooms from "../models/Rooms";
import RTStatus from "../models/RTStatus"
import { check } from "meteor/check";

Meteor.publish("AttentionDetails.get", function(sessionId){
    
    return RTStatus.find({sessionId : sessionId});

});

// Meteor.publish("HomeAttentionDetails.get", function(){
    
//     let sessionUp = Sessions.find({status: true, roomId:{rid: RoomId}}).fetch;
//     if(sessionUp.length == 0){
//         console.log('No session Active');
//         return {};
//     }
//     else {
//         return RTStatus.find({sessionId : sessionId});
//     }
    
// });


