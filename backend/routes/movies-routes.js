const express = require('express')
const { check } = require('express-validator')

const HttpError = require('../models/http-error')

const moviesControllers = require('../controllers/movies-controller')
const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const router = express.Router()



router.get('/', moviesControllers.getMovies)

router.get('/:mid', moviesControllers.getMovieById)
router.get('/user/:uid', moviesControllers.getMoviesByUserId)

router.use(checkAuth)

router.post('/', fileUpload.single('image'),
    [
        check('title')
        .not()
        .isEmpty(),
    check('description').isLength({min: 5}),
    check('year')
    .not()
    .isEmpty()
    
    
    ],
     moviesControllers.createMovie
     )

router.patch('/:mid', check('title').not().isEmpty(), check('description').isLength({min: 5}), check('year').not().isEmpty(),moviesControllers.updateMovieById)

router.delete('/:mid', moviesControllers.deleteMovie)


module.exports = router;