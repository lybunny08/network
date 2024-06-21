const Chat = require('../models/Chat');
const User = require('../models/User');
const fs = require('fs');

exports.createChat = async (req, res, next) => {

};

exports.deleteChat = async (req, res, next) => {

};

exports.chat = async (req, res, next) => {

};

exports.getNetwork = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth.userId).select('followed followers').exec();
        res.status(200).json(user);
    }
    catch(error) {
        res.status(500).json({error});
    }
};
