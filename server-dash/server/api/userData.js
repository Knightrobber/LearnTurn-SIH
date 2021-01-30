import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { number } from "prop-types";

import Sessions from "../models/Sessions";
import Rooms from "../models/Rooms";
import RTStatus from "../models/RTStatus";
import DataPacket from "../models/DataPacket"


Meteor.publish("User.login", function(){
    
    return Meteor.users.find({_id : Meteor.userId() });

});

Meteor.publish("dataPackets.get", function(){
    
    let sessionActive = Sessions.find({status:true, userId : Meteor.userId()}).fetch();
    let sessionId = sessionActive[0]._id;
    return DataPacket.find({sessionId : sessionId});

});


Meteor.methods({
	
	'dataPacket.get'(params){

        const {looking,tabStatus,audioLevel,mouthOpen,drowsy,timeTaken} = params;

        check(looking, Boolean);
        check(tabStatus, Boolean);
        check(audioLevel, Number);
        check(timeTaken, Number);
        check(drowsy, Boolean);
        check(mouthOpen, Boolean);

        let userId = Meteor.userId();
        let user = Meteor.users.find({_id : userId}).fetch();
        let email = user[0].emails[0].address;

            
        let roomActive = Rooms.find({status : true, attendees: email }).fetch();

        if(roomActive.length != 0){
            let roomId = roomActive[0]._id;

            let sessionActive = Sessions.find({status:true, roomId: roomId }).fetch();

            if(sessionActive.length != 0 ){
                let sessionId = sessionActive[0]._id;

                let checkEntry = RTStatus.find({userId : userId,sessionId: sessionId}).fetch();

                
                let drowsyCount = 0;
                let mouthOpenCount = 0;
                let lookingCount = 0; 

                let drowsyScore = 30;
                let mouthOpenScore = 30;
                let lookingScore  = 40;
                let attentionScore = drowsyScore + mouthOpenScore + lookingScore;
                let attentionQuotient = 0;

                const RT = RTStatus.find({userId: userId, sessionId:sessionId}).fetch();
                if(RT.length != 0){
                    if(drowsy == true){
                        drowsyCount = RTStatus[0].drowsyCount + 1;
                    }
                    if(looking == false){
                        lookingCount = RTStatus[0].lookingCount + 1;
                    }
                    if(mouthOpen == true){
                        mouthOpenCount = RTStatus[0].mouthOpenCount + 1;
                    }

                if(tabStatus == false || timeTaken >= 2000){
                    attentionScore = 0;
                    
                } else {
                    console.log(tabStatus,timeTaken);
                    if(mouthOpenCount >5 && mouthOpenCount <=10){
                        mouthOpenScore = 20;
                    } else if(mouthOpenScore >10){
                        mouthOpenScore = 10;
                    } else if(mouthOpenScore <= 5) {
                        mouthOpenScore = 30;
                    }

                    if(drowsyCount >8 && drowsyCount <=15){
                        drowsyScore = 20;
                    } else if(drowsyCount <= 8){
                        drowsyScore = 30;
                    } else if(drowsyCount > 15 ){ 
                        drowsyScore = 10;
                    }

                    if(lookingCount >5 && lookingCount <10){
                        lookingScore = 30;
                    } else if(lookingCount <= 5){
                        lookingScore = 40;
                    } else if(lookingCount >= 10 && lookingCount <=20 ){ 
                        lookingScore = 20;
                    } else if(lookingCount > 20 ){ 
                        lookingScore = 10;
                    }

                    
                    attentionScore = drowsyScore + mouthOpenScore + lookingScore;
                }

                

                let DB = DataPacket.find({userId : userId, sessionId : sessionId}).fetch();

                 attentionQuotient = ((RT[0].attentionQuotient * DB.length ) + attentionScore) / (DB.length + 1);
                                    
                }
                
                DataPacket.insert({
                    userId : userId,
                    sessionId : sessionId,
                    email : email,
                    onsceen : looking,
                    tabstatus : tabStatus,
                    decibelLevel : audioLevel,
                    mouthOpen : mouthOpen,
                    drowsy : drowsy,
                    timeTaken : timeTaken,
                    serial : new Date(),
                    attentionScore : attentionScore
                });


                if(checkEntry.length == 0 ){

                    console.log({
                        userId : userId,
                        email : email,
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : attentionQuotient,
                        drowsy : drowsy,
                        timeTaken : timeTaken,
                        mouthOpen : mouthOpen
                    });

                    RTStatus.insert ({
                        userId : userId,
                        email : email,
                        sessionId: sessionId, 
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : attentionQuotient,
                        drowsy : drowsy,
                        timeTaken : timeTaken,
                        mouthOpen : mouthOpen,
                        joinedAt : new Date(),
                    })

                } else {

                    console.log({

                        userId : userId,
                        username : "moksh",
                        sessionId: sessionId, 
                        onsceen : looking,
                        tabstatus : tabStatus,
                        decibelLevel : audioLevel,
                        attentionQuotient : attentionQuotient,
                        drowsy : drowsy,
                        timeTaken : timeTaken,
                        mouthOpen : mouthOpen
                    });

                    if(timeTaken != 0) {
                        RTStatus.update ({
                            userId : userId,
                            sessionId : sessionId
                        },
                        {
                            $set : {
                                onsceen : looking,
                                tabstatus : tabStatus,
                                decibelLevel : audioLevel,
                                attentionQuotient : attentionQuotient,
                                drowsy : drowsy,
                                timeTaken : timeTaken,
                                mouthOpen : mouthOpen,
                                drowsyCount : drowsyCount,
                                mouthOpenCount : mouthOpenCount,
                                lookingCount : lookingCount,
                            }
                           
                        })
                    } else {
                        RTStatus.update ({
                            userId : userId,
                            sessionId : sessionId
                        },
                        {
                            $set : {
                                onsceen : looking,
                                tabstatus : tabStatus,
                                decibelLevel : audioLevel,
                                attentionQuotient : attentionQuotient,
                                drowsy : drowsy,
                                mouthOpen : mouthOpen,
                                drowsyCount : drowsyCount,
                                mouthOpenCount : mouthOpenCount,
                                lookingCount : lookingCount,
                            }
                           
                        })
                    }
                  
                }
            }
        }
	},
})