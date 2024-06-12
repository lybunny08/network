const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

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
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
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
    User.findById(req.params.id)
        .select('followers')
        .then(userToFollow => {
            if (!userToFollow) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Trouver l'utilisateur qui fait le suivi
            User.findById(req.auth.userId)
                .select('followed')
                .then(userDoingFollowing => {
                    // Vérifier si l'utilisateur est déjà suivi
                    const isAlreadyFollowed = userDoingFollowing.followed.some(followed => followed.userId.equals(userToFollow._id));

                    if (isAlreadyFollowed) {
                        return res.status(400).json({ message: 'Utilisateur déjà suivi' });
                    }

                    // Ajouter l'utilisateur à la liste des suivis
                    userDoingFollowing.followed.unshift({ userId: userToFollow._id });

                    userDoingFollowing.save()
                        .then(() => {
                            // Vérifier si l'utilisateur est déjà un follower
                            const isAlreadyFollower = userToFollow.followers.some(follower => follower.userId.equals(userDoingFollowing._id));

                            if (!isAlreadyFollower) {
                                // Ajouter l'utilisateur à la liste des followers
                                userToFollow.followers.unshift({ userId: userDoingFollowing._id });

                                userToFollow.save()
                                    .then(() => res.status(200).json({ message: 'Opération effectuée.' }))
                                    .catch(error => res.status(500).json({ error }));
                            } else {
                                res.status(200).json({ message: 'Opération effectuée.' });
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
    User.findById(req.params.id)
        .select('followers')
        .then(userToUnfollow => {
            if (!userToUnfollow) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Trouver l'utilisateur qui fait l'opération de unfollow
            User.findById(req.auth.userId)
                .select('followed')
                .then(userDoingUnfollowing => {
                    // Trouver l'index de l'utilisateur à ne plus suivre dans le tableau 'followed'
                    const indexInFollowed = userDoingUnfollowing.followed.findIndex(followed => followed.userId.equals(userToUnfollow._id));

                    if (indexInFollowed === -1) {
                        return res.status(400).json({ message: 'Utilisateur non suivi' });
                    }

                    // Supprimer l'utilisateur de la liste des suivis
                    userDoingUnfollowing.followed.splice(indexInFollowed, 1);

                    userDoingUnfollowing.save()
                        .then(() => {
                            // Trouver l'index de l'utilisateur dans le tableau 'followers' de l'utilisateur à ne plus suivre
                            const indexInFollowers = userToUnfollow.followers.findIndex(follower => follower.userId.equals(userDoingUnfollowing._id));

                            if (indexInFollowers !== -1) {
                                // Supprimer l'utilisateur de la liste des followers
                                userToUnfollow.followers.splice(indexInFollowers, 1);

                                userToUnfollow.save()
                                    .then(() => res.status(200).json({ message: 'Opération effectuée' }))
                                    .catch(error => res.status(500).json({ error }));
                            } else {
                                res.status(200).json({ message: 'Opération effectuée' });
                            }
                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
