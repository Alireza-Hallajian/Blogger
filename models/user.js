const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserShema = new Schema(
{
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 15
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },

    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 10,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 12
    },

    sex: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },

    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 11,
        maxlength: 11
    },

    role: {
        type: String,
        enum: ['blogger', 'admin'],
        default: 'blogger'
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    // avatar: {
    //     type: String
    // }
});





module.exports = mongoose.model('User', UserShema);