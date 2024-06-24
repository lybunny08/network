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
    <>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="mb-2" style={{ width:"100%"}}>
          <button type='button' className='d-flex' style={{ width:"100%"}}>
            <div id='img'>
              <img src={suggestion.avatar} 
                alt={suggestion.name} 
                style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px' }} />
            </div>
            <div className="text-muted small">{suggestion.name}</div>
          </button>
        </div>
      ))}
    </>
  );
};

export default SuggestionList;