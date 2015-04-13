var express = require('express');
var Users = require('../model/users');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req,res,next) {
  var data = req.body;
  var sess = req.session;
  var flag = 1;

  new Users(data).save(function(err,data){
     if(err){
       console.log(err);
     }
  });

  msg ="Users Created Successfully";

  res.render('login', {
    title: 'Login' ,
    url: '/login',
    session: sess,
    flag: flag,
    message:msg
  });


});

module.exports = router;
