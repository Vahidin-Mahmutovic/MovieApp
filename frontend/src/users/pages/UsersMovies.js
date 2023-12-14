import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import ListItems from '../../movies/components/ListItems'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner'
import './UserMovies.css'


const UsersMovies = () => {
  const [loadedMovies, setLoadedMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()
  const userId = useParams().userId;
  console.log(loadedMovies)
  useEffect(() =>{
    const fetchMovies = async () => {
    
    try {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/movies/user/${userId}`)
    const responseData = await response.json()
    setLoadedMovies(responseData.movies)
    setIsLoading(false)
    } catch (err) {}
}
    fetchMovies()
   
}, [ userId])
  
const clearError = () =>{
  setError(null)
}

  return (
   <>
   <ErrorModal error= {error} onClear = {clearError}/>
   {isLoading && (
    <div className='center'>
      <LoadingSpinner/>
    </div>
   )}
   <div className='users_movies'>
   {!isLoading && loadedMovies && (
      <ListItems movies={loadedMovies} />
   )}
    </div>
    </>
  )
}

export default UsersMovies