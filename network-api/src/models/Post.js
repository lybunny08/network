const mongoose = require('mongoose');

const postShema = mongoose.Schema({
    caption : { type: String, required: true },
    hashtags: [{ type: String, required: true}],
    fileUrl: { type: String },
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true, default: Date.now }
    }],
    comments: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String },
        likes: [{
            authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            date: { type: Date, required: true, default: Date.now }
        }],
        reply : [{
            authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            text: { type: String },
            fileUrl: { type: String },
            likes: [{
                authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                date: { type: Date, required: true, default: Date.now }
            }],
            create_at: { type: Date, required: true, default: Date.now },
            update_at: { type: Date, required: true, default: Date.now }
        }],
        create_at: { type: Date, required: true, default: Date.now },
        update_at: { type: Date, required: true, default: Date.now }
    }],
    create_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Post', postShema);