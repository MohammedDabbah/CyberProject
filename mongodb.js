const mongoose=require("mongoose");
mongoose.set("strictQuery",false);
mongoose.connect("mongodb://localhost:27017/Clinic")
.then(function(){
    console.log("mongodb connected")
})
.catch(function(){
    console.log("faild to connect");
});
const Admin1Schema=new mongoose.Schema({
   name:"Mohammed Dabbah",
   username:"MD422002",
   password:"Mohammed@2002"
})
const Admin2Schema=new mongoose.Schema({
    name:"Mohammed Wattad",
    username:"Wattad321",
    password:"Wat@21"
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
    },
    confirmPassword:{
        type:String,
        require:true
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
    },
    confirmPassword:{
        type:String,
        require:true
    }
});

const SignupPatient=new mongoose.model("SignUpDoctor",SignupPatientSchema);
const Admin1=new mongoose.model("Admin1",Admin1Schema);
const Admin2=new mongoose.model("Admin2",Admin2Schema);
const SignUpDoctor=new mongoose.model("SignUpDoctor",SignupDoctortSchema);
module.exports={
    SignupPatient,
    Admin1,
    Admin2,
    SignUpDoctor
}