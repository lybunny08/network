import React from 'react';
import { ListGroup } from 'react-bootstrap';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';

const SuggestionList = () => {
  const suggestions = [
    { name: 'sarahtxxxx646', avatar: img1 },
    { name: 'rojormiadamahefla', avatar: img2 },
    { name: 'gregoire_d_cekah', avatar: img3 },
    { name: 'julia_sdr', avatar: img4 },
    // Ajoutez d'autres suggestions au besoin
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
