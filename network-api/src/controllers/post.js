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

exports.getPersonalsizedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId)
      .select('location favoriteHashtags searches likedPosts followers followed')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAddedWithinLast7Days = (dateString) => {
      const addedAtDate = new Date(dateString);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return addedAtDate >= sevenDaysAgo;
    };

    const removeDuplicate = (array) => Array.from(new Set(array));

    // Prendre l'id des utilisateurs suivis et des utilisateurs qui suivent
    const usersFollowedId = user.followed.map(userFollowed => userFollowed.userId);
    const usersFollowerId = user.followers.map(userFollower => userFollower.userId);

    // Filtre des mots-clés des recherches
    let searchKeys = user.searches
      .filter(search => isAddedWithinLast7Days(search.date.toString()))
      .map(search => search.searchKey);
    searchKeys = removeDuplicate(searchKeys);

    // Filtre des hashtags préférés
    let currentFavoriteHashtags = user.favoriteHashtags
      .filter(hastag => isAddedWithinLast7Days(hastag.addedAt.toString()))
      .map(hastag => hastag.hashtag);
    currentFavoriteHashtags = removeDuplicate(currentFavoriteHashtags);

    // Prend les posts en fonction des hashtags, des utilisateurs suivis/suiveurs, et des mots-clés de recherche
    const posts = await Post.find({
      $and: [
        {
          $or: [
            { createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            { updatedAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
          ]
        },
        {
          $or: [
            { hashtags: { $in: currentFavoriteHashtags } },
            { authorId: { $in: usersFollowedId.concat(usersFollowerId) } },
            { caption: { $in: searchKeys } }
          ]
        }
      ]
    })
    .sort({ createdAt: -1, updatedAt: -1 })
    .exec();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error });
  }
};
