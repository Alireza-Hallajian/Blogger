//node_modules
const mongoose = require('mongoose');

//mongoose schema
const Schema = mongoose.Schema;


//******************************************************************************** */
//                                   Article Schema
//******************************************************************************** */

const ArticleShema = new Schema(
{
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 2,
        maxlength: 60
    },

    author: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 36
    },

    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 100,
        maxlength: 20000,
    },

    summary: {
        type: String,
        minlength: 50,
        maxlength: 300,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    // articleAvatar: {
    //     type: String,
    //     required: true,
    //     default: 'Male'
    // },

    // authorAvatar: {
    //     type: String,
    //     required: true,
    //     default: 'Male'
    // },

    // viewsNum: {
    //     type: String,
    // },
});


//******************************************************************************** */
//                                     Methods
//******************************************************************************** */

// UserShema.method(
// {
//     compare_password: function (candidate_password, callback) 
//     {
//         bcrypt.compare(candidate_password, this.password, function (err, is_match) 
//         {
//             if (err) return callback(err);

//             callback(null, is_match);
//         });
//     }
// });


//******************************************************************************** */
//                               Password Encryption
//******************************************************************************** */

// UserShema.pre('save', function (next)
// {
//     const user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();
    

//     // hash the password along with salt(10)
//     bcrypt.hash(user.password, 10, (err, hash) => 
//     {
//         if (err) return next(err);

//         // override the cleartext password with the hashed one
//         user.password = hash;
//         next();
//     });
// });





module.exports = mongoose.model('Article', ArticleShema);