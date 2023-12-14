import React from 'react';
import './ListItems.css';
import SingleItem from './SingleItem';
import { useGlobalContext } from '../../shared/context';

const ListItems = (props) => {
  const { search, loadedMovies } = useGlobalContext();

  const filterMovies = () => {
    return loadedMovies.filter(
      (item) =>
        search.toLowerCase() === '' ||
        item.title.toLowerCase().includes(search.toLowerCase())
    );
  };


  const paginatedMovies = props.movies; 
  const filteredMovies = filterMovies(paginatedMovies);

  return (
    <>
      <ul className='list-items'>
        {search ? filteredMovies.map((movie) => (
          <SingleItem
            key={movie.id}
            id={movie.id}
            image={movie.image}
            title={movie.title}
            year={movie.year}
            creator={movie.creator}
          />
        ))
        :
        paginatedMovies.map((movie) => (
            <SingleItem
              key={movie.id}
              id={movie.id}
              image={movie.image}
              title={movie.title}
              year={movie.year}
              creator={movie.creator}
            />
          ))
        }
      </ul>
    </>
  );
};

export default ListItems;
