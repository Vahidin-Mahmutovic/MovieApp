import {React, useState} from "react";
import ListItems from "../components/ListItems";
import { useGlobalContext } from "../../shared/context";
import Pagination from "../../shared/Pagination";
import './Movies.css'
import Search from "../../shared/FormElements/Search";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

const Movies = () => {
    const {loadedMovies, newItemsArray, isLoading} = useGlobalContext()
    const [error, setError] = useState()
  
    const clearError = () =>{
      setError(null)
    }
     
    return (
      <>
       
    <div className="movies_page">
     <Search/>
     <ErrorModal error= {error} onClear = {clearError}/>
     {isLoading && (
       <div className='center'>
         <LoadingSpinner/>
       </div>
      )}
      {!isLoading && loadedMovies && (
         <ListItems movies={newItemsArray} />
      )}
      <div className="pagination">
      <Pagination />
      </div>
   
    </div>
    </>
    )
    }
    

export default Movies