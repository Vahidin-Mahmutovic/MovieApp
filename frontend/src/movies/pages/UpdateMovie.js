import React, { useContext, useEffect, useState } from 'react';

import Input from '../../shared/FormElements/Input'
import Button from '../../shared/UIElements/Button';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { AuthContext } from '../../shared/auth-context';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hook';
import { useGlobalContext } from '../../shared/context';

const UpdateMovie = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadedMovie, setLoadedMovie] = useState();
  const [error, setError] = useState();
  const { movieId } = useParams();
  const { refetchMovies } = useGlobalContext();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      year: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();
    
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/movies/${movieId}`);
        const responseData = await response.json();
        setLoadedMovie(responseData.movie);
        console.log(responseData.movie.title)
        setFormData(
          {
            title: {
              value: responseData.movie.title,
              isValid: true,
            },
            description: {
              value: responseData.movie.description,
              isValid: true,
            },
            year: {
              value: responseData.movie.year,
              isValid: true,
            }
          },
          true
        );

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      }
    };

    fetchMovie();
  }, [movieId, setFormData]);

  const movieUpdateHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      await fetch(process.env.REACT_APP_BACKEND_URL + `/movies/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token,
        },
        body: JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          year: formState.inputs.year.value,
        }),
      });

      setIsLoading(false);
      navigate('/');
      refetchMovies();
    } catch (err) {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoadedMovie && !error) {
    return (
      <div className='center'>
        <h2>Could not find movie!</h2>
      </div>
    );
  }

  const clearError = () => {
    setError(false);
  };

  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    {!isLoading && isLoadedMovie && (
      <form className='form-container' onSubmit={movieUpdateHandler}>
        <h1 className='form-title'>Update Movie</h1>
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title.'
          onInput={inputHandler}
          initialValue={isLoadedMovie.title}
          initialValid={true}
        />

        <Input
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description (at least 5 characters).'
          onInput={inputHandler}
          initialValue={isLoadedMovie.description}
          initialValid={true}
        />
        <Input
          id='year'
          element='input'
          label='Year'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a year.'
          onInput={inputHandler}
          initialValue={isLoadedMovie.year}
          initialValid={true}
        />
        <Button type='submit' disabled={!formState.isValid}>
          UPDATE MOVIE
        </Button>
      </form>
    )}
  </>
  );
};

export default UpdateMovie;
