//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");


const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/taskuserDB");

const userSchema={
    email:{
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },
    username:{
        type: String,
        unique: true,
        required: 'Your username is required',
    },
    password:{
        type: String,
        required: 'Your password is required',
        max: 100
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
};

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    });
    newUser.save();
    res.render("secrets");
});


app.post("/login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email})
    .then((foundUser) => {
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }else{
            console.log("User Not Found!");
        }
   })
   .catch((error) => {
       //When there are errors We handle them here

console.log(err);
       res.send(400, "Bad Request");
   });
      
});



app.listen(3000,function(req,res){
    console.log("Server is running on port 3000");
});