import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import SuggestionList from '../components/SuggestionList';

const Reels = () => {
  return (
    <div style={{ marginLeft: '240px', paddingTop: '0', marginTop: '0' }}>
        <Col md={10}>
          <Post />
          <Post />
          <Post />
        </Col>
    </div>
  );
};

export default Reels;