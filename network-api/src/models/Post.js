const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    text: { 
        type: String,
        validate: {
            validator: function() {
                return this.text || this.fileUrl;
            },
            message: 'Content dois au moins avoir un text ou une file.'
        }
    },
    fileUrl: { 
        type: String,
        validate: {
            validator: function() {
                return this.text || this.fileUrl;
            },
            message: 'Content dois au moins avoir un text ou une file.'
        } 
    } 
}, {
    _id: false // evite la création d'un id
});

const authorSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, ref: 'User', required: true }
});

const replySchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: contentSchema,
    likes: [{
        author: authorSchema,
        date: { type: Date, required: true, default: Date.now }
    }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date }
});

const commentSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: contentSchema,
    likes: [{
        author: authorSchema,
        date: { type: Date, required: true, default: Date.now }
    }],
    replies: [replySchema],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date }
});

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    hashtags: { 
        type: [{ type: String, required: true }],
        validate: [arrayLimit, '{PATH} dois avoir au moins un hashtag']
    },
    fileUrl: { type: String },
    author: authorSchema,
    likes: [{
        author: authorSchema,
        date: { type: Date, required: true, default: Date.now }
    }],
    comments: [commentSchema],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date }
});

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model('Post', postSchema);