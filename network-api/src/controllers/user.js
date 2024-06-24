const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Chat = require('../models/Chat');
const Post = require('../models/Post');

function IsEmpty (str) {
    if(str && str.trim().length !== 0)
        return false;
    return true;
}

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
        delete req.body.password;
        const user = new User({
            userName: req.body.firstName+" "+req.body.lastName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: new Date(req.body.birthDate),
            email: req.body.email,
            password: hash,
        });

        // Donner un pdp à l'user
        user.profileImages.unshift({
            imageUrl: 'http://localhost:3000/files/defaulUserImage.jpeg1719221914537.jpg'
        });

        user.save()
            .then(() => res.status(201).json({ message: 'Done.' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'email or password incorrect'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'email or password incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        userName: user.userName,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.follow = (req, res, next) => {
    // Trouver l'utilisateur à suivre
    User.findById(req.params.userId)
        .select('followers userName firstName lastName')
        .then(userToFollow => {
            if (!userToFollow) {
                return res.status(404).json({ error: 'User not found.' });
            }

            // Trouver l'utilisateur qui fait le suivi
            User.findById(req.auth.userId)
                .select('followed userName firstName lastName')
                .then(userDoingFollowing => {
                    // Vérifier si l'utilisateur est déjà suivi
                    const isAlreadyFollowed = userDoingFollowing.followed.some(followed => followed.user.userId.equals(userToFollow._id));

                    if (isAlreadyFollowed) {
                        return res.status(400).json({ error: 'User already followed.' });
                    }

                    // Ajouter l'utilisateur à la liste des suivis
                    userDoingFollowing.followed.push({ 
                        user: {
                            userId: userToFollow._id,
                            userName: userToFollow.userName,
                            firstName: userToFollow.firstName,
                            lastName: userToFollow.lastName
                        }
                    });

                    userDoingFollowing.save()
                        .then(() => {
                            // Vérifier si l'utilisateur est déjà un follower
                            const isAlreadyFollower = userToFollow.followers.some(follower => follower.userId.equals(userDoingFollowing._id));

                            if (!isAlreadyFollower) {
                                // Ajouter l'utilisateur à la liste des followers
                                userToFollow.followers.push({
                                    user: {
                                        userId: userDoingFollowing._id,
                                        userName: userDoingFollowing.userName,
                                        firstName: userDoingFollowing.firstName,
                                        lastName: userDoingFollowing.lastName
                                    }
                                });

                                userToFollow.save()
                                    .then(() => res.status(200).json({ message: 'Done.' }))
                                    .catch(error => res.status(500).json({ error }));
                            } else {
                                res.status(200).json({ message: 'Done.' });
                            }
                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.unfollow = (req, res, next) => {
    // Trouver l'utilisateur à ne plus suivre
    User.findById(req.params.userId)
        .select('followers')
        .then(userToUnfollow => {
            if (!userToUnfollow) {
                return res.status(404).json({ error: 'User not found.' });
            }

            // Trouver l'utilisateur qui fait l'opération de unfollow
            User.findById(req.auth.userId)
                .select('followed')
                .then(userDoingUnfollowing => {
                    // Trouver l'index de l'utilisateur à ne plus suivre dans le tableau 'followed'
                    const indexInFollowed = userDoingUnfollowing.followed.findIndex(followed => followed.user.userId.equals(userToUnfollow._id));

                    if (indexInFollowed === -1) {
                        return res.status(400).json({ error: 'User already unfollowed.' });
                    }

                    // Supprimer l'utilisateur de la liste des suivis
                    userDoingUnfollowing.followed.splice(indexInFollowed, 1);

                    userDoingUnfollowing.save()
                        .then(() => {
                            // Trouver l'index de l'utilisateur dans le tableau 'followers' de l'utilisateur à ne plus suivre
                            const indexInFollowers = userToUnfollow.followers.findIndex(follower => follower.user.userId.equals(userDoingUnfollowing._id));

                            if (indexInFollowers !== -1) {
                                // Supprimer l'utilisateur de la liste des followers
                                userToUnfollow.followers.splice(indexInFollowers, 1);

                                userToUnfollow.save()
                                    .then(() => res.status(200).json({ error: 'Done.' }))
                                    .catch(error => res.status(500).json({ error }));
                            } else {
                                res.status(200).json({ message: 'Done.' });
                            }
                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.sendConnectionRequest = async (req, res, next) => {
    try {
        const userReceiveConnectionReq = await User.findById(req.params.userId)
            .select('notifications connectionRequests networks').exec();
        
        if(!userReceiveConnectionReq) {
            return res.status(404).json({ error: 'User not found.' })
        }

        const userDoConnectionReq = await User.findById(req.auth.userId)
            .select('userName firstName lastName profileImages').exec();

        const indexInConnectionRequests = userReceiveConnectionReq.connectionRequests.findIndex(connectionRequest => connectionRequest.user.userId.equals(userDoConnectionReq._id));

        // Si la demande existe mais qu'il n'a pas encore été répendu
        if(indexInConnectionRequests !== -1 && 
            userReceiveConnectionReq.connectionRequests[indexInConnectionRequests].isAccepted == undefined) 
        {
            userReceiveConnectionReq.connectionRequests.splice(indexInConnectionRequests, 1);
        }
        // Si la demande existe et à pas encore été répendu
        else if(indexInConnectionRequests !== -1 && 
            userReceiveConnectionReq.connectionRequests[indexInConnectionRequests].isAccepted != undefined) 
        {
            return res.status(401).json({ error: 'Unautorized.' });
        } 
        // Si la demande n'existe
        else {
            userReceiveConnectionReq.connectionRequests.push({
                user: { 
                    userId: userDoConnectionReq._id,
                    userName: userDoConnectionReq.userName,
                    firstName: userDoConnectionReq.firstName,
                    lastName: userDoConnectionReq.lastName,
                    profilImageUrl: userDoConnectionReq.profileImages[0].imageUrl
                }
            });

            userReceiveConnectionReq.notifications.push({
                content: userDoConnectionReq.userName + " sent you a connection request."
            });
        }

        await userReceiveConnectionReq.save();

        res.status(200).json({ message: "Done."});
    }
    catch(error) {
        res.status(500).json({error});
    }
};

exports.responseConnectionRequest = async (req, res, next) => {
    let accept;
    switch(req.query.res) {
        case "true": 
            accept = true;
            break;
        case "false":
            accept = false;
            break;
        default:
            return res.status(400).json({ error: 'Invalid query parameter' });
    }

    try {
        // Trouver l'utilisateur qui reçoit la demande de connexion
        const userReceivedConnectionReq = await User.findById(req.auth.userId)
                                            .select('userName connectionRequests networks lastName firstName profileImages')
                                            .exec();
        if (!userReceivedConnectionReq) {
            return res.status(404).json({ error: 'Receiving user not found.' });
        }

        // Trouver l'index de la demande de connexion
        const indexInConnectionRequests = userReceivedConnectionReq.connectionRequests.findIndex(connectionRequest => 
            connectionRequest._id.toString() === req.params.connectReqId
        );
        if (indexInConnectionRequests === -1) {
            return res.status(404).json({ error: "Request not found." });
        }
        // Empêcher la rénregistrement
        if(userReceivedConnectionReq.connectionRequests[indexInConnectionRequests].isAccepted) {
            return res.status(400).json({ error: "Connection request already answerd." });
        }

        // Mettre à jour l'acceptation de la demande de connexion
        userReceivedConnectionReq.connectionRequests[indexInConnectionRequests].isAccepted = accept;
        
        // Trouver l'utilisateur qui a fait la demande de connexion
        const userDoConnectionReq = await User.findById(userReceivedConnectionReq.connectionRequests[indexInConnectionRequests].user.userId)
                                        .select('notifications networks userName lastName firstName profileImages')
                                        .exec();
        if (!userDoConnectionReq) {
            return res.status(404).json({ error: 'Requesting user not found.' });
        }

        // Si la demande est acceptée
        if (accept) {
            // Ajouter une notification
            userDoConnectionReq.notifications.push({
                content: `${userReceivedConnectionReq.userName} has accepted your connection request.`
            });

            // Creation du chat pour les deux utilisateurs
            const chat = await Chat({
                users: [{
                        userId: userReceivedConnectionReq._id,
                        userName: userReceivedConnectionReq.userName,
                        firstName: userReceivedConnectionReq.firstName,
                        lastName: userReceivedConnectionReq.lastName,
                        profilImageUrl: userReceivedConnectionReq.profileImages[0].imageUrl
                    }, {
                        userId: userDoConnectionReq._id,
                        userName: userDoConnectionReq.userName,
                        firstName: userDoConnectionReq.firstName,
                        lastName: userDoConnectionReq.lastName,
                        profilImageUrl: userDoConnectionReq.profileImages[0].imageUrl
                }]
            });
            // Sauvegarder le chat et obtenir l'ID du chat
            await chat.save();
            const chatId = chat._id;

            // Ajouter réciproquement dans les networks des deux utilisateurs
            userReceivedConnectionReq.networks.push({
                chatId: chatId,
                user: {
                    userId: userDoConnectionReq._id,
                    userName: userDoConnectionReq.userName,
                    firstName: userDoConnectionReq.firstName,
                    lastName: userDoConnectionReq.lastName,
                    profilImageUrl: userDoConnectionReq.profileImages[0].imageUrl
                }
            });

            userDoConnectionReq.networks.push({
                chatId: chatId,
                user: {
                    userId: userReceivedConnectionReq._id,
                    userName: userReceivedConnectionReq.userName,
                    firstName: userReceivedConnectionReq.firstName,
                    lastName: userReceivedConnectionReq.lastName,
                    profilImageUrl: userReceivedConnectionReq.profileImages[0].imageUrl
                }
            });
            await userDoConnectionReq.save();
        }
        await userReceivedConnectionReq.save();

        res.status(200).json({ message: "Done." });
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.getNetworks = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth.userId).select('networks -_id').exec();
        res.status(200).json(user);
    }
    catch(error) {
        res.status(500).json({error});
    }
};

exports.modifyProfil = async (req, res, next) => {
    const userId = req.params.id;
    const newUserName = req.body.userName;

    if(IsEmpty(newUserName) && !req.file) {
        return res.status(400).json({ error:'Bad request. '});
    }

    try {
        const user = await User.findById(userId)
                        .select('userName profileImages')
                        .exec();
        
        if(!user) {
            return res.status(500).json({ error: 'User not found.'});
        }

        if(userId != user._id) {
            return res.status(401).json({ error:'Unauthorized.'});
        }

        // Modifier le user name
        if(newUserName) {
            user.userName = newUserName;
        }

        // Modifer le profil si il y a un fichier envoyer
        if(req.file) {
            user.profileImages.unshift({
                imageUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
            });
        }

        await user.save();

        res.status(200).json({ message: 'Done.' });
    }
    catch(error) {
        res.status(500).json({ error });
    }
};

exports.getUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        // Trouver l'utilisateur par ID et sélectionner certains champs
        const user = await User.findById(userId)
            .select('userName lastName firstName profileImages followers followed')
            .exec();

        if(!user) {
            return res.satus(404).json({ error: 'User not found'});
        }

        // Compter le nombre de documents où l'auteur a l'ID spécifié
        const postCount = await Post.countDocuments({ 'author.authorId': userId });

        // Convertir l'utilisateur en objet pour pouvoir le modifier
        const userObject = user.toObject();

        // Calculer le nombre de followers et de personnes suivies
        const followers = userObject.followers.length;
        const following = userObject.followed.length;

        // Obtenir l'URL de la dernière image de profil
        const profileImagUrl = userObject.profileImages[userObject.profileImages.length - 1];

        // Supprimer les champs non nécessaires
        delete userObject.followers;
        delete userObject.followed;
        delete userObject.profileImages;

        // Ajouter les nouveaux champs
        userObject.profileImagUrl = profileImagUrl;
        userObject.followers = followers;
        userObject.following = following;
        userObject.postCount = postCount;

        // Envoyer la réponse avec le statut 200 et l'objet utilisateur modifié
        res.status(200).json(userObject);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.followSuggest = (req, res, next) => {
    
};

exports.getConnectionRequests = async (req, res, next) => {
    const userId = req.auth.userId;
    try{
        let connectionRequests = [];
        const user = await User.findById(userId).select('connectionRequests').exec();
        
        if(!user) {
            return res.status(404).josn({ message: "User not found."});
        }

        if(user.connectionRequests.leght > 0) {
            connectionRequests = user.connectionRequests.filter(connectionRequest => !connectionRequest.hasOwnProperty("isAccepted"));
        }

        res.status(200).json(connectionRequests);
    } catch(error) {
        res.status(500).json({ error });
    }
}

exports.search = async (req, res, next) => {
    
};