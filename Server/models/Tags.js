const mongoose=require("mongoose");

const tagsSchema = new mongoose.Schema({
   name:{
    type:String,
    requires:true,

   },
   description: {
      type:String,
      requires:true,

    },
    courses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }
});
module.exports=mongoose.model("Tags",tagsSchema);