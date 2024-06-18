import React from 'react';
import { ListGroup } from 'react-bootstrap';

const SuggestionList = () => {
  const suggestions = [
    { name: 'sarahtxxxx646', avatar: 'https://via.placeholder.com/50' },
    { name: 'rojormiadamahefla', avatar: 'https://via.placeholder.com/50' },
    { name: 'gregoire_d_cekah', avatar: 'https://via.placeholder.com/50' },
    { name: 'julia_sdr', avatar: 'https://via.placeholder.com/50' },
    { name: 'infantsoehergc', avatar: 'https://via.placeholder.com/50' },
  ];

  return (
    <ListGroup className="border-0 mb-3 mt-0 mx-5">
      {suggestions.map((suggestion, index) => (
        <ListGroup.Item key={index} className="border-0 py-2 px-3 d-flex align-items-center">
          <img src={suggestion.avatar} alt={suggestion.name} style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px' }} />
          <span className="text-muted small">{suggestion.name}</span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SuggestionList;