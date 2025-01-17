const mongoose=require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    requires:true,
      ref:"User",
   },
   rating: {
      type:Number,
      requires:true,

    },
    review:{
        type:String,
        required:true,
    }
});
module.exports=mongoose.model("RatingAndReview",ratingAndReviewSchema);