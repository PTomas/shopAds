const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    activity: {
        type: String
    },
    googleId: {
        type: String
    },
    displayName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports =  User;