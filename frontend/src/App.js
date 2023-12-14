import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import './App.css'
import Navigation from "./shared/Navigation/Navigation";
//import Movies from "./movies/pages/Movies";
//import MovieDetails from "./movies/pages/MovieDetails";
//import UsersMovies from "./users/pages/UsersMovies";
//import NewMovie from "./movies/pages/NewMovie";
//import Login from "./users/pages/Login";
//import Register from "./users/pages/Register";
import { AuthContext } from "./shared/auth-context";
import LoadingSpinner from "./shared/UIElements/LoadingSpinner";
//import UpdateMovie from "./movies/pages/UpdateMovie";


const Movies = React.lazy(() => import('./movies/pages/Movies'))
const MovieDetails = React.lazy(() => import('./movies/pages/MovieDetails'))
const UsersMovies = React.lazy(() => import('./users/pages/UsersMovies'))
const NewMovie = React.lazy(() => import('./movies/pages/NewMovie'))
const Login = React.lazy(() => import('./users/pages/Login'))
const Register = React.lazy(() => import('./users/pages/Register'))
const UpdateMovie = React.lazy(() => import('./movies/pages/UpdateMovie'))


let logoutTimer

function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState()
  const [userId, setUserId] = useState(false); 



  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate}))
    setUserId(uid)
    
    
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null)
    localStorage.removeItem('userData')
  }, []);

  useEffect(()=>{
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    }else {
      clearTimeout(logoutTimer)
    }
  },[token, logout, tokenExpirationDate])

  useEffect(()=> {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if(storedData && storedData.token  && new Date(storedData.expiration) > new Date()){
      login(storedData.userId, storedData.token)
    }
  },[login])

  let routes

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Movies />} exact/>
        <Route path="/movies/:movieId" element={<MovieDetails/>}/>
        <Route path="/:userId/movies" element={<UsersMovies />} />
        <Route path="/movies/new" element={<NewMovie />} />
        <Route path="/movies/update/:movieId" element={<UpdateMovie/>}/>
        <Route path="/login" element={<Navigate to='/' />} />
        <Route path="/register" element={<Navigate to='/login' />} />
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Movies />} exact/>
        <Route path="/movies/:movieId" element={<MovieDetails/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/movies/new" element={<Navigate to='/' />} />
        <Route path="/:userId/movies" element={<Navigate to='/' />} />
        <Route path="*" element={<Navigate to="/" />}/>
       
      </Routes>
    );
  }

  return (
    <AuthContext.Provider value={{  
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout }}>
      
        <Navigation />
        <main><Suspense fallback={
         <div className="center"><LoadingSpinner/></div> 
        }>{routes}</Suspense></main>
      
    </AuthContext.Provider>
  );
}

export default App;
