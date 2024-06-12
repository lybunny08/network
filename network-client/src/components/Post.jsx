import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Post = () => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = () => {
    setComments(comments + 1);
  };

  const handleShare = () => {
    // Ajouter votre logique de partage ici
    alert('Publication partagée !');
  };

  return (
    <Card>
      <Card.Img variant="top" src="https://via.placeholder.com/600x400" />
      <Card.Body>
        <Card.Title>Titre de la publication</Card.Title>
        <Card.Text>Contenu de la publication...</Card.Text>
        <div className="d-flex justify-content-between">
          <Button variant="outline-danger" onClick={handleLike}>
            <FaHeart className="me-1" /> J'aime
          </Button>
          <Button variant="outline-primary" onClick={handleComment}>
            <FaComment className="me-1" /> Commenter ({comments})
          </Button>
          <Button variant="outline-success" onClick={handleShare}>
            <FaShare className="me-1" /> Partager
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
