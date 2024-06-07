const mongoose = require('mongoose');

const postShema = mongoose.Schema({
    caption : { type: String, required: true },
    fileUrl: { type: String },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String },
            reply : [
                {
                    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                    reply: { type: String },
                    fileUrl: { type: String},
                }
            ],
            create_at: { type: Date, required: true, default: Date.now },
            update_at: { type: Date, required: true, default: Date.now }
        }
    ],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    create_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Post', postShema);