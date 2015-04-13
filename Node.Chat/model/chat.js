/**
 * Created by Yogesh on 11-Apr-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    fromUser : String,
    toUser : String,
    msg : String,
    datetime: {type:Date, default : Date.Now },
    isRead: Boolean
});

module.exports = mongoose.model('chat',chatSchema);