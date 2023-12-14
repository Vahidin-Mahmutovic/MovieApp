const express = require('express')

const HttpError = require('../models/http-error')

const usersControllers = require('../controllers/users-controller')
const { check } = require('express-validator')


const router = express.Router()


router.get('/', 
    [
        check('name')
        .not()
        .isEmpty(),
        check('email')
        .normalizeEmail()
        .isEmail(),
        check('password').isLength({ min: 6 })
    ]
    ,usersControllers.getUsers)

router.post('/signup', usersControllers.signup)

router.post('/login', usersControllers.login)



module.exports = router;