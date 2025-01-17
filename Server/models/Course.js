const mongoose=require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName:{
    type:String,
    required:true,
    trim:true,
  },
  courseDescription:{
    type:String,
    required:true,
    trim:true,
  },
  instructor:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  },
  whatYouWillLearn:{
    type:String,


  },
  courseContent:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Section",
    }
  ],


  ratingAndReviews:{
     type:mongoose.Schema.Types.ObjectId,
     required:true,
     ref:"RatingAndReview",
  },
  price:{
      type:Number,
     },
  thumbnail:{
    type:String,
    required:true,

  },
  tag:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Tag",
     },
     studentsEnrolled:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
      }
     ]
});
module.exports=mongoose.model("Course",courseSchema);