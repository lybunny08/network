const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

exports.createPost = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId).select('userName').exec();

    const postObject = req.file ? {
      caption: req.body.caption,
      hashtags: req.body.hashtags,
      author: {
        authorId: user._id,
        userName: user.userName
      },
      fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
    } : {
      caption: req.body.caption,
      hashtags: req.body.hashtags, 
      author: {
        authorId: user._id,
        userName: user.userName
      }
    };

    const post = new Post(postObject);
    await post.save();
    res.status(201).json({ message: 'Created.' });
  } 
  catch(error) { 
    res.status(400).json( { error })
  };
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
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
        return res.status(404).json({ message: 'Post not found.' });
      }

      const postObject = req.file ? {
        caption: req.body.caption,
        hashtags: req.body.hashtags,
        fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
      } : { 
        caption: req.body.caption,
        hashtags: req.body.hashtags
      };

      if (post.author.authorId != req.auth.userId) {
          res.status(401).json({ message : 'Unauthorized.'});
      } else {
          Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Updated.'}))
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
        return res.status(404).json({ message: 'Post not found.' });
      }

      if (post.author.authorId != req.auth.userId) {
          res.status(401).json({message: 'Unauthorized.'});
      } else {
        if(post.fileUrl)
        {
          const filename = post.fileUrl.split('/files/')[1];
          fs.unlink(`files/${filename}`, () => {
              Post.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Deleted.'})})
                .catch(error => {
                  res.status(401).json({ error });
              });
          });
        } else {
          Post.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Deleted.'})})
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

exports.likePost = async (req, res, next) => {
  try {
    const post =  await Post.findById(req.params.id).select('likes hashtags').exec();
    if(!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.auth.userId).select('likedPosts favoriteHashtags userName').exec();

    const indexInLikes = post.likes.findIndex(like => like.author.authorId.toString() === req.auth.userId);
    if (indexInLikes !== -1) {
      post.likes.splice(indexInLikes, 1);
    } 
    else {
      post.likes.push({
        author: {
          authorId: user._id,
          userName: user.userName
        }
      });
    }
    await post.save();

    // on enregiste ou retire le post liker dans user
    const indexInlikedPosts = user.likedPosts.findIndex(likedPost => likedPost.postId.equals(post._id));
    if (indexInlikedPosts !== -1 && indexInLikes !== -1) {
      user.likedPosts.splice(indexInlikedPosts, 1);
    }  else if (indexInlikedPosts === -1 &&  indexInLikes !== -1) {
      return res.status(200).json({ message: 'done.'});
    } else {
      user.likedPosts.push({postId: post._id});
      // on prend les hashtages
      post.hashtags.forEach(hashtag => user.favoriteHashtags.push({hashtag: hashtag}));
    }
    await user.save();

    res.status(200).json({ message: 'done.'});
  }
  catch(error) {
    res.status(500).json({ error });
  }
};

exports.commentPost = async (req, res, next) => {
  try {
    const post =  await Post.findById(req.params.id).select('likes hashtags').exec();
    if(!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.auth.userId).select('userName').exec();

    post.comments.push({
      author: {
        authorId: user._id,
        userName: user.userName
      },
      content: req.file ? {
        text: req.body.comment,
        fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
      } : {  text: req.body.comment }
    });
    await post.save();

    res.status(200).json({ message: 'Saved.'});
  }
  catch(error) {
    res.status(500).json({ error });
  }
};

exports.modifyComment = async (req, res, next) => {
  try {
    // commentaire check
    const commentIsEmpty = (comment) => {
      if(comment && comment.trim().length !== 0)
      return false;
      return true;
    }

    if(!commentIsEmpty(req.body.comment) || req.file) {
      const post = await Post.findById(req.params.postId).select('comments').exec();
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if(indexInComments === -1) {
        return res.status(404).json({ message: 'Comment not found'});
      }
      if(post.comments[indexInComments].author.authorId != req.auth.userId) {
        return res.status(401).json({ message: 'Unautorized.'});
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

      await  Post.updateOne({ _id: req.params.postId }, { ...commentObject, _id:  req.params.postId });

      res.status(200).json({ message: 'Updated.' });
    }
    else {
      res.status(400).json({ message: 'Bad request'});
    }
  }
  catch(error) {
    res.status(500).json({ error });
  }
};

exports.deleteComment = (req, res, next) => {
  Post.findById(req.params.postId)
    .select('comments')
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if(indexInComments === -1) {
        return res.status(404).json({ message: 'Comment not found.'});
      }
      
      // securité
      if(post.comments[indexInComments].author.authorId != req.auth.userId) {
        return res.status(401).json({ message: 'Unautorized.'});
      }

      if(post.comments[indexInComments].content.fileUrl)
      {
        const filename = post.comments[indexInComments].content.fileUrl.split('/files/')[1];
        fs.unlink(`files/${filename}`, () => {
          post.comments.splice(indexInComments, 1);
          post.save()
            .then(() => { 
              res.status(200).json({message: 'Deleted.'})
            })
            .catch(error => {
              res.status(500).json({ error });
          });
        });
      } else {
        post.comments.splice(indexInComments, 1);
          post.save()
            .then(() => { 
              res.status(200).json({message: 'Deleted.'})
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

exports.replyComment = async (req, res, next) => {
  const replyIsEmpty = (reply) => {
    if(reply && reply.trim().length !== 0)
     return false;
    return true;
  }

  if(!replyIsEmpty(req.body.reply) || req.file) {
    const post = await Post.findById(req.params.postId).select('comments').exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
    if(indexInComments === -1) {
      return res.status(404).json({ message: 'Comment not found.'});
    }

    const user = await User.findById(req.auth.userId).select('userName').exec();

    post.comments[indexInComments].replies.push( req.file ? {
      author: {
        authorId: req.auth.userId,
        userName: user.userName
      },
      content: {
        text: req.body.reply,
        fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
      }
    } : {
      author: {
        authorId: req.auth.userId,
        userName: user.userName
      },
      content: {
        text: req.body.reply
      }
    });
    await post.save();

    res.status(200).json({ message: "Done."});
    
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
          return res.status(404).json({ message: "Post not found." });
        }

        const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if(indexInComments === -1) {
          return res.status(404).json({ message: 'Comment not found.'});
        }

        const indexInReplies = post.comments[indexInComments].replies.findIndex(reply => reply._id.toString() === req.params.replyId);
        if(indexInReplies === -1) {
          return res.status(404).json({ message: 'Reply not found.'});
        }

        // securité
        if(post.comments[indexInComments].replies[indexInReplies].author.authorId != req.auth.userId) {
          return res.status(401).json({ message: 'Unautorized.'});
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
            .then(() => res.status(200).json({message : 'Updated'}))
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

exports.deleteReply = (req, res, next) => {
  Post.findById(req.params.postId)
    .select('comments')
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
      if(indexInComments === -1) {
        return res.status(404).json({ message: 'Commentaire not found.'});
      }

      const indexInReplies = post.comments[indexInComments].replies.findIndex(reply => reply._id.toString() === req.params.replyId);
      if(indexInReplies === -1) {
        return res.status(404).json({ message: 'Reply not found.'});
      }

      // securité
      if(post.comments[indexInComments].replies[indexInReplies].author.authorId != req.auth.userId) {
        return res.status(401).json({ message: 'Unautorized.'});
      }

      post.comments[indexInComments].replies.splice(indexInReplies, 1);

      post.save()
        .then(() => { 
          res.status(200).json({message: 'Deleted.'})
        })
        .catch(error => {
          res.status(500).json({ error });
      });
    })
    .catch(error => {
      res.status(500).json({ error });
  })
}

exports.likeReply = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).select('comments').exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const indexInComments = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
    if(indexInComments === -1) {
      return res.status(404).json({ message: 'Comment not found.'});
    }

    const indexInReplies = post.comments[indexInComments].replies.findIndex(reply => reply._id.toString() === req.params.replyId);
    if(indexInReplies === -1) {
      return res.status(404).json({ message: 'Reply not found.'});
    }

    const user = await User.findById(req.auth.userId).select('userName').exec();

    const indexInLikes = post.comments[indexInComments].replies[indexInReplies].likes.findIndex(like => like.authorId.toString() === req.auth.userId);
    if (indexInLikes !== -1) {
      post.comments[indexInComments].replies[indexInReplies].likes.splice(indexInLikes, 1);
    } else {
      post.comments[indexInComments].replies[indexInReplies].likes.push({
        author: {
          authorId: req.auth.userId,
          userName: user.userName
        }
      });
    }

    await post.save();

    res.status(200).json({ message: "Done." });
  }
  catch(error) {
    res.status(500).json({ error });
  }
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
    const limit = parseInt(req.body.limit) || 20;
    const offset = parseInt(req.body.offset) || 0;

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
            { 'author.authorId': { $in: usersFollowedId.concat(usersFollowerId) } },
            { caption: { $in: searchKeys } },
          ]
        }
      ]
    }).skip(offset).limit(limit).sort({ createdAt: -1, updatedAt: -1 }).exec();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.search = async (req, res, next) => {

};

exports.discover = async (req, res, next) => {

};

exports.reel = async (req, res, next) => {

};