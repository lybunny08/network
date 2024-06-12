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
    User.findById(req.params.id) // vérifie si l'utilisateur qu'on veut suivre existe
        .then(toFollowedUser => {
            if (!toFollowedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // ajout dans la liste des personnes suivies
            User.findOne({ _id: req.auth.userId })
                .select('followed')
                .then(data => {
                    // vérifie si pas encore suivi
                    const isAlreadyFollowed = data.followed.some(followed => followed.userId.toString() === req.params.id);

                    if (isAlreadyFollowed) {
                        return res.status(400).json({ message: 'Utilisateur déjà suivi' });
                    }

                    data.followed.unshift({
                        userId: req.params.id
                    });

                    data.save()
                        .then(() => res.status(200).json({ message: "Objet ajouté" }))
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.unfollow = (req, res, next) => {
    User.findById(req.params.id)
        .then(() => {
            User.findOne({ _id: req.auth.userId })
            .select('followed')
            .then(data => {
                let index = -1;
                for(let i=0; i < data.followed.length; i++) {
                    if(data.followed[i].userId.toString() === req.params.id) {
                        index = i;
                        break
                    }
                }
    
                if(index === -1){
                    return res.status(400).json({message:"utilisateur non suivi"});
                }
    
                data.followed.splice(index, 1);
    
                data.save()
                    .then(() => res.status(200).json({ message: "Objet retiré" }))
                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};