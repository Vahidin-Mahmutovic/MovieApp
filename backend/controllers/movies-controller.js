const HttpError = require('../models/http-error')
const uuid = require('uuid')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Movie = require('../models/movie')
const User = require('../models/user')
const fs = require('fs')

const getMovies = async (req,res, next)=> {
let movies;
try {
  movies = await Movie.find({});
} catch (err) {
  const error = new HttpError(
    'Fetching movies failed, please try again later.',
    500
  );
  return next(error);
}
res.json({movies: movies.map(movie => movie.toObject({ getters: true }))});
}

const getMovieById = async (req,res, next)=> {
    const movieId = req.params.mid;

    let movie;
   try{
    movie = await Movie.findById(movieId)
   } catch(err){
    const error = new HttpError('Something went wrong, could not find a movie.', 500)
    return next(error)
    }

    if(!movie){
     const error = new Error('Could not find a movie for provided id.', 404)
    return next(error)
    } else {
     res.json({ movie: movie.toObject({ getters: true})})
    }
 }

 const getMovieByUserId = async (req,res, next) => {
    const userId = req.params.uid;

    let userWithMovies
    try {
         userWithMovies = await User.findById(userId).populate('movies')
    } catch (err) {
        const error = new HttpError('Fetching movies failed, please try again later',500)
        return next(error)
    }

    if(!userWithMovies || userWithMovies.movies.length === 0){
        return next(
            new HttpError('Could not find a movie for the provided user id', 404)
        )
    }
    res.json({ movies: userWithMovies.movies.map(movie => movie.toObject({getters: true})) })
}

const createMovie = async (req,res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new HttpError('Invalid inputs.', 422)
    
        return next(error);
    }

    const {title, description,year } = req.body;

  const createdMovie = new Movie({
    title,
    description,
    year,
    image: req.file.path,
    creator:req.userData.userId
  })  

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Creating movie failed, please try again',500)
    return next(error);
}

    if(!user){
        const error = new HttpError('Could not find user for provided id', 404)
        return next(error);
    }

    console.log(user)

 

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdMovie.save({ session: sess });
        user.movies.push(createdMovie);
        await user.save({ session: sess });
        await sess.commitTransaction();
    }catch(err){
       const error = new HttpError('Creating movie failed, please try again.', 500)
    
       return next(error);
    }

    
    res.status(201).json({movie: createdMovie})
}

const updateMovieById = async (req,res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        const error = new HttpError('Invalid inputs passed, please check your data.', 422)
        return next(error)
    }

    const { title, description,year } = req.body;
    const movieId = req.params.mid;

    let movie;
    try {
        movie = await Movie.findById(movieId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update movie.', 500)
    return next(error)
    }

    if(movie.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed to edit this plae.', 401)
        return next(error)
    }

    movie.title = title;
    movie.description = description;
    movie.year = year;

    try {
        await movie.save()
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place.', 500)
        return next(error)
    }

    res.status(200).json({movie: movie.toObject({getters: true})})
}

const deleteMovie = async (req, res, next) => {
    const movieId = req.params.mid;
   
    let movie;
    try{
        movie = await Movie.findById(movieId).populate('creator')
    } catch (err){
        const error = new HttpError('Something went wrong, could not delete movie.', 500)
        return next(error)
    }

    if(!movie){
        const error = new HttpError('Could not find movie for this id.', 404)
        return next(error)
    }

    if(movie.creator.id !== req.userData.userId){
        const error = new HttpError('You are not allowed to delete this movie.', 401)
        return next(error)
    }

    const imagePath = movie.image

    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await movie.deleteOne({session: sess})
      movie.creator.movies.pull(movie);
      await movie.creator.save({session: sess})
      await sess.commitTransaction()
    }catch (err){
        const error = new HttpError('Something went wrong, could not delete movie.', 500)
        console.log(err.message)
        return next(error)
    }

    fs.unlink(imagePath, err => {
        console.log(err)
    })
    res.status(200).json({message: "Deleted movie."})
}


exports.getMovieById = getMovieById;
exports.getMoviesByUserId = getMovieByUserId;
exports.createMovie = createMovie;
exports.updateMovieById = updateMovieById;
exports.deleteMovie = deleteMovie;
exports.getMovies = getMovies;