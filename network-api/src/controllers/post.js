const Post = require('../models/Post');

exports.createPost = (req, res, next) => {
  delete req.body._id;
  delete req.body._userId; 
  const postObject = req.file ? {
    ...JSON.parse(JSON.stringify(req.body)),
    userId: req.auth.userId,
    fileUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  } : {...JSON.parse(JSON.stringify(req.body)), userId: req.auth.userId,};

  const post = new Post(postObject);
  post.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};