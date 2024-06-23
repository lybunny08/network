import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../components/Post';
import Story from '../components/Story';
import SuggestionList from '../components/SuggestionList';

const Home = () => {
  return (
    <div 
      className="d-flex flex-row overflow-y-scroll overflow-x-hidden justify-content-around" 
      style={{ height: '38em',  paddingLeft:'4.5em', marginRight:"20px", width:"100%" }}>
      <div id='home-main'
        className='mt-3'>
          <Story />
          <Post />
      </div>
      <div className='mt-5'>
        <SuggestionList />
      </div>
    </div>
  );
};

export default Home;