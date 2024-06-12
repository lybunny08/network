const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    fileUrl: { type: String },
    likes: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true, default: Date.now }
    }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true, default: Date.now }
    }],
    replies: [replySchema],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    hashtags: { 
        type: [{ type: String, required: true }],
        validate: [arrayLimit, '{PATH} must have at least one hashtag']
    },
    fileUrl: { type: String },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true, default: Date.now }
    }],
    comments: [commentSchema],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model('Post', postSchema);
