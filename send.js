const nodemailer=require("nodemailer");
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"mwattad232@gmail.com",
        pass:"aujsxxwsyewfoiwg"
    }
});

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  function generateRandomPassword(length) {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const specialCharacters = '!@#$%^&*()-_+=';
    const allCharacters = uppercaseLetters + lowercaseLetters + specialCharacters;
    let password = '';
  
    // Ensure at least one uppercase letter
    password += uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));
  
    // Ensure at least one lowercase letter
    password += lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length));
  
    // Ensure at least one special character
    password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
  
    // Fill the rest of the password with random characters
    for (let i = 0; i < length - 3; i++) {
      password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }
  
    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => Math.random() - 0.5).join('');
  
    return password;
  }
  
  // Usage example
//   const randomPassword = generateRandomPassword(10);
//   console.log(randomPassword);
  
  
  // Usage example
//   const randomCode = generateRandomCode(8);
//   console.log(randomCode);

function SendMail(mail,message,sub){
    const mailOptions={
        from:"mwattad232@gmail.com",
        to:mail,
        subject:sub,
        html: message
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: "+info.response); 
        }
    });
};

// SendMail("abotalebwattad@gmail.com",generateRandomCode(4));
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

module.exports={
    SendMail,
    generateRandomCode,
    generateRandomPassword,
    checkPasswordStrength
}