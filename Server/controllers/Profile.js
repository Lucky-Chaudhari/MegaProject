const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res)=>{
  try {
       // get data
        const {dateOfBirth="",about="",contactNumber,gender}= req.body;

        //get userId
        const id = req.user.id;

        //Validation

        if(!contactNumber||!gender||!id){
          return res.status(400).json({
            success:false,
            message:"All Field Are Required"
          });
        }
        //Find Profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails= await Profile.findById(profileId)


        //Update Profile

        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();

        //Return Response
        return res.status(200).json({
          success:true,
          message:"Profile Updated Successfully",
          profileDetails,
        })

  } catch (error) {
          return res.status(500).json({
            success:false,
            error:error.message,

          });
  }
};



//deleteAccount


exports.deleteAccount = async(req,res)=>{
  try {
        // get id
        const id = req.user.id;
        //validation
         const userDetails = await User.findById(id);
         if(!userDetails){
          return res.status(400).json({
            success:false,
            message:'User Not Found'
          });
         }
         //delete Profile
         await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

         //ToDo:HW unenrill user form all enrolled couses
         //delete user

         await User.findByIdAndDelete({_id:id});

         //return res
     return res.status(200).json({
      success:true,
      message:'User Deleted Successfully',
     })


  } catch (error) {
    return res.status(500).json({
      success:false,
      message:'User Cannot Be Deleted Successfully',
     });
  }
};



exports.getAllUserDetails = async(req,res)=>{
  try {
     // get id
     const id = req.user.id;

       //validation
       const userDetails = await User.findById(id).populate("additionalDetails").exec();


       //return res

       return res.status(200).json({
        success:true,
        message:'User Data Fetch Successfully'
       });


  } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message,
      });
  }
}