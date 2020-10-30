//node_modules
const mongoose = require('mongoose');

//mongoose schema
const Schema = mongoose.Schema;


//******************************************************************************** */
//                                   Comment Schema
//******************************************************************************** */

const CommentShema = new Schema(
{
    article_id: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    },

    author_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    content: {
        type: String,
        required: true,
        maxlength: 1000
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});





module.exports = mongoose.model('Comment', CommentShema);