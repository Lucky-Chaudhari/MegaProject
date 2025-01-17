const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator=require("otp-generator");

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


//Login


//changePassword
