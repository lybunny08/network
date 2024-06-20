import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';

const Post = () => {
  const posts = [
    { name: 'sarahtxxxx646', avatar: img1, img: img1, caption: "Amazing day at the beach!" },
    { name: 'rojormiadamahefla', avatar: img2, img: img2, caption: "Loving the new adventure!" },
    { name: 'gregoire_d_cekah', avatar: img3, img: img3, caption: "Exploring new horizons!" },
    { name: 'julia_sdr', avatar: img4, img: img4, caption: "Another beautiful sunset!" },
    // Ajoutez d'autres suggestions au besoin
  ];

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
              <Button variant="link" className="me-2 p-0">
                <AiOutlineHeart className="me-1" style={{ fontSize: '25px' }} />
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
              <div className="text-muted small mx-3"> {post.caption}</div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default Post;