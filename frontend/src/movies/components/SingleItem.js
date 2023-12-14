import React from 'react';
import { Link } from 'react-router-dom';
import './SingleItem.css';



const SingleItem = ({ id, image, title, year }) => {


  return (
    <Link to={`/movies/${id}`} className='link' >
      <div className="card">
        <img src={`http://localhost:5000/${image}`} alt={title} />
        <div className="container">
          <h4>{title}</h4>
          <p>{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default SingleItem;
