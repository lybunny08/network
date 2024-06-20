import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';

const Story = () => {
  const truncateName = (name) => {
    return name.length > 9 ? name.slice(0, 9) + '...' : name;
  };

  const suggestions = [
    { name: 'sarahtxxxx646', avatar: img1 },
    { name: 'roformiadamahefla', avatar: img2 },
    { name: 'gregoire_d_cekah', avatar: img3 },
    { name: 'julia_sdr', avatar: img4 },
    { name: 'infantsoehergc', avatar: img1 },
    { name: 'sarahtxxxx646', avatar: img1 },
    { name: 'roformiadamahefla', avatar: img2 },
    { name: 'gregoire_d_cekah', avatar: img3 },
    { name: 'julia_sdr', avatar: img4 },
    { name: 'infantsoehergc', avatar: img1 },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 8;

  const handleNextClick = () => {
    setStartIndex(prevIndex => prevIndex + itemsPerPage);
  };

  const handlePrevClick = () => {
    setStartIndex(prevIndex => Math.max(0, prevIndex - itemsPerPage));
  };

  const hasMoreSuggestions = startIndex + itemsPerPage < suggestions.length;
  const showPrevButton = startIndex > 0;

  return (
    <div className="d-flex align-items-center">
      {showPrevButton && (
        <div
          className="rounded-circle mx-2"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: '#007bff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff', // Couleur du texte en blanc
          }}
          onClick={handlePrevClick}
        >
          <i className="fas fa-chevron-left"></i>
        </div>
      )}

      <ListGroup className="border-0 mb-3 d-flex flex-row justify-content-start">
        {suggestions.slice(startIndex, startIndex + itemsPerPage).map((suggestion, index) => (
          <ListGroup.Item key={index} className="border-0 px-2 md-2 text-center">
            <div className="d-flex flex-column align-items-center">
              <div className="rounded-circle overflow-hidden border border-primary border-3 mb-2" style={{ width: '56px', height: '56px' }}>
                <img src={suggestion.avatar} alt={suggestion.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span className="text-muted small" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                {truncateName(suggestion.name)}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {hasMoreSuggestions && (
        <div
          className="rounded-circle mx-2"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: '#007bff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff', // Couleur du texte en blanc
          }}
          onClick={handleNextClick}
        >
          <i className="fas fa-chevron-right"></i>
        </div>
      )}
    </div>
  );
};

export default Story;
