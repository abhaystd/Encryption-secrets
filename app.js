const express=require("express");
const bodyParser=require ("body-parser");
const ejs= require("ejs");
const mongoose =require("mongoose");
// const encrypt =require('mongoose-encryption')

const app= express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

// const secret ="thisisourlittlesecret.";
// userSchema.plugin(encrypt,{secret:secret ,encryptedFields: ['password']});

const User= new mongoose.model('User',userSchema);



app.get("/",async function(req,res){
    res.render("home");
});

app.get("/login",async function (req,res) {
    res.render("login");
});
app.get("/register",async function (req,res) {
    res.render("register");
});

app.post("/register",async function(req,res){
    try{
        const newUser=new User({
            email:req.body.username,
            password:req.body.password
        });
        await newUser.save();
        res.render("secrets");
    }
    catch(err){
        console.log(err);
    };
});

app.post("/login",async function (req,res) {
    const loginId=req.body.username;
    const loginPass=req.body.password;
    await User.findOne({email:loginId})
    .then(function(foundUser){
        if(foundUser.password===loginPass){
            res.render("secrets");
        }
        else{
            res.send("error enter correct email and password");
        }
    })
    .catch((err)=>{
        console.log(err);
    });
});



app.listen(3000,function(){
    console.log("Server is running on port 3000");
});