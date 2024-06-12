const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

exports.createPost = (req, res, next) => {
  console.log(req.body);
  const postObject = req.file ? {
    ...JSON.parse(JSON.stringify(req.body)),
    authorId: req.auth.userId,
    fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  } : {...JSON.parse(JSON.stringify(req.body)), userId: req.auth.userId,};
 
  const post = new Post(postObject);
  post.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      res.status(200).json(post);
    }
  ).catch((error) => { 
    res.status(404).json({ error: error }); 
  });
};

exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {
      ...JSON.parse(JSON.stringify(req.body)),
      fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  } : { ...req.body };

  Post.findOne({_id: req.params.id})
      .then((post) => {
          if (post.authorId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id})
    .then(post => {
        if (post.authorId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
          if(post.fileUrl)
          {
            const filename = post.fileUrl.split('/files/')[1];
            fs.unlink(`files/${filename}`, () => {
                Post.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
            });
          } else 
          {
            Post.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => res.status(401).json({ error }));
          }
            
        }
    })
    .catch( error => {
        res.status(500).json({ error });
  });
};

exports.getPersonalsizedPosts = (req, res, next) => {
  User.findOne({ _id: req.auth.userId })
    .then(user => {
      const followed = user.followedId;

      let posts = [];
      followed.map( followedUser => {
        Post.find({ authorId: followedUser.userId })
          .limit(20)
          .sort({ create_at:-1, update_at:-1})
          .then( post => { posts.push(post);})
          .catch( error => { res.status(500).json({ error }); });
      });

      res.status(200).json(posts);
    })
    .catch( error => {
      res.status(500).json({ error });
  });
};