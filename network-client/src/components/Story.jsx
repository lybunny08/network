import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Story = () => {
  const suggestions = [
    { name: 'sarahtxxxx646', avatar: 'https://via.placeholder.com/50' },
    { name: 'roformiadamahefla', avatar: 'https://via.placeholder.com/50' },
    { name: 'gregoire_d_cekah', avatar: 'https://via.placeholder.com/50' },
    { name: 'julia_sdr', avatar: 'https://via.placeholder.com/50' },
    { name: 'infantsoehergc', avatar: 'https://via.placeholder.com/50' },
  ];

  return (
    <ListGroup className="border-0 mb-3 d-flex flex-row justify-content-start">
      {suggestions.map((suggestion, index) => (
        <ListGroup.Item key={index} className="border-0 px-2 px-md-3 text-center">
          <div className="d-flex flex-column align-items-center">
            <div className="rounded-circle overflow-hidden border border-primary border-3 mb-2" style={{ width: '55px', height: '55px' }}>
              <img src={suggestion.avatar} alt={suggestion.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="text-muted small">{suggestion.name}</span>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Story;
