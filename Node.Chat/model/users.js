/**
 * Created by Yogesh on 11-Apr-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type:String,
        unique: true
    },
    firstname: String,
    lastname: String,
    password: String
});

module.exports = mongoose.model('users',userSchema);