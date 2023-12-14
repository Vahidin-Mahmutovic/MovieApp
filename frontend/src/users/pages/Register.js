import React,{useContext,useState} from 'react'

import { AuthContext } from '../../shared/auth-context'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner'
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL,VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import Input from '../../shared/FormElements/Input'
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/UIElements/Button'
import { useNavigate } from 'react-router-dom'
import './RegisterLogin.css'



const Register = () => {
    const auth = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
  
    const [formState, inputHandler] = useForm(
      {
        name:{
        value: '',
        isValid: false
        },
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      },
      false
    );
    const navigate = useNavigate()
    const registerHandler = async event=> {
        event.preventDefault()
        try {
          setIsLoading(true);
       
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/users/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
              })
            });
    
            const responseData = await response.json();
            if (!response.ok) {
              throw new Error(responseData.message);
            }
            setIsLoading(false);
            
            auth.login(responseData.userId, responseData.token);
            auth.logout()
            navigate('/login')
            console.log(responseData)
            
          } catch (err) {
            setIsLoading(false);
            setError(err.message || 'Something went wrong, please try again.');
          }
    }
    
    const clearError = () =>{
      setError(null)
    }

  return (
    <>
    {isLoading && <LoadingSpinner asOverlay />}
    <ErrorModal error={error} onClear={clearError} />
    <div className='form-container'>
    <form className='form' onSubmit={registerHandler}>
    <h2>Register</h2>
    
        <Input
          element="input"
          id="name"
          type="text"
          label="Your Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a name."
          onInput={inputHandler}
        />
      
      <Input
        element="input"
        id="email"
        type="email"
        label="E-Mail"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email address."
        onInput={inputHandler}
      />
      <Input
        element="input"
        id="password"
        type="password"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid password, at least 5 characters."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        REGISTER
      </Button>
    </form>
    </div>
      </>

  )
}

export default Register