const mongoose=require("mongoose");
mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://abotalebwattad:4OJ55GWlJdFRVSHD@cluster0.nawcxhq.mongodb.net/Clinc")
.then(function(){
    console.log("mongodb connected")
})
.catch(function(){
    console.log("faild to connect");
});
const AdminsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
 })
 
const SignupPatientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    _id:{
        type:String,
        required:true
    },
    birth:{
        type:String
    },
    gender:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const SignupDoctortSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    _id:{
        type:String,
        required:true
    },
    birth:{
        type:String
    },
    gender:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const SignupPatient=new mongoose.model("SignUpPatient",SignupPatientSchema);
const Admins=new mongoose.model("Admins",AdminsSchema);
const SignUpDoctor=new mongoose.model("SignUpDoctor",SignupDoctortSchema);
module.exports={
    SignupPatient,
    Admins,
    SignUpDoctor
}

