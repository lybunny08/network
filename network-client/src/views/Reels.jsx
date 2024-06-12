import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import SuggestionList from '../components/SuggestionList';

const Reels = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={10}>
          <Post />
        </Col>
        {/* <Col md={4}>
          <SuggestionList />
        </Col> */}
      </Row>
    </Container>
  );
};

export default Reels;