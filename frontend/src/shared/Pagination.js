import React from "react";
import { useGlobalContext } from "./context";
import './Pagination.css'

const Pagination = () => {
    const {numbers, setCurrentPage, currentPage} = useGlobalContext()  
    
    return (
      <nav className="pagination">
        <ul>
          
            {
              numbers.map((number, index)=>{
                return( <li key={index}>
                    <a className={currentPage === number ? 'active' : ''} href="#" onClick={()=> changeCPage(number)}>
                      {number}
                    </a>
                </li>
                  )
              })
            }
          
        </ul>
      </nav>
    );
    
  

    function changeCPage (index){
      setCurrentPage(index)
    }

   

  };

export default Pagination;