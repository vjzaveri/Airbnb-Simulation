var mongo = require("./mongo");
var mongoURL = "mongodb://apps92:shim123@ds155727.mlab.com:55727/airbnbproto";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./Models/user');
var moment = require('moment');

function authenticate(msg,callback){

	console.log("authenticate method invoked in RabbitMQ");

	console.log(msg);

	Users.findOne({ email: msg.email}, function (err, result) {
  if (err) { 
  	callback(err,null);

  	 }
  if (result) {
     console.log(result);
     callback(null,result);
   
 		 }
 if(!result){
 	console.log("no user");
 	callback(null,"no user");
 }         
 
  
	});
}

function signUp(msg,callback){

  console.log("User Registration in RabbitMQ");
  console.log(msg);
  Users.find({"email":msg.user.email},function(err,user){
    console.log("found");
    console.log(user);
    if(user.length > 0){
      callback(null,{"status":400,"result":"user already present"});
         }

    newUser = Users(msg.user);
    newUser.save(function(err,result){
        if(!err){
          console.log(result);
          callback(null,{"status":200,"result":"User Created"});
          
        }
        else{
          console.log("inside error");
          console.log(err);
          callback(err,null);
        }  
      });
});

};

function updateProfile(msg,callback){

  Users.findOneAndUpdate(msg.query, msg.user, {upsert:false}, function(err, doc){
    
    if (err) {
      console.log(err);
    callback(err,{"status":400,"result":"Bad request"});
   }
    else {
    console.log(doc);
    callback(null,{"status":200,"result":"User Updated"});       
    };
 });  
}

function getUserProfile(msg,callback){

  Users.findOne({"email":msg.email},function(err,user){
    if(err || user == null){
      callback(null,{"status":400,"result":"user not found"});
      }
      else{

        var UserObject =       
          {
            "firstname": user.firstname,
              "lastname": user.lastname,
              "email": user.email,
              "user_id": user.user_id,
              "type": user.type,
              "UserType": user.UserType,
              "phone" :user.phone,
              "address": user.address,
              "carddetails":user.carddetails,
              "profilepic":user.profilepic
          };

          callback(null,{"status":200,"user":UserObject});
       } 
  });
}

function getHostProfile(msg,callback){

console.log("getting host profile");
Users.findOne({"email":msg.email},function(err,user){
    if(err || user == null){
      callback(null,{"status":400,"result":"user not found"});
      }

    else
    {

      var momentObj = moment(user.birthdate, 'MM-DD-YYYY');
      var hostBirthDay = momentObj.format('YYYY-MM-DD');
      //1990-07-17
      var birthYear = hostBirthDay.substring(0,4);
      var birthMonth = hostBirthDay.substring(6,7);
      var birthDay = hostBirthDay.substring(8,10);
      console.log(hostBirthDay);
      var UserObject = 
      {
    	  "firstname": user.firstname,
          "lastname": user.lastname,
          "email": user.email,
          "user_id": user.user_id,
          "type": user.type,
          "UserType": user.UserType,
          "phone" :user.phone,
          "address": user.address,
          "birthYear":birthYear,
          "birthMonth":birthMonth,
          "birthDay":birthDay,
          "gender": user.gender,
          "profilepic":user.profilepic
      };

      callback(null,{"status":200,"user":UserObject});
   };

  })
}

function updateHostProfileDetails (msg,callback){


        
        Users.update(msg.query, msg.user, {upsert:true}, function(err, doc){
        
          if (err) {
            callback(null,{"status":400,"result":"Bad request"});
         
          }
          else {
            console.log(doc);
            console.log("host updated");
            callback(null,{"status":200,"result":"user updated"});        
      };
      });
}

function updateHostProfileCardDetails (msg,callback){


      Users.findOneAndUpdate(msg.query, msg.body, {upsert:false}, function(err, doc){
      if (err) {
         callback(null,{"status":400,"result":"Bad request"});

          }
        else {
          console.log(doc);
         callback(null,{"status":200,"result":"card details saved"});
          };
    })
}
exports.SignUp = signUp;
exports.authenticate = authenticate;
exports.updateProfile = updateProfile;
exports.getUserProfile = getUserProfile;
exports.getHostProfile = getHostProfile;
exports.updateHostProfileDetails = updateHostProfileDetails;
exports.updateHostProfileCardDetails = updateHostProfileCardDetails;





