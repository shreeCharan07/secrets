//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParcer = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express()
app.use(express.static("public"));
app.use(bodyParcer.urlencoded({extended:true}));
app.set("view engine", "ejs");

console.log(process.env.API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)

app.get("/",function(req,res){
  res.render("home")
})
app.get("/login",function(req,res){
  res.render("login")
})
app.get("/register",function(req,res){
  res.render("register")
})


app.post("/register",function(req,res){  //way of registering things when we register it goes to secret page
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save().then(function(){  ///here after we save a data the password gets encrypted after saving the newUser
    res.render("secrets")
  }).catch(err => {
    console.log(err);
  })

})


////////////////////////way of logging in/////////////////////////////////////////////

app.post("/login",function(req,res){
  const username = req.body.username
  const password = req.body.password

  User.findOne({email: username}).then(function(foundUser){
    if(foundUser){
      if(foundUser.password===password){
        res.render("secrets")
      }
    }
  }).catch(err =>{
    console.log(err);
  })
})


app.listen(5000,function(){
  console.log("server is running on the port 5000!!");
});
