const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
 const bcrypt=require("bcrypt");
 const jwt = require("jsonwebtoken");

 require("dotenv").config();

//sendOTP :- Generated the opt
exports.sendOTP = async(req,res)=>{

    try {
       // Fetch the data from req.body
     const {email}= req.body;

     //check if user is already exist
        const checkUserPresent = await User.finOne({email});

     // if User already exist , then return a res
     if(checkUserPresent){
      return res.status(401).json({
        success:false,
        message:'User already Registered',
      });
     }

     //generate the otp

     var otp = otpGenerator.generate(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,
     });
     console.log("OTP generated:-",otp);

     //check unique otp or not
     let result =await OTP.findOne({otp:otp});

     while(result){
      otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
       });
        result = await OTP.findOne({otp:otp});
     }
        const otpPayload = {email, otp};

     //create an entry in db for OTP
     const otpBody = await OTP.create(otpPayload);
     console.log(otpBody);


     //return res successful
     res.status(200).json({
      success:true,
      message:'OTP Sent Successfully',
      otp,
     })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:true,
          message:error.message,
        })
    }

};

//SignUp
exports.signUp = async (req,res)=>{

    try {
      //data fetch frim req body
 const {
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  accountType,
  contactNumber,
  otp

}=req.body;

//Validate the data
if(!firstName || !lastName|| !email || !password|| !confirmPassword || !otp){
return res.status(403).json({
 success:false,
 message:'All fileds are required',
})
}

//2 password match karo is they are same
 if(password !== confirmPassword){
   return res.status(400).json({
     success:false,
     message:"Password and ConfirmPassword Value does not match,please try again"
   });
 }

//check user already exist or not
const existingUser = await User.findOne({email});
if(existingUser){
 return res.status(400).json({
   success:false,
   message:"User already Registered",
 });
}


//find most recent OTP stored for the user
const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
console.log(recentOtp);


//validate OTP
if(recentOtp.length==0){
 //OTP Not Found
 return res.status(400).json({
   success:false,
   message:"OTP Found"
 })
}else if(otp !== recentOtp.otp){
 //Invalid OTP
 return res.status(400).json({
   success:false,
   message:"Invalid  OTP"
 });
}
  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //entry create in db

  const profileDetails= await Profile.create({
   gender:null,
   dateOfBirth:null,
   about:null,
   contactNumber:null,
  });

  const user = await User.create({
   firstName,
   lastName,
   email,
   contactNumber,
   password:hashedPassword,
   accountType,
   additionalDetails:profileDetails._id,
   image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
  })
  // Return res
     return res.status(200).json({
      success:true,
      message:'User is registered Successfuly',
      user,
     });

    } catch (error){
          console.log(error);
           return res.status(500).json({
            success:false,
            message:'User can not  registered Successfuly . Please try again',
          })
    }
}


//Login

   exports.login = async (req,res)=>{
    try {

        // get data from req body
        const {email,password}=req.body;

        //validation data
        if(!email || !password){
          return res.status(403).json({
            success:false,
            message:"All field are required, please try again",
          });
        }
        //user check exist pr not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
          return res.status(401).json({
            success:false,
            message:"User is not registered,please signup first"
          })
        }
        //generate JWT . after password matching

         if(await bcrypt.compare(password,user.password)){
          const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType,
          }
          const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h"
          });
          user.token=token;
          user.password= undefined;

         //Create cookies and send response
         const options={
          expires:new Date(Date.now()+3*24*60*60*1000),
          httpOnly:true,
         }
         res.cookie("token",token,options).status(200).json({
          success:true,
          token,
          user,
          message:"Logged in Successfully",
         })

         }
         else{
          return res.status(401).json({
            success:false,
            message:'Password is incorrect',
          });
         }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:false,
          message:'Login Failure , please try again',
        });
    }
   };



//changePassword
