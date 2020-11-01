//node_modules
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

//mongoose schema
const Schema = mongoose.Schema;


//******************************************************************************** */
//                                   User Schema
//******************************************************************************** */

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

    username: {
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
        required: true
    },

    sex: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
        default: 'Male',
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

    avatar: {
        type: String,
        default: "default-profile-pic.jpg"
    }
});


//******************************************************************************** */
//                                     Methods
//******************************************************************************** */

UserShema.method(
{
    compare_password: function (candidate_password, callback) 
    {
        bcrypt.compare(candidate_password, this.password, function (err, is_match) 
        {
            if (err) return callback(err);

            callback(null, is_match);
        });
    }
});


//******************************************************************************** */
//                               Password Encryption
//******************************************************************************** */

UserShema.pre('save', function (next)
{
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    

    // hash the password along with salt(10)
    bcrypt.hash(user.password, 10, (err, hash) => 
    {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});





module.exports = mongoose.model('User', UserShema);