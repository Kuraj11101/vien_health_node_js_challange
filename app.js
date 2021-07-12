//Required Dependencies
const path = require('path');
const express = require('express');
var router = express.Router();
const http = require('http');
const app = express();
const cors = require('cors');
const api = require('./app_client/route/api')
const mongoose = require('mongoose');
var mongodb = require('mongodb');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('./app_client/_helpers/jwt');
const error_Handler = require('./app_client/_helpers/error_handler');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
var User = require('./app_client/models/users/user');

app.set("view engine", "html");

//Use express root file path
app.use(express.static(path.join(__dirname, '/')))

//Get root file path, return root file.
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './public'))
});

//Initiate app routes to api
app.use('/api', api);

//api routes
app.get('/api', User);

//routes
app.get("/", (req, res) =>{
	res.render("home");
})
//Auth routes
app.get("/login", (req, res) =>{
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect:"/profile",
	failureRedirect:"/login"
}), function (req, res) {

});

//Registration Router
app.get("/register", (req, res) =>{
	res.render("register");
});

app.post("/register", (req, res)=>{
	User.register(new User({name: req.body.name, email: req.body.email}),
	req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/login");
		})
	})
});

app.get("/profile", (req, res) =>{
	res.render("profile");
})

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

//MongoDB connection
mongodb.connect('mongodb://localhost:27017/data');
app.use(require("express-session")({
	secret:"admin",
	resave: false,
	saveUninitialized:false
}));

//Encrypte user data parsing, authenticate credentials, encode user session
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); // session decoding
passport.use(new LocalStrategy(User.authenticate()));
router.use(bodyParser.json());
app.use(cors());
app.use(router);

mongoose.set('useFindAndModify', false);

//secure api with JWT


//secure user session
app.use(passport.initialize());
app.use(passport.session());


//App listen on server on listening port 3000
app.listen(process.env.PORT || 8000, function (err) {
	if(err) {
		console.log(err)
	} else {
		console.log("Server Started on Port 8000"); //Listening on port 3000
 	}

});