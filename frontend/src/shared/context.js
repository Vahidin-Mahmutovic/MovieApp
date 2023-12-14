import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AppContext = React.createContext()


const AppProvider = ({children}) =>{


    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()
    const [loadedMovies, setLoadedMovies] = useState([])
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; 
    
    const userId = useParams().userId
   
    const sendRequest = async () => {
      setIsLoading(true)
      
      try {
        
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/movies')
      const responseData = await response.json()
       
     
      setLoadedMovies(responseData.movies)
      
    
      } catch (err) {
         
          setError(err.message)
      } finally {
        setIsLoading(false);
      }
  }

    useEffect(() =>{
        sendRequest()
    },[userId])

   
        const lastIndex = currentPage * itemsPerPage;  
        const firstIndex = lastIndex - itemsPerPage;   
        const newItemsArray = loadedMovies.slice(firstIndex,lastIndex)
        const npage = Math.ceil(loadedMovies.length / itemsPerPage)
        const numbers = [...Array(npage + 1).keys()].slice(1)
    
    
    return <AppContext.Provider value={{
           
            isLoading,
            setIsLoading,
            error,
            setError,
            loadedMovies,
            setLoadedMovies,
            numbers,
            newItemsArray,
            setCurrentPage,
            currentPage,
            npage,
            refetchMovies: sendRequest,
            setSearch,
            search
               
          
              }}>{children}</AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}


export {AppContext, AppProvider}