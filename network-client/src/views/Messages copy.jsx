import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Messages = () => {
  return (
    <Container fluid className="d-flex flex-column mt-2">
      <div className='row'>
        <div className='col' id="chat-list">
          <div id='chat-list-header' className='mt-5'>
            <h5>Malcovys Bonely</h5>
            <input type="text" className='mt-2' id="chat-search"/>
          </div>
          <div id='chat-list-body'>
            <div className='row' >
              <span className='col'>Messages</span>
              <span className='col'>Demandes</span>
            </div>
            <div id='chat-list'>
              <div className="py-2 px-3 d-flex" id='chat-card'>
                <img  alt='image' style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '15px' }} />
                <div className='d-flex flex-column'>
                  <span className="fs-6">UserName</span>
                  <span className='text-muted small'>last message</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div className='col' id='chat-view'>
          <p>chat veiw</p>
        </div>
      </div>
      </Container>
  );
};

export default Messages;