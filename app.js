const express =require("express");
const bodyParser=require("body-parser");
const ejs =require("ejs");
const assert=require("assert");



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

app.listen(3000, function() {
    console.log("Server started on port 3000");
});