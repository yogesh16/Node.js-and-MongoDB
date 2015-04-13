/**
 * Created by Yogesh on 11-Apr-15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendSchema = new Schema({
    userid: Schema.ObjectId,
    friendid: Schema.ObjectId
});

module.exports = mongoose.model('friends',friendSchema);