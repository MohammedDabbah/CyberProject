const express =require("express");
const bodyParser=require("body-parser");
const ejs =require("ejs");
const assert=require("assert");
const Admins = require ("./mongodb");
const  SignUpDoctor=require("./mongodb");


var arr=[];

const app=express();
app.use(express.static("public"));
app.use(express.json());
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));

app.get("/",function(req,res){
    res.render("home");
})
app.get("/DoctorLogin",function(req,res){
    res.render("loginDoctor");
});
app.get("/PatientLogin",function(req,res){
    res.render("loginPatient");
});
app.get("/AdminLogin",function(req,res){
    res.render("loginAdmin");
})

app.get("/AdminPage",async function(req,res){
    let check1= await Admins.Admins.findOne({username:arr[0],password:arr[1]});
    if(check1){
        console.log(check1);
        res.render("AdminPage",{name:check1.name, username:check1.username});
    }
})
app.post("/loginAdmin",function(req,res){
    arr=[];
    arr.push(req.body.userName);
    arr.push(req.body.password);
    console.log(arr[0]);
    console.log(arr[1]);
    res.redirect("/AdminPage");
})
app.get("/signup",function(req,res){
    res.render("signup");
})
app.post("/signupDoctor",async function(req,res){
  let data={
    name:req.body.name,
    _id:req.body.id,
    birth:req.body.birthBox,
    gender:req.body.flexRadioDefault,
    username:req.body.username,
    email:req.body.Email,
    password:req.body.password
  }

  if(checkPasswordStrength(data.password))
  {
    await SignUpDoctor.SignUpDoctor.insertMany([data]);
    res.render("signup",{txt:"Sign Up Succesfully"});
  }else{
    res.render("signup",{txt:"Password must contain specialChar ,numbers ,lowercase, uppercase. "});
  }
})




//******************* */

function checkPasswordStrength(password) {
    const minLength = 8;
    const minUppercase = 1;
    const minLowercase = 1;
    const minNumbers = 1;
    const minSpecialChars = 1;
    
    // Check length
    if (password.length < minLength) {
      return false;
    }
    
    // Check uppercase letters
    if (!/[A-Z]/.test(password) || (password.match(/[A-Z]/g) || []).length < minUppercase) {
      return false;
    }
    
    // Check lowercase letters
    if (!/[a-z]/.test(password) || (password.match(/[a-z]/g) || []).length < minLowercase) {
      return false;
    }
    
    // Check numbers
    if (!/\d/.test(password) || (password.match(/\d/g) || []).length < minNumbers) {
      return false;
    }
    
    // Check special characters
    const specialChars = "!@#$%^&*()_+{}[]<>?/";
    const regex = new RegExp("[" + specialChars.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "]", "g");
    if (!regex.test(password) || (password.match(regex) || []).length < minSpecialChars) {
      return false;
    }
    
    // Password meets all criteria
    return true;
  }


app.listen(3284, function() {
    console.log("Server started on port 3284");
});