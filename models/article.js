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
        maxlength: 70
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 300,
        maxlength: 15000,
    },

    articleAvatar: {
        type: String,
        required: true,
        default: "default-article-pic.png"
    },

    summary: {
        type: String,
        minlength: 100,
        maxlength: 400,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

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