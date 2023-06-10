const express =require("express");
const bodyParser=require("body-parser");
const ejs =require("ejs");
const assert=require("assert");
const Admins = require ("./mongodb");
const  SignUpDoctor=require("./mongodb");
const SignUpPatient=require("./mongodb");
const { generateRandomCode, SendMail,generateRandomPassword,checkPasswordStrength } = require("./send");
const { add } = require("nodemon/lib/rules");


var arr=[];
let flag=false;
var items=[];

const app=express();
app.use(express.static("public"));
app.use(express.json());
app.set('view engine','ejs');
let code="";
let check1;
let pass='';
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));

app.get("/",function(req,res){
    res.render("home");
})
app.get("/loginDoctor",function(req,res){
    res.render("loginDoctor");
});
app.get("/loginPatient",function(req,res){
    res.render("loginPatient");
});
app.get("/loginAdmin",function(req,res){
    res.render("loginAdmin");
})

app.get("/AdminPage",async function(req,res){
    let check1= await Admins.Admins.findOne({username:arr[0],password:arr[1]});
    if(check1){
        console.log(check1);
        flag=true;
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
app.get("/varification",async function(req,res){
   check1=await SignUpDoctor.SignUpDoctor.findOne({username:arr[0],password:arr[1]});
  if(check1){
     code=generateRandomCode(4);
    SendMail(check1.email,code,"Your Code varification! ");
    res.render("varification");
  }else{
    res.send("error");
  }
});

app.post("/varification",function(req,res){
  if(code===req.body.verifyCode){
    res.render("DoctorPage",{name:check1.name,specialties:check1.specialties,showTable:false,showSignUp:false,patientName:"",patientId:""});
  }
});


app.post("/loginDoctor",function(req,res){
  arr=[];
  arr.push(req.body.userName);
  arr.push(req.body.password);
  console.log(arr[0]);
  console.log(arr[1]);
  res.redirect("/varification");
});

app.get("/AdminPage/signup",function(req,res){
  if(flag){
    res.render("signup",{message:""});}
});

app.post("/signup",async function(req,res){
  let data={
    name:req.body.name,
    _id:req.body.id,
    birth:req.body.birthBox,
    gender:req.body.flexRadioDefault,
    specialties:req.body.specialties,
    username:req.body.username,
    email:req.body.Email,
    password:req.body.password
  }
  if(checkPasswordStrength(data.password))
  {
    if(data.password===req.body.confirmPassword){
        await SignUpDoctor.SignUpDoctor.insertMany([data]);
        res.render("signup",{message:"Sign Up Succesfully"});
    }else{
        res.render("signup",{message:"Password unmatch!"});
    }
  }else{
    res.render("signup",{message:"Password must contain specialChar ,numbers ,small letter, big letter. "});
  }
});
app.get('/show-table',async(req, res) => {
  const IDs=await SignUpPatient.SignUpPatient.find({});
  res.render('DoctorPage', { showTable: true,name:check1.name,specialties:check1.specialties,showSignUp:false,patientName:"",patientId:IDs }); // Render the view with showTable set to true
});
app.post("/show-table",async function(req,res){
  const adder=await SignUpPatient.SignUpPatient.findOne({_id:req.body.id});
  adder.ar.push(req.body.date);
  adder.ar.push(req.body.medical);
  adder.save();
  res.redirect("/show-table")
});
app.get('/ShowSignUp', async(req, res) => {
  res.render('DoctorPage', { showSignUp: true,name:check1.name,specialties:check1.specialties,showTable:false,patientName:"" ,patientId:"" }); // Render the view with showTable set to true
});


app.post("/signupPatient",async function(req,res){
  pass=generateRandomPassword(8);
  SendMail(req.body.mail,pass,"this is your password and you can change it later.. ")
  let data={
    name:req.body.fullName,
    _id:req.body.ID,
    birth:req.body.birthBox,
    gender:req.body.inlineRadioOptions,
    username:req.body.username,
    email:req.body.mail,
    password:pass
  }
        await SignUpPatient.SignUpPatient.insertMany([data]);
        res.render('DoctorPage', { showSignUp: true,name:check1.name,specialties:check1.specialties,showTable:false,patientName:"" ,patientId:"" }); // Render the view with showTable set to true
      });


app.listen(3284, function() {
    console.log("Server started on port 3284");
});