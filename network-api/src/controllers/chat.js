const Chat = require('../models/Chat');

exports.chat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id).exec();

        if(!chat) {
            res.status(404).json({ error: 'Chat not found.'});
        }

        // Verifie si l'utilisateur appartient au chat
        const indexInUsers = chat.users.findIndex(user => user.userId == req.auth.userId );
        if(indexInUsers === -1) {
            return res.status(401).json({ error: "Unautorized."})
        }

        // On ne peut envyer que soit un fichier soit un text
        chat.messages.unshift( req.file ? {
            authorId: req.auth.userId,
            content: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
        } : {
            authorId: req.auth.userId,
            content: req.body.text
        });
        chat.updatedAt = Date.now();

        await chat.save();

        // On enregiste la date et heure de mification
        //await Chat.UptadOne({ _id: req.params.id}, { UpdateAt: Date.now(), _id: req.params.id});

        res.status(200).json({ message: "Sent."});
    }
    catch(error) {
        res.status(500).json({error});
    }
};

exports.getAllChat = async (req, res, next) => {
    const limit = parseInt(req.body.limit) || 20;
    const offset = parseInt(req.body.offset) || 0;

    try {
        const chats = await Chat.find({
            'users.userId': { $in: req.auth.userId },
            'messages.0': { $exists: true },
        }).skip(offset).limit(limit).sort({ updatedAt: -1, createAt: -1 }).exec(); 

        // Prendre que le dernier message et eliminer l'user de Chat
        const chatsWithLastMessages = chats.map(chat => {
            const chatObj = chat.toObject();

            let lastMessage = chatObj.messages[chatObj.messages.length - 1];
            delete chatObj.messages;
            chatObj.lastMessage = lastMessage;

            let indexInChat = chatObj.users.findIndex(user => user.userId == req.auth.userId);
            chatObj.users.splice(indexInChat, 1);

            return chatObj;
        });

        res.status(200).json(chatsWithLastMessages);
    }
    catch(error) {
        res.status(500).json({ error });
    }
}

exports.getOneChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id).exec();
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found.' });
        }
        
        // On met les messages en veiw = fasle à true et on sauvegarde
        chat.messages.forEach(messages => {
            if(messages.view === false) {
                messages.view = true;
            }
        });
        await chat.save()

        res.status(200).json(chat);
    }
    catch(error) {
        res.status(500).json({ error });
    }
}

exports.searchChat = async (req, res, next) => {
    try {
        const searchQuery = new RegExp(`^${req.query.q}`, 'i');
        const userId = req.auth.userId;

        const chats = await Chat.find({
            $or: [
                    { 'users.firstName': { $regex: searchQuery } },
                    { 'users.lastName': { $regex: searchQuery } },
                    { 'users.userName': { $regex: searchQuery } }
                ]
            ,
            'users.userId': userId,
        }).select('-messages').sort({ updatedAt: -1, createAt: -1 }).exec();

        // Supprimer l'user qui demande
        chats.forEach(chat => {
            const indexInUsers = chat.users.findIndex(user => user.userId == req.auth.userId);
            chat.users.splice(indexInUsers, 1);
        });

        // Filtrer les chats pour omettre l'utilisateur qui demande
        chats.forEach(chat => {
            chat.users = chat.users.filter(user => 
                (searchQuery.test(user.firstName) || searchQuery.test(user.lastName) || searchQuery.test(user.userName))
            );
        });

        res.status(200).json(chats);

    } catch (error) {
        res.status(500).json({ error });
    }
};

