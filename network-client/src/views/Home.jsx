import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import Story from '../components/Story';
import SuggestionList from '../components/SuggestionList';

const Home = () => {
  return (
    <Container fluid className="h-100 d-flex flex-column mt-2">
      <Story />
      <div className="flex-grow-1 overflow-auto">
        <Row className="mx-0">
          <Col className="mx-5">
            <Post />
            <Post />
            <Post />
          </Col>
          <Col md={4} className="p-0">
            <div className="d-flex flex-column align-items-center">
              <SuggestionList />
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Home;