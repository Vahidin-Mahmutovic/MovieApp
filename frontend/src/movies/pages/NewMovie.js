import React, {useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../shared/FormElements/Input'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators' 
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/auth-context'
import ImageUpload from '../../shared/FormElements/ImageUpload'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner'
import './NewMovie.css'
import Button from '../../shared/UIElements/Button'
import { useGlobalContext } from '../../shared/context'


const NewMovie = () => {
     const auth = useContext(AuthContext);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState();
     const {refetchMovies} = useGlobalContext()
     const [formState, inputHandler] = useForm(
        {
          title: {
               value: '',
               isValid: false
          },
          description: {
               value: '',
               isValid: false
          },
          year: {
               value: '',
               isValid: false
          },
          image: {
               value: null,
               isValid: false
          }
        },
        false
     )
    
        const navigate = useNavigate()
       
    

     const newMovieSubmitHandler = async event =>{
          event.preventDefault()
          
        try{
         
         const formData = new FormData()
         formData.append('title', formState.inputs.title.value)
          formData.append('description', formState.inputs.description.value)
          formData.append('year', formState.inputs.year.value)
          
          formData.append('image', formState.inputs.image.value)
         
       const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/movies',{
               method: 'POST',
               headers: {
               
                   
                     'Authorization': 'Bearer ' + auth.token
               },
               body: formData
          })

        const responseData = await response.json()
          console.log(responseData)
          setIsLoading(false)
         
          navigate('/')
          refetchMovies()
        
        } catch (err){
          console.log(err)
          setError(err.message || 'Something went wrong, please try again.');
          setIsLoading(false);  
          
     }
       
     }
     
     const clearError = () => {
          setError(null)
     }

      return (
   <>
   <ErrorModal error={error} onClear={clearError}/>
   <form className='form-container' onSubmit={newMovieSubmitHandler}>
     <h1 className='form-title'>Add New Movie</h1>
       {isLoading && <LoadingSpinner asoverlay/>}
        <Input
             id="title"
             element="input" 
             type="text" 
             label="Title" 
             validators={[VALIDATOR_REQUIRE()]} 
             errorText="Please enter a valid title."
             onInput= {inputHandler}
        />
         <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image."/>
          <Input
             id="description"
             element="textarea" 
             label="Description" 
             validators={[VALIDATOR_MINLENGTH(5)]} 
             errorText="Please enter a valid description (at least 5 characters)."
             onInput= {inputHandler}
          />
          <Input
             id="year"
             element="input" 
             label="Year" 
             validators={[VALIDATOR_REQUIRE()]} 
             errorText="Please enter a year."
             onInput= {inputHandler}
          />
          <Button disabled={!formState.isValid} type='submit' >AddMovie</Button>
   </form>
   </>
  )
}

export default NewMovie