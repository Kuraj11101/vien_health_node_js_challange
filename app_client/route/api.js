const express = require('express');
const router = express.Router();
const User = require('../models/users/user');
const mongoose = require('mongoose');
const db = "mongodb://localhost:27017/data";
mongoose.connect(db, err => {
    if (err) {
        console.log('Error in connect the database' + err);
    } else {
        console.log('Connected to Mongodb');
    }
});

router.get('/', (req, res) => {
    res.send("From API router")
});


router.post('/register', (req, res) => {
    User.find({"email": req.body.email})
        .then(
            result => {
                console.log(result.length);
                if (result.length !== 0) {
                    res.json({
                        message: 'Email already exists',
                        status: false
                    })

                } else {
                    let userData = (req.body.name, req.body.email, req.body.password)
                    let user = new User(userData)
                    user._id = new mongoose.Types.ObjectId()
                    console.log(user);
                    user.save()
                        .then(
                            result => {
                                res.json({
                                   message: 'User register success',
                                   status: true,
                                   send: (userData)
                                })
                            }
                        )
                        .catch(
                            error => {
                                res.json({
                                   message: ' User Register fail',
                                   status: false,
                                })
                            }
                        )
                }
            }
        )
        .catch(
            error => {
                res.json({
                    message: ' User Register fail',
                    status: false,

                })
            }
        )
});
module.exports = router;