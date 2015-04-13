var express = require('express');
var router = express.Router();
var User= require('../model/users');
var Friend= require('../model/friends');
/* GET home page. */
router.get('/', function(req, res, next) {

    var sess = req.session;

    Friend.find({userid:sess.userid},{friendid:1,_id:0},function(err,frns){
        var temp = [];
        for(var i=0; i<frns.length; i++)
            temp[i] = frns[i].friendid;

        User.find({'_id':{$in:temp}},{username:1}, function (err,users) {
            res.render('chat', {
                title: 'Chat' ,
                url: req.baseUrl,
                users: users,
                session: sess
            });
        });
    });


});

module.exports = router;
/**
 * Created by Yogesh on 11-Apr-15.
 */
