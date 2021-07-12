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


router.post('/register', (req, res, next ) => {
    const { email, passwordHash } = req.body;
    const user = new User({ email });
    user.setPassword(password);
    user.save().then(userRecord => {
        res.json({user: userRecord.toAuthJSON()})
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })

});
module.exports = router;