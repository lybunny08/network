const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    usersId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    createAt: { type: Date, default: Date.now, required: true },
    UpdateAt: { type: Date },
    messages: [{
        author: {
            authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            userName: { type: String, required: true },
            date: { type: Date, default: Date.now, required: true}
        },
        content: [{
            text: { 
                type: String,
                validate: {
                    validator: function() { return this.text || this.fileUrl;},
                    message: 'Content dois au moins avoir un text ou une file.'
                }
            },
            fileUrl: { 
                type: String,
                validate: {
                    validator: function() { return this.text || this.fileUrl; },
                    message: 'Content dois au moins avoir un text ou une file.'
                }
            },
            date: { type: Date, default: Date.now, required: true }
        }, {  _id: false }]
    }],
});

module.exports = mongoose.model('Chat', chatSchema);