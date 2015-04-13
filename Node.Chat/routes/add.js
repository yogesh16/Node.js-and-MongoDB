/**
 * Created by Yogesh on 10-Apr-15.
 */

var express = require('express');
var Users = require('../model/users');
var Friend = require('../model/friends');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    if(!sess.isLoggedIn)
        res.redirect("/");

    res.render('add', {
        title: 'Add Friend' ,
        url: req.baseUrl,
        msg: sess.msg,
        session: sess
    });
});

router.post('/',function(req,res,next){
    var sess = req.session;
    if(!sess.isLoggedIn)
        res.redirect("/");
    Users.findOne({username:req.body.username},function(err,user){
        var msg;
        if(err){
            msg = { type:0 , message: err};
        }
        if(user!=null){
            //By default add as friend
            new Friend({userid:sess.userid,friendid:user._id}).save();
            new Friend({userid:user._id,friendid:sess.userid}).save();
            msg = { type:2 , message: "Friend Added"};
        }
        else{ //User not found
            msg = { type:1 , message: "User not found"};
            console.log("Not Found");
        }
        req.session.msg = msg;
        res.redirect("/add");
    });
});

module.exports = router;
