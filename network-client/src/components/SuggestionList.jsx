import React from 'react';
import { ListGroup } from 'react-bootstrap';

const SuggestionList = () => {
  const suggestions = [
    { name: 'Utilisateur 1', avatar: 'https://via.placeholder.com/50' },
    { name: 'Utilisateur 2', avatar: 'https://via.placeholder.com/50' },
    { name: 'Utilisateur 3', avatar: 'https://via.placeholder.com/50' },
    // Ajoutez d'autres suggestions ici
  ];

  return (
    <ListGroup>
      {suggestions.map((suggestion, index) => (
        <ListGroup.Item key={index}>
          <img src={suggestion.avatar} alt={suggestion.name} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
          {suggestion.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SuggestionList;