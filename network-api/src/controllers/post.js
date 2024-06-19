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
              res.status(500).json({ error })
          });
      }
    })
    .catch((error) => {
        res.status(500).json({ error });
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
    .select('likes hashtags')
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
            .select('likedPosts favoriteHashtags')
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
                post.hashtags.forEach(hashtag => {
                  user.favoriteHashtags.push({
                    hashtag: hashtag
                  });
                });
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
  Post.findById(req.params.postId)
    .select('comments')
    .then(post => {
      if(!post) {
        return res.status(404).json({ message: "Post introuvable."})
      }

      commentContentObject = req.file ? {
        text: req.body.comment,
        fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
      } : {  text: req.body.comment };

      post.comments.push({
        authorId: req.auth.userId,
        content: commentContentObject
      })

      post.save()
        .then(()=> { 
          res.status(200).json({ message: 'opération effectué.'}); 
        })
        .catch(error => {
          res.status(500).json({error})
      });
    })
    .catch(error => {
      res.status(500).json({ error });
  });
};

exports.modifyComment = (req, res, next) => {
  // commentaire check
  const commentIsEmpty = (comment) => {
    if(comment && comment.trim().length !== 0)
     return false;
    return true;
  }

  if(!commentIsEmpty(req.body.comment) || req.file) {
    Post.findById(req.params.postId) // cherche le post, si rien erreur
      .select('comments')
      .then(post => {
        // les check
        if (!post) {
          return res.status(404).json({ message: "Post introuvable." });
        }
        const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if(indexInComments === -1) {
          return res.status(404).json({ message: 'commentaire non trouvé'});
        }
        if(post.comments[indexInComments].authorId != req.auth.userId) {
          return res.status(401).json({ message: 'opération non autorisé.'});
        }

        post.comments[indexInComments].content = req.file ? {
          text: req.body.comment,
          fileUrl:`${req.protocol}://${req.get('host')}/files/${req.file.filename}`
        } : { 
          text: req.body.comment
        };
        post.comments[indexInComments].updatedAt = Date.now(); // à trailler

        const commentObject = {
          comments: post.comments
        }

        Post.updateOne({ _id: req.params.postId }, { ...commentObject, _id:  req.params.postId })
          .then(() => {
            res.status(200).json({ message: 'commentaire modifié' });
          })
          .catch(error => {
            res.status(500).json({ error });
        });
      })
      .catch(error => {
        res.status(500).json({ error });
    });
  } else {
    res.status(400).json({ message: 'Bad request'});
  }
};

exports.deleteComment = (req, res, next) => {
  Post.findById(req.params.postId)
    .select('comments')
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post introuvable." });
      }

      const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if(indexInComments === -1) {
        return res.status(404).json({ message: 'commentaire non trouvé'});
      }
      
      // securité
      if(post.comments[indexInComments].authorId != req.auth.userId) {
        return res.status(401).json({ message: 'opération non autorisé.'});
      }

      if(post.comments[indexInComments].content.fileUrl)
      {
        const filename = post.comments[indexInComments].content.fileUrl.split('/files/')[1];
        fs.unlink(`files/${filename}`, () => {
          post.comments.splice(indexInComments, 1);
          post.save()
            .then(() => { 
              res.status(200).json({message: 'Objet supprimé !'})
            })
            .catch(error => {
              res.status(500).json({ error });
          });
        });
      } else {
        post.comments.splice(indexInComments, 1);
          post.save()
            .then(() => { 
              res.status(200).json({message: 'Objet supprimé !'})
            })
            .catch(error => {
              res.status(500).json({ error });
        });
      }
    })
    .catch( error => {
        res.status(500).json({ error });
  });
}

exports.replyComment = (req, res, next) => {
  const replyIsEmpty = (reply) => {
    if(reply && reply.trim().length !== 0)
     return false;
    return true;
  }

  if(!replyIsEmpty(req.body.reply) || req.file) {
    Post.findById(req.params.postId)
      .select('comments')
      .then(post => {
        if (!post) {
          return res.status(404).json({ message: "Post introuvable." });
        }

        const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if(indexInComments === -1) {
          return res.status(404).json({ message: 'commentaire non trouvé'});
        }

        post.comments[indexInComments].replies.push( req.file ? {
          authorId: req.auth.userId,
          content: {
            text: req.body.reply,
            fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
          }
        } : {
          authorId: req.auth.userId,
          content: {
            text: req.body.reply
          }
        });

        post.save()
          .then(()=> {
            res.status(200).json({ message: "oppération éffectué."});
          })
          .catch(error => {
            res.status(500).json({ error });
        });
      })
      .catch(error => {
        res.status(500).json({ error });
    });
  } else {
    res.status(400).json({ message: 'Bad request'});
  }
};

exports.modifyReply = (req, res, next) => {
  const replyIsEmpty = (reply) => {
    if(reply && reply.trim().length !== 0)
     return false;
    return true;
  }

  if(!replyIsEmpty(req.body.reply) || req.file) {
    Post.findById(req.params.postId)
      .select('comments')
      .then(post => {
        if (!post) {
          return res.status(404).json({ message: "Post introuvable." });
        }

        const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if(indexInComments === -1) {
          return res.status(404).json({ message: 'commentaire non trouvé'});
        }

        const indexInReplies = post.comments[indexInComments].replies.findIndex(reply => reply._id.toString() === req.params.replyId);
        if(indexInReplies === -1) {
          return res.status(404).json({ message: 'reponse non trouvé'});
        }

        // securité
        if(post.comments[indexInComments].replies[indexInReplies].authorId != req.auth.userId) {
          return res.status(401).json({ message: 'opération non autorisé.'});
        }

        post.comments[indexInComments].replies[indexInReplies].content = req.file ? {
          text: req.body.reply,
          fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
        } : { 
          text: req.body.reply
        };

        post.comments[indexInComments].replies[indexInReplies].updatedAt = Date.now(); //

        const commentObject = {
          comments: post.comments
        }

        Post.updateOne({ _id: req.params.postId}, { ...commentObject, _id: req.params.postId })
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => {
              res.status(500).json({ error })
        });

      })
      .catch(error => {
        res.status(500).json({ error });
    });
  } else {
    res.status(400).json({ message: 'Bad request'});
  }
};

exports.deleteReply = (req, res, next) => {
  Post.findById(req.params.postId)
    .select('comments')
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post introuvable." });
      }

      const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if(indexInComments === -1) {
        return res.status(404).json({ message: 'commentaire non trouvé'});
      }

      const indexInReplies = post.comments[indexInComments].replies.findIndex(reply => reply._id.toString() === req.params.replyId);
      if(indexInReplies === -1) {
        return res.status(404).json({ message: 'reponse non trouvé'});
      }

      // securité
      if(post.comments[indexInComments].replies[indexInReplies].authorId != req.auth.userId) {
        return res.status(401).json({ message: 'opération non autorisé.'});
      }

      post.comments[indexInComments].replies.splice(indexInReplies, 1);

      post.save()
        .then(() => { 
          res.status(200).json({message: 'Objet supprimé !'})
        })
        .catch(error => {
          res.status(500).json({ error });
      });
    })
    .catch(error => {
      res.status(500).json({ error });
  })
}

exports.likeReply = (req, res, next) => {
  Post.findById(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post introuvable." });
      }

      const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if(indexInComments === -1) {
        return res.status(404).json({ message: 'commentaire non trouvé'});
      }

      const indexInReplies = post.comments[indexInComments].replies.findIndex(reply => reply._id.toString() === req.params.replyId);
      if(indexInReplies === -1) {
        return res.status(404).json({ message: 'reponse non trouvé'});
      }

      const indexInLikes = post.comments[indexInComments].replies[indexInReplies].likes.findIndex(like => like.authorId.toString() === req.auth.userId);
      if (indexInLikes !== -1) {
        post.comments[indexInComments].replies[indexInReplies].likes.splice(indexInLikes, 1);
      } else {
        post.comments[indexInComments].replies[indexInReplies].likes.push({
          authorId: req.auth.userId
        });
      }

      post.save()
        .then(() =>{
          res.status(200).json({ message: "Opération éfféctué." });
        })
        .catch(error => {
          res.status(500).json({ error });
      });
     
    })
    .catch(error => {
      res.status(500).json({ error });
  });
};

exports.getPersonalsizedPosts = (req, res, next) => {
  User.findById(req.auth.userId)
    .select('location favoriteHashtags searches likedPosts followers followed')
    .then(user => {
      const isAddedWithinLast7Days = (dateString) => {
        const addedAtDate = new Date(dateString);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return addedAtDate >= sevenDaysAgo;
      };

      const removeDuplicate = (array) => {
        let unique = [];
        array.forEach(data => {
          if(unique.indexOf(data) === -1) {
            unique.push(data);
          }
        });
        return unique;
      }

      const usersFollowed = user.followed; // on vas voir ceux qui on des publications récentes
      const usersFollowers = user.followed; // on vas voir ceux qui on des publications récentes
      const searches = user.searches; // filtre en fonction de la date, on prend les mot clés

      /*  on vas melanger les hashtags récents (ok)
          on prends les publication récent des users suivie et suiveurs
          on cherches les post récents avec les mots clé de searches
      */

      // filtre des hashtags péféré
      let currentFavoriteHashtags= [] 
      user.favoriteHashtags.forEach(hastag => {
        if (isAddedWithinLast7Days(hastag.addedAt.toString())) {
          currentFavoriteHashtags.push(hastag.hashtag);
        }
      });
      currentFavoriteHashtags = removeDuplicate(currentFavoriteHashtags);
      // prendres les punlications récent qui contient les tages, limit ?

      return res.status(200).json(currentFavoriteHashtags);

    })
    .catch(error => {
        res.status(500).json({ error });
  });
};