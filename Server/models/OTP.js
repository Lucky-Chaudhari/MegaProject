const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
   email:{
    type:String,
    requires:true,

   },
   otp: {
      type:String,
      requires:true,

    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});


//a function to seng emails
   async function sendVerificationEmail(email,otp){
    try {
           const mailRespones=await mailSender(email,"Verification Email from StudyNotion",otp);
             console.log("Email sent Successfully",mailRespones)



    } catch (error) {
      console.log("error occured while sending mails",error);
      throw error;
    }
   }
   OTPSchema.pre("save",async function(next){
      await sendVerificationEmail(this.email,this.otp);
      next();
   })
module.exports=mongoose.model("OTP",OTPSchema);