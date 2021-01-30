import { Meteor } from "meteor/meteor";
import Rooms from "../models/Rooms";
import { check } from "meteor/check";


Meteor.publish("Rooms.get", function(){
    
    const query = { owner: {uid : Meteor.userId()} }; 
	return Rooms.find(query);

});

Meteor.publish("Room.getActive", function(){
    
    const query = { owner: {uid : Meteor.userId()}, status:true }; 
    return Rooms.find(query);

});

Meteor.methods({
    'Room.add'(title){
        check(title,String);


        Rooms.update({

            owner:{uid:Meteor.userId()},
            status: true
        },
        {
            $set: {
                status : false,
            }
        })

        Rooms.insert({title:title, status:true, owner: {title:"LearnTurn",uid: Meteor.userId()}});
    },

    'Room.activeChange'(RoomId){
        check(RoomId,String);

        Rooms.update({
            owner:{uid:Meteor.userId()},
            status: true
        },{
            $set: {
                status : false,
            }
        })
        
        Rooms.update({
            _id : RoomId
        },
        {
            $set: {
                status : true,
            }
        })
    },
    'Student.add'(email){
		check(email, String);

        let roomActive = Rooms.find({status: true , owner : {uid : Meteor.userId()}});
        if(roomActive.length != 0){
            let roomId = ""
            roomActive.map((el) => roomId = el._id);

            Rooms.update({
                _id : roomId,
            },
            {
                $push : {
                    attendees : email,
                }
            })
        }

		
	},
})
