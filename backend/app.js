const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const moviesRoutes = require('./routes/movies-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')
const cors = require('cors')
const path = require('path')
const app = express()
require('dotenv').config();

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use(cors())

app.use('/movies', moviesRoutes)
app.use('/users', usersRoutes)

app.use((req,res, next)=> {
    const error = new HttpError('Could not find this route', 404)
    throw error
})


app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, () =>{
            console.log(error)
        })
    }

    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unkwnown error occured!'});
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tfoncmh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,)
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err)
    })
