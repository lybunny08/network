import React, { useState } from 'react';
import { Card, Button, Form, Image } from 'react-bootstrap';
import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';

const Post = () => {
  const initialPosts = [
    { name: 'sarahtxxxx646', avatar: img1, img: img1, caption: "Amazing day at the beach!", likes: 0, comments: [] },
    { name: 'rojormiadamahefla', avatar: img2, img: img2, caption: "Loving the new adventure!", likes: 0, comments: [] },
    { name: 'gregoire_d_cekah', avatar: img3, img: img3, caption: "Exploring new horizons!", likes: 0, comments: [] },
    { name: 'julia_sdr', avatar: img4, img: img4, caption: "Another beautiful sunset!", likes: 0, comments: [] },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [newComment, setNewComment] = useState('');

  const handleLike = (index) => {
    const newPosts = [...posts];
    newPosts[index].likes += 1;
    setPosts(newPosts);
  };

  const handleAddComment = (index, comment) => {
    if (comment.trim() === '') return; // Prevent adding empty comments

    const newPosts = [...posts];
    const userComment = {
      avatar: img1, // Change to the current user's avatar
      username: 'current_user', // Change to the current user's name
      text: comment,
    };
    newPosts[index].comments.push(userComment);
    setPosts(newPosts);
    setNewComment('');
  };

  const handleShare = () => {
    alert('Publication partagée !');
  };

  return (
    <>
      {posts.map((post, index) => (
        <Card className="border-0 mb-4" key={index}>
          <div className="d-flex mb-3 mt-2">
            <img src={post.avatar} alt="Avatar" className="rounded-circle me-2" style={{ width: '50px', height: '50px' }} />
            <span className="align-items-center mt-2">@{post.name}</span>
          </div>
          <Card.Img variant="top" src={post.img} style={{ objectFit: 'cover', height: '400px' }} />
          <Card.Body className="p-0">
            <div className="d-flex justify-content-start align-items-center mb-2 px-3">
              <Button variant="link" className="me-2 p-0" onClick={() => handleLike(index)}>
                <AiOutlineHeart className="me-1" style={{ fontSize: '25px' }} />
                <span>{post.likes}</span>
              </Button>
              <Button variant="link" className="me-3 p-0">
                <AiOutlineComment className="me-1" style={{ fontSize: '25px' }} />
              </Button>
              <Button variant="link" onClick={handleShare} className="p-0">
                <AiOutlineShareAlt className="me-1" style={{ fontSize: '25px' }} />
              </Button>
            </div>
            <div className="d-flex flex-row justify-content-start px-3">
              <div className="text-muted small">{post.name}</div>
              <div className="text-muted small mx-3">{post.caption}</div>
            </div>
            <div className="px-3">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="d-flex mb-2">
                  <Image src={comment.avatar} roundedCircle style={{ width: '30px', height: '30px' }} className="me-2" />
                  <div>
                    <span className="fw-bold">{comment.username}</span> {comment.text}
                  </div>
                </div>
              ))}
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment(index, newComment);
                }}
              >
                <Form.Group className="mb-3 d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button variant="primary" type="submit" className="ms-2">
                    Publier
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default Post;
