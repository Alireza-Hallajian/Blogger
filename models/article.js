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
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 500,
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

    views: {
        type: Number,
        default: 0
    },
});





module.exports = mongoose.model('Article', ArticleShema);