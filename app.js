require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);


app.get("/", async function (req, res) {
    res.render("home");
});

app.get("/login", async function (req, res) {
    res.render("login");
});
app.get("/register", async function (req, res) {
    res.render("register");
});



app.post("/register", async function (req, res) {
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        await newUser.save();
        res.render("secrets");
    }
    catch (err) {
        console.log(err);
    };
});

app.post("/login", async function (req, res) {
    try {
        const foundUser = await User.findOne({ email: req.body.username });
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (match === true) {
            res.render("secrets");
        }
        else {
            res.render("password is wrong");
        };
    }
    catch (err) {
        console.log(err);
    };
});




app.listen(3000, function () {
    console.log("Server is running on port 3000");
});