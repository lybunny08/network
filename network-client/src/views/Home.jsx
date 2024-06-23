import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import Story from '../components/Story';
import SuggestionList from '../components/SuggestionList';

const Home = () => {
  return (
    <div 
      className="d-flex flex-row overflow-y-auto" 
      style={{ height: '38em',  marginLeft:'4.5em' }}>
      <div id='home-main'
        className='mt-3'>
          <Story />
          <Post />
      </div>
      <div
        className='mt-5'>
        <SuggestionList />
      </div>
    </div>
  );
};

export default Home;