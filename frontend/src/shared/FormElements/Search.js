import React from 'react'
import { useGlobalContext } from '../context'

const Search = () => {
    const {setSearch} = useGlobalContext()
  
    return (
        <input className='search' type='text' placeholder='Search movies...' onChange={(e)=> setSearch(e.target.value)}/>

        
  )
}

export default Search