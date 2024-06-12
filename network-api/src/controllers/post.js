const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

exports.createPost = (req, res, next) => {
  const postObject = req.file ? {
    caption: req.body.caption,
    hashtags: req.body.hashtags,
    authorId: req.auth.userId,
    fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  } : {
    caption: req.body.caption,
    hashtags: req.body.hashtags, 
    authorId: req.auth.userId
  };
 
  const post = new Post(postObject);
  post.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { 
      res.status(400).json( { error })
  });
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' });
      }
      res.status(200).json(post);
    }
  ).catch((error) => { 
    res.status(404).json({ error: error }); 
  });
};

exports.modifyPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' });
      }

      const postObject = req.file ? {
        caption: req.body.caption,
        hashtags: req.body.hashtags,
        fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
      } : { 
        caption: req.body.caption,
        hashtags: req.body.hashtags
      };

      if (post.authorId != req.auth.userId) {
          res.status(401).json({ message : 'Not authorized'});
      } else {
          Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => {
              res.status(401).json({ error })
          });
      }
    })
    .catch((error) => {
        res.status(400).json({ error });
  });
};

exports.deletePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' });
      }

      if (post.authorId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
        if(post.fileUrl)
        {
          const filename = post.fileUrl.split('/files/')[1];
          fs.unlink(`files/${filename}`, () => {
              Post.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => {
                  res.status(401).json({ error });
              });
          });
        } else {
          Post.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => {
              res.status(401).json({ error });
          });
        }
      }
    })
    .catch( error => {
        res.status(500).json({ error });
  });
};

exports.likePost = (req, res, next) => {
  Post.findById(req.params.id)
    .select('likes')
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' });
      }
      
      const indexInLikes = post.likes.findIndex(like => like.authorId.toString() === req.auth.userId);

      if (indexInLikes !== -1) {
        post.likes.splice(indexInLikes, 1);
      } else {
        post.likes.push({
          authorId: req.auth.userId
        });
      }

      post.save()
        .then(() => {
          User.findById(req.auth.userId)
            .select('likedPosts')
            .then(user => {
              const indexInlikedPosts = user.likedPosts.findIndex(likedPost => likedPost.postId.equals(post._id));

              if (indexInlikedPosts !== -1 && indexInLikes !== -1) 
              {
                user.likedPosts.splice(indexInlikedPosts, 1);
              } 
              else if (indexInlikedPosts === -1 &&  indexInLikes !== -1) 
              {
                return res.status(200).json({ message: 'opération effectuée'})
              } 
              else 
              {
                user.likedPosts.push({postId: post._id});
              }

              user.save()
                .then(() => res.status(200).json({ message: 'oparation effectuée'}))
                .catch(error => {
                  res.status(500).json({ error });
              });

            })
            .catch(error => {
              res.status(500).json({ error });
          });
        })
        .catch(error => {
          res.status(500).json({ error });
      });
    })
    .catch( error => {
      res.status(500).json({ error });
  });
};

exports.commentPost = (req, res, next) => {

};

exports.replyComment = (req, res, next) => {

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