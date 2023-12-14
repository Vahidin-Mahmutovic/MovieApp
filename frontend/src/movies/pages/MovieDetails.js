import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalContext } from '../../shared/context';
import { Link } from 'react-router-dom';
import './MovieDetails.css'
import { AuthContext } from '../../shared/auth-context';
import Button from '../../shared/UIElements/Button';


import Modal from '../../shared/UIElements/Modal';

const MovieDetails = () => {
  const { loadedMovies, refetchMovies} = useGlobalContext();
  const auth = useContext(AuthContext);
  const { movieId } = useParams();
 
  const item = loadedMovies.find((item) => item.id === movieId);
 
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const navigate = useNavigate()

  const showDeleteWarningHandler = () =>{
    setShowConfirmModal(true)
    }
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false)
    }
  const deleteHandler = async () => {
    setShowConfirmModal(false)
  try {
     await fetch(process.env.REACT_APP_BACKEND_URL + `/movies/${movieId}`,{
             method: 'DELETE',
             headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + auth.token
             },
        })
      navigate('/')
      refetchMovies()
  } catch (err) {}
};

return (
  <>
    
  <section className="single-movie">
    <img src={process.env.REACT_APP_BACKEND_URL + `/${item.image}`} alt={item.title} />
      <div className="single-movie-info">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <h4>{item.year}</h4>
       
       
        <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure ?"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={deleteHandler}>
              DELETE
            </Button>
          </>
        }
        >
          <p>
            Do you want to proceed and delete this movie ? Please note that it can't be undone thereafter.
          </p>
        </Modal>

        <div className='editdelete'>  
       
         {auth.userId === item.creator &&(
        <Button to={`/movies/update/${movieId}`}>EDIT</Button>)}

         {auth.userId === item.creator &&(
        <Button danger onClick={showDeleteWarningHandler}>Delete</Button>)}
       </div>
     
       <Link to='/' className="backLink" >
          Back to movies
        </Link>
    </div>
   
 </section>

 </>
  

   
    
)
}

export default MovieDetails