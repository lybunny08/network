import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import SuggestionList from '../components/SuggestionList';

const Home = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <Post />
        </Col>
        <Col md={4}>
          <SuggestionList />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;