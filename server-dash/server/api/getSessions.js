import { Meteor } from "meteor/meteor";
import Sessions from "../models/Sessions";
import Rooms from "../models/Rooms";
import { check } from "meteor/check";
import { NULL } from "node-sass";

Meteor.publish("Sessions.get", function(){
    
     let RoomActive = Rooms.find({status: true, owner : {uid : Meteor.userId()}}).fetch();
     if(RoomActive.length == 0)
         console.log("No room is active");
     else {
        let test = "";
        RoomActive.map(el => {
            test = el._id;
        })
        return  Sessions.find({userId : Meteor.userId(),status: true});
       
    }

});

Meteor.methods({
    'Session.add'(){
        let sessionsActive = Sessions.find({userId : Meteor.userId(),status:true}).fetch();
        if(sessionsActive.length > 0){
            console.log('Session already active for this user');
        } else {

            let roomUp =  Rooms.find({status: true, owner : {uid : Meteor.userId()}}).fetch();
            if (roomUp.length == 0)
                console.log("No room is active");
            else {

                let RoomId = "";
                let RoomTitle = ""
                roomUp.map((el) => {
                    RoomId = el._id;
                    RoomTitle = el.title;
                });

                let sessionId = Sessions.insert({
                    userId: Meteor.userId(),
                    roomId : RoomId,
                    roomTitle : RoomTitle,
                    status: true,
                    startTime :Date.now(),
                    endTime : Date.now(),
                });

                Rooms.update(
                    {
                        _id : RoomId,
                    },
                    {
                        $push: {
                            sessions : sessionId,
                        }
                    },
                )
            }
        }          
    },

    'Session.end'(){

        let sessionsActive = Sessions.find({userId : Meteor.userId(),status:true}).fetch();
        if(sessionsActive.length == 0){
            console.log('No session active');
        } else {
            let roomUp =  Rooms.find({status: true, owner : {uid : Meteor.userId()}}).fetch();
            if (roomUp.length == 0)
                console.log("No room is active");
            else {

                let RoomId = "";
                roomUp.map((el) => {
                    RoomId = el._id;
                });

                Sessions.update(
                    {
                        userId : Meteor.userId(),
                        status:true,
                        roomId : RoomId
                    },
                    {
                        $set : {
                            status : false,
                            endTime : Date.now()
                        }
                    }
                )
            }    

        }

    },
})