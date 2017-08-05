var express = require('express');
var router = express.Router();
var User = require('../../model/usermodel');
var Topic = require("../../model/topicmodel");
var Friends = require("../../model/friendsmodel");
var Notifications = require('../../model/notificationmodel');
var UserPost = require("../../model/userpostmodel");
var jwt = require('jsonwebtoken');
var secret ="putsomethingtopsecrethere" ;
var multer = require('multer');
var middleware = require('../../middleware/apimiddleware');

   // var storage = multer.diskStorage({ //multers disk storage settings
   //      destination: function (req, file, cb) {
   //          cb(null, './uploads/');
   //      },
   //      filename: function (req, file, cb) {
   //          var datetimestamp = Date.now();
   //          cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
   //      }
   //  });


   //    var upload = multer({ //multer settings
   //                  storage: storage
   //              }).single('file');

  var storage = multer.diskStorage({
  // destino del fichero
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  // renombrar fichero
  filename: function (req, file, cb) {
    var filename = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000 +'_' +file.originalname;
    cb(null, filename);
  }
});

var upload = multer({ storage: storage });
// var upload = multer({ storage : storage }).array('uploads[]',2);


router.post('/authenticate', function(req, res) {

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else {

      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user, secret, {
            expiresIn: 10080 // in seconds
          });
          res.json({success:true,token:token,user:user});
        } else {
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});
 router.post("/user",function(req,res){

    User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else {

      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user, secret, {
            expiresIn: 10080 // in seconds
          });
          res.json({success:true,token:token,user:user});
        } else {
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
 });

router.get('/user-list',middleware,function(req,res){
	User.find({},function(err,docs){
		if(err) throw errr;
		res.json({success:true,userlist:docs});
	})
})

router.post('/savetopics',middleware,function(req,res){
Topic.findOne({"topic":req.body.topic},function(err,data){
  if(err) {throw err;}
  if(!data) {

  var newtopic = new Topic({"user_email":req.body.user_email,"nickname":req.body.nickname,"topic":req.body.topic,"user_id":req.body.user_id});

  newtopic.save(function(err){
  if(err) {throw err ;
  res.json({success:false});}
  res.json({success:true});
});

   
  }else{
     res.json({success:false,msg:"already present"});
  }
 });


// var newtopic = new Topic({"nickname":req.body.nickname,"topic":req.body.topic,"user_id":req.body.user_id});
// newtopic.save(function(err){
//   if(err) {throw err ;
//   res.json({success:false});}
//   res.json({success:true});
// });

});

router.get("/gettopics",middleware,function(req,res){

  Topic.find({},function(err,data){
    if (err) throw err;
    res.json({success:true,topics:data});
  })
});

router.post("/saveuser",function(req,res){

  User.findOne({"email":req.body.email},(err,user)=>{
    if(err) {throw err; res.json({success:false})}
    if(!user){

    var newUser = new User();
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);
    newUser.name = req.body.name;
    newUser.save(function(err,result){
       if(err) {throw err ; res.json({success:false})}
        res.json({success:true});
    });

    }else{
      res.json({success:false,msg:"user already exist"});
    }
  })
})

router.post('/getsearchusers',middleware,function(req,res){
  var user = req.body.currentuser.toString();
  User.find({"name":{$regex:req.body.name,$options:'i'} ,  name: { $ne: user }  },function(err,data){
    if (err)  throw err;
    res.json({success:true,users:data});
  })
})
// price: { $not: { $gt: 1.99 } }
// {$not: {email: /@domain.com/}}

router.post("/sendrequest",middleware,function(req,res){
   var newFriendrequest = new Friends();
      newFriendrequest.sender = req.body.sender;
      newFriendrequest.sendto  = req.body.sendto;
      newFriendrequest.approve = 0;
      newFriendrequest.save(function(err,result){
    if(err) {throw err; res.json({success:false})}
    var newnotofication = new Notifications();
    newnotofication.set('sender',  req.body.sender);
    newnotofication.set('sendto',  req.body.sendto);
    newnotofication.set('msg', "send-request");
     newnotofication.set('read', false); 

    newnotofication.save(function(err,doc){
      if(err){throw err}
    })
    res.json({success:true,data:result,msg:"request sent"})
  })
});

router.post("/cancelrequest",middleware,function(req,res){
 Friends.remove({ sender:req.body.sender,sendto:req.body.sendto }, function(err) {
        if (!err) {
               res.json({success:true});
        }
        else {
               throw err ; res.json({success:false});
        }
    });
});



router.post("/getuserprofiledata",middleware,function(req,res){
  Friends.find({$or:[{sender:req.body.currentuser,sendto:req.body.searcheduser},
    {sender:req.body.searcheduser,sendto:req.body.currentuser}]}, function(err,data){

      if(err){ throw err; res.json({success:false})}

      UserPost.find({username:req.body.searcheduser},function(err,userpost){
        if(err) {throw err}
          res.json({success:true,data:data,userpost:userpost});
      })
      
    })
})

router.post("/acceptrequest",middleware,function(req,res){
  Friends.findOne({ sender: req.body.sender,sendto:req.body.sendto,approve:false }, function (err, doc){
    if(err){throw err; res.json({success:false})}

    doc.approve = true;
    doc.save();
    var newnotofication = new Notifications();
    newnotofication.set('acceptor', req.body.sendto);
    newnotofication.set('acceptof',  req.body.sender);
    newnotofication.set('msg', "accept-request");
    newnotofication.set('read', false); 
    newnotofication.save(function(err,doc){
      if(err){throw err}
    })

  res.json({success:true,data:doc});
});
})


router.post("/getnotifications",middleware,function(req,res){
  Notifications.find({$and:[{read:false}],$or:[
    {sender:req.body.sender},
    {sendto:req.body.sender},
    {acceptor:req.body.sender},
    {acceptof:req.body.sender}
    ]},function(err,doc){
      var notification = [];
      doc.forEach(function(record){
        var objrecord = record.toObject();
       if(objrecord.msg == 'send-request' && objrecord.sender == req.body.sender.toLowerCase()){
            return;
      }
        if(objrecord.msg == 'accept-request' && objrecord.acceptor == req.body.sender.toLowerCase()){
            return;
      }
      notification.push(objrecord);
      })
     console.log(notification);
    res.json({success:true,data:notification})
  })
})

router.post("/readnotification",middleware,function(req,res){  Notifications.find({$and:[{read:false}],$or:[
    {sender:req.body.currentuser.toLowerCase()},
    {sendto:req.body.currentuser.toLowerCase()},
    {acceptor:req.body.currentuser.toLowerCase()},
    {acceptof:req.body.currentuser.toLowerCase()}
    ]},function(err,doc){
    if(err) { throw err ; res.json({success:false})}
     doc.forEach(function(record) {
      console.log(record);
    var notification =record.toObject();
  if(notification.msg == "send-request" && notification.sender == req.body.currentuser.toLowerCase()){
 
      return;
  }
  if(notification.msg == "accept-request" && notification.acceptor == req.body.currentuser.toLowerCase()){
  
      return;
  }
  Notifications.update({ _id: record._id }, { $set: { read: true }}, { multi: true }, function (error){
            if(error){
              console.error('ERROR!');
            }
          });

  });
    res.json({success:true});
  })
})


router.post("/postupdate", upload.array("uploads[]", 12), function (req, res) {

  req.files.forEach(function(data){
 
    var newpost = new UserPost();
    newpost.username = req.body.user.toLowerCase();
    newpost.text = req.body.walltext;
    newpost.filename = data.filename;
    data.text = req.body.walltext;
    data.filename = data.filename;
    data.username = req.body.user.toLowerCase();
    newpost.save(function(err){
      if(err) throw err;
      res.json({success:true,userpost:data});
    })
  })
  
});


router.post('/getuserpost',middleware,function(req,res){

  UserPost.find({"username": req.body.user},function(err,data){
    if(err) { throw err ; res.json({"success":false})}
   
    res.json({success:true,userpost:data});
  })
})

router.post("/getfriends",middleware,function(req,res){
  Friends.find({$and:[{approve:true}],
    $or:[
    {sender:req.body.user},
    {sendto:req.body.user},
    ]},function(err,data){
      if(err) throw err;
      res.json({success:true,friends:data});
    })


})


  
router.post("/getuserhomepost",middleware,function(req,res){

 Friends.find({$and:[{approve:true}],
    $or:[
    {sender:req.body.user},
    {sendto:req.body.user},
    ]},function(err,friends){
      if(err) throw err;
      var userfriends= [];
      friends.forEach(function(friend){
        var f = friend.toObject();
          if(req.body.user == f.sender){
            userfriends.push(f.sendto)  
          }if(req.body.user == f.sendto){
            userfriends.push(f.sender);
          }
      })

    userfriends.push(req.body.user);

      UserPost.find({"username":{$in : userfriends}},function(err,posts){
        if (err) throw err;
        res.json({success:true,userpost:posts});
      })

     
    })
})

module.exports = router;
