import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Post = () => {
  const [likes, setLikes] = useState(714949);
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
    <Card className="border-0 mb-4">
      <div className="d-flex mb-3 mt-2">
        <img src="https://via.placeholder.com/50" alt="Avatar" className="rounded-circle me-2" />
        <span className="align-items-center mt-2">@mamtina</span>
      </div>
      <Card.Img variant="top" src="https://via.placeholder.com/468x468" style={{ objectFit: 'cover', height: '400px' }} />
      <Card.Body className="p-0">
        <div className="d-flex justify-content-start align-items-center mb-2 px-3">
          <Button variant="link" onClick={handleLike} className="text-danger me-2 p-0">
            <FaHeart className="me-1" />
          </Button>
          <Button variant="link" onClick={handleComment} className="text-primary me-3 p-0">
            <FaComment className="me-1" />
          </Button>
          <Button variant="link" onClick={handleShare} className="text-success p-0">
            <FaShare className="me-1" />
          </Button>
        </div>
        <div className="d-flex justify-content-start px-3">
        <div className="text-muted small">cbum • Don't stress in the face of adversity...plus</div>
          
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;