/**
 * Created by Yogesh on 10-Apr-15.
 */

var express = require('express');
var router = express.Router();
var Users = require('../model/users');

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    res.render('login', {
        title: 'Login' ,
        url: req.baseUrl,
        msg:sess.msg,
        session: sess
    });
});

router.get('/logout',function(req,res,next){
    req.session.isLoggedIn = false;
    req.session.username = null;

    res.redirect("/");
});

router.post('/',function(req,res,next){

    var data = req.body;
    var sess = req.session;
    Users.findOne({username:data.username,password:data.password},function (err,user){
        var msg;
        if(err){
            msg = {type:0,message:err.message};
            req.session.msg = msg;
            res.redirect("/login");
        }
        else{
            if(user!=null) {
                sess.isLoggedIn = true;
                sess.username = data.username;
                sess.name = user.firstname;
                sess.userid = user._id;
                res.redirect("/");
            }
            else{
                msg = {type:0,message:"Invalid Username or password"};
                req.session.msg = msg;
                res.redirect("/login");
            }
        }
    });

});

module.exports = router;
