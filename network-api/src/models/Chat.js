const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    }],
    messages: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true},
        view: { type: Boolean, required: true, default: false },
        date: { type: Date, default: Date.now, required: true},
    }],
    createAt:  { type: Date, default: Date.now, required: true },
    updateAt: { type: Date }
});

module.exports = mongoose.model('Chat', chatSchema);