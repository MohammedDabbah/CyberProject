const express =require("express");
const bodyParser=require("body-parser");
const ejs =require("ejs");
const assert=require("assert");
const Admins = require ("./mongodb");
const  SignUpDoctor=require("./mongodb");
const SignUpPatient=require("./mongodb");
const { generateRandomCode, SendMail,generateRandomPassword,checkPasswordStrength } = require("./send");
const session = require('express-session');
const cookieParser=require('cookie-parser');
const bcrypt = require('bcrypt');





var arr=[];
let flag=false;
var items=[];
const app=express();
const algorithm = 'aes-256-cbc'; // Algorithm for encryption/decryption
const secretKey = 'your_secret_key' // Secret key for encryption/decryption




app.use(session({
  secret: 'myappsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 90000, // 15 minutes
    httpOnly: true
  },
  name:'connect.sid'
}));

app.use(express.static("public"));
app.use(express.json());
app.set('view engine','ejs');
let code="";
var check1;
let pass='';

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));



app.get("/",function(req,res){
  res.cookie()
    res.render("home");
})
app.get("/loginDoctor",function(req,res){
    res.render("loginDoctor",{message:""});
});
app.get("/loginPatient",function(req,res){
    res.render("loginPatient",{message:""});
});



app.get("/loginAdmin",function(req,res){
    res.render("loginAdmin",{message:""});
})

app.get("/AdminPage",async function(req,res){
    if(req.session.user){
      bcrypt.compare(arr[1],req.session.user.password,function(err,result){
        if(err){
          console.log(err);
        }
        if(result){
          res.render("AdminPage",{name:req.session.user.name, username:req.session.user.username});
          flag=true;
        }else{
          res.render("loginAdmin",{message:"wrong username or password!. "});
        }
      })
    }else{
      res.render("loginAdmin",{message:"wrong username or password!. "})
    }
});
app.post("/loginAdmin",async function(req,res){
    arr=[];
    arr.push(req.body.userName);
    arr.push(req.body.password);
   req.session.user= await Admins.Admins.findOne({username:arr[0]});
    res.redirect("/AdminPage");
})
app.get("/varification",async function(req,res){
   req.session.user=await SignUpDoctor.SignUpDoctor.findOne({username:arr[0]});
   if(req.session.user){
   bcrypt.compare(arr[1],req.session.user.password,function(err,result){
    if(err){
      console.log(err)
    }
    if(result){
      code=generateRandomCode(4);
      SendMail(req.session.user.email,code,"Your Code varification! ");
      res.render("varification",{message:""});
    }else{
      res.render("loginDoctor",{message:"wrong username or password!. "});
    }
       });
      }else{
        res.render("loginDoctor",{message:"wrong username or password!. "});
      }
  
});

app.post("/varification",function(req,res){
  if(code===req.body.verifyCode){
    res.render("DoctorPage",{name:req.session.user.name,specialties:req.session.user.specialties,showTable:false,showSignUp:false,patientId:""});
  }else{
    res.render("varification",{message:"incorrect Code varification"});
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
    res.render("signup",{message:""});
});


app.post("/signup",async function(req,res){
  pass=generateRandomPassword(8);
  let data={
    name:req.body.name,
    _id:req.body.id,
    birth:req.body.birthBox,
    gender:req.body.flexRadioDefault,
    specialties:req.body.specialties,
    username:req.body.username,
    email:req.body.Email,
    password:pass
  }
  t=await SignUpDoctor.SignUpDoctor.findOne({username:data.username})
  t1=await SignUpDoctor.SignUpDoctor.findOne({_id:data._id})
  if(t){
    res.render("signup",{message:"Username or ID Is used!"});
  }else if(t1){
    res.render("signup",{message:"Username or ID Is used!"});
  }
  else{
  const hashedPassword = await bcrypt.hash(data.password,13);
  data.password=hashedPassword;
        await SignUpDoctor.SignUpDoctor.insertMany([data]);
        res.render("signup",{message:"Sign Up Succesfully"});
        SendMail(req.body.Email,pass,"this is your password and you can change it later.. ");
      }
});
app.get('/show-table',async(req, res) => {
  const IDs=await SignUpPatient.SignUpPatient.find({});
  res.render('DoctorPage', { showTable: true,name:req.session.user.name,specialties:req.session.user.specialties,showSignUp:false,patientId:IDs }); // Render the view with showTable set to true
});
app.post("/show-table",async function(req,res){
  let N=req.body.id;
  let C="";

  for(var i=0;i<9;i++){
    C+=N[i];
  }
  console.log(C);
  const adder=await SignUpPatient.SignUpPatient.findOne({_id:C});
  adder.ar.push(req.body.date);
  adder.ar.push(req.body.medical);
  adder.save();
  res.redirect("/show-table")
});
app.get('/ShowSignUp', async(req, res) => {
  res.render('DoctorPage', { showSignUp: true,name:req.session.user.name,specialties:req.session.user.specialties,showTable:false ,patientId:"",message:"" }); // Render the view with showTable set to true
});


app.post("/signupPatient",async function(req,res){
  pass=generateRandomPassword(8);
  req.session.user=await SignUpDoctor.SignUpDoctor.findOne({username:arr[0]});
  let data={
    name:req.body.fullName,
    _id:req.body.ID,
    birth:req.body.birthBox,
    gender:req.body.inlineRadioOptions,
    username:req.body.username,
    email:req.body.mail,
    password:pass
  }
   t=await SignUpPatient.SignUpPatient.findOne({username:data.username})
  t1=await SignUpPatient.SignUpPatient.findOne({_id:data._id})
  if(t){
    console.log(await SignUpPatient.SignUpPatient.findOne({username:data.username}))
    res.render('DoctorPage', { showSignUp: true,name:req.session.user.name,specialties:req.session.user.specialties,showTable:false ,patientId:"",message:"Username or ID Is used!" }); 
  } // Render the view with showTable set to true
 else if(t1){
    res.render('DoctorPage', { showSignUp: true,name:req.session.user.name,specialties:req.session.user.specialties,showTable:false ,patientId:"",message:"Username or ID Is used!" }); 
  }
    else{
    const hashedPassword = await bcrypt.hash(data.password,13);
    data.password=hashedPassword;
    SendMail(req.body.mail,pass,"this is your password and you can change it later.. ")
          await SignUpPatient.SignUpPatient.insertMany([data]);
          res.render('DoctorPage', { showSignUp: true,name:req.session.user.name,specialties:req.session.user.specialties,showTable:false ,patientId:"" ,message:"Signed Up successfully!"});
        }
     
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});
app.post("/resend",function(req,res){
  res.redirect("varification");
});
app.post("/resend2",function(req,res){
  res.redirect("varificationPatient");
})
// app.get("/PatientPage",function(req,res){
//   if(check1){
//   res.render("PatientPage",{name:req.session.user.name,username:req.session.user.username,array:req.session.user.ar});
// }else{
//   res.send("error");
// }
// });

app.get("/varificationPatient",async function(req,res){
    code=generateRandomCode(4);
   SendMail(req.session.user.email,code,"Your Code varification! ");
   res.render("varificationPatient",{message:""});
});
app.post("/varificationPatient",function(req,res){
  if(code===req.body.verifyCode){
    res.render("PatientPage",{name:req.session.user.name,username:req.session.user.username,array:req.session.user.ar});
  }else{
    res.render("varification",{message:"incorrect Code varification"});
  }
});


app.post("/loginPatient",async function(req,res){
  req.session.user=await SignUpPatient.SignUpPatient.findOne({username:req.body.userName});

  if(req.session.user){
    bcrypt.compare(req.body.password,req.session.user.password,function(err,result){
      if(err){
        console.log(err);
      }
      console.log(result);
      if(result){
        res.redirect("/varificationPatient");
      }else{
        res.render("loginPatient",{message:"wrong username or password!. "});
      }
    })
  
  }else{
    res.render("loginPatient",{message:"wrong username or password!. "});
  }

});





app.get('/logoutPatient', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});
app.get('/logoutDoctor', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});


app.get("/forggetPassword",function(req,res){
  res.render("forggetPassword",{message:""});
})
app.post("/forggetPassword",async function(req,res){
  if(req.body.role==="Doctor"){
    code=generateRandomCode(8);
    const check=await SignUpDoctor.SignUpDoctor.findOne({email:req.body.mail});
    if(check){
      SendMail(req.body.mail,code,"Your new password. ");
      const hashedPassword = await bcrypt.hash(code,13);
  check.password=hashedPassword;
  check.save();
  res.render("forggetPassword",{message:"your password changed. "})
    }else{
      res.render("forggetPassword",{message:"your email is not defined!"});
    }
  }if(req.body.role==="Patient"){
    code=generateRandomCode(8);
   
    const check=await SignUpPatient.SignUpPatient.findOne({email:req.body.mail});
    if(check){
      SendMail(req.body.mail,code,"Your new password. ");
      const hashedPassword = await bcrypt.hash(code,13);
  check.password=hashedPassword;
  check.save();
  res.render("forggetPassword",{message:"your password changed. "});
    }else{
      res.render("forggetPassword",{message:"your email is not defined!"});
    }
  }
})



app.listen(3284, function() {
    console.log("Server started on port 3284");
});