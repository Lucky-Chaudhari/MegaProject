const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");


//createCourse handler function


exports.createCourse = async (req,res)=>{

try {
    // fetch data

    const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //Validation
    if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag||!thumbnail){
      return res.status(400).json({
        success:false,
        message:"All fields are required",
      });

    }

    //Check for instructor
    const userId = req.user.id;
    const instructorDerails= await User.findId(userId);
    console.log("Instructor details :-",instructorDerails);
   //TODO :Verify that  userId and instructorDetail._id are same or different?



   if(!instructorDerails){
      return res.status(404).json({
        success:false,
        message:"Instructor Details not Found"
      });
    }

    //Check given tag is valid or not
       const tagDetails = await Tag.findById(tag);
       if(!tagDetails){
        return res.status(404).json({
           success:false,
           message:"Tag Details not Found"
        });
       }

       //Upload Image to  Cloudinary

       const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);


       //create an entry for new course

       const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDerails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        tag:tagDetails._id,
        thumbnail:thumbnailImage.secure_url,
       })

       // add new Course to the user schema of instructor

       await User.findByIdAndUpdate(
        {_id:instructorDerails._id},
        {
          $push:{
            courses:newCourse._id,
          }
        },
        {new:true},
       );

       //update the tag schema




       // return respone
       return res.status(200).json({
        success:true,
        message:"Course Created Successfully",
        data:newCourse,
       });

} catch (error) {
  console.error(error);
  return res.status(500).json({
    success:false,
    message:"Failed to Create Course",
    error:error.message,
  })
}

};



//getAllCourses handler function

exports.showAllCourses = async(req,res)=>{
   try {

       const allCourses = await Course.find({},{ courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,})
                                                .populate("instructor")
                                                .exec();
                return res.status(200).json({
                  success:true,
                  message:"Data for all courses fetch successfully",
                  data:allCourses,
                })

   } catch (error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:"cannot fetch Course data",
          error:error.message,
      })
 }
}