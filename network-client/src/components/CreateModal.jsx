import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import img4 from '../assets/img4.png';

const CreateModal = ({ show, onHide }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('image');
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 200;

  const [hashtags, setHashtags] = useState('');
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  const user = {
    avatar: img4, // Replace with user's avatar URL
    name: 'JohnDoe' // Replace with user's name
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    if (newText.length <= maxCharCount) {
      setText(newText);
      setCharCount(newText.length);
    }
  };

  const handleHashtagChange = (event) => {
    const newHashtags = event.target.value;
    setHashtags(newHashtags);
  };

  // Function to format hashtags
  const formatHashtags = () => {
    // Split the hashtags by space
    const words = hashtags.split(/\s+/);
    // Filter out empty words and prepend '#' to each word
    const formattedHashtags = words.filter(word => word.trim() !== '').map(word => `#${word}`);
    // Join them back into a string separated by spaces
    return formattedHashtags.join(' ');
  };

  const handlePost = () => {
    // You can access formatted hashtags using formatHashtags()
    const formattedHashtags = formatHashtags();
    // Implement your logic to post the content
    console.log('Posting...', {
      text,
      hashtags: formattedHashtags,
      selectedFile,
      fileType
    });
    // Close the modal after posting
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton className="custom-close-button">
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFileType">
                <Form.Label>Choose File Type</Form.Label>
                <Form.Control as="select" value={fileType} onChange={handleFileTypeChange}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formFile" className="mt-3">
                <Form.Label>Select {fileType.charAt(0).toUpperCase() + fileType.slice(1)}</Form.Label>
                <Form.Control type="file" accept={fileType === 'image' ? 'image/*' : 'video/*'} onChange={handleFileChange} />
              </Form.Group>
              {selectedFile && (
                <div className="mt-3">
                  {fileType === 'image' ? (
                    <img src={selectedFile} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                  ) : (
                    <video controls style={{ maxWidth: '100%', maxHeight: '400px' }}>
                      <source src={selectedFile} type={fileType === 'video' ? 'video/mp4' : 'video/webm'} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </Col>
            <Col md={6}>
                <div className="d-flex mb-3 mt-2">
                  <img src={user.avatar} alt="Avatar" className="rounded-circle me-2" style={{ width: '50px', height: '50px' }} />
                  <span className="align-items-center mt-2">@{user.name}</span>
                </div>
              <Form.Group controlId="formText">
                <Form.Label>Post Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={text}
                  onChange={handleTextChange}
                  maxLength={maxCharCount}
                  placeholder="Enter your text here..."
                  style={{ 
                    border: 'none', 
                    outline: 'none', 
                    resize: 'none',
                    boxShadow: 'none',
                  }}
                />
                <Form.Text className="text-muted">
                  {charCount}/{maxCharCount} characters
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formHashtags" className="mt-3">
                <Form.Label>Hashtags</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={hashtags}
                  onChange={handleHashtagChange}
                  placeholder="Enter hashtags here (separate with spaces)..."
                  style={{ 
                    border: 'none', 
                    outline: 'none', 
                    resize: 'none',
                    boxShadow: 'none',
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handlePost} style={{ outline: 'none', boxShadow: 'none' }}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModal;
