const Category =require("../models/Category");

//create Tag ka Handler Function

exports.createCategory = async(req,res)=>{

   try {
    //fetch the data in req.body
      const {name,description}=req.body;

      //validation
        if(!name || !description){
          return res.status(400).json({
            success:false,
            message:"All field are required",
          })
        }
    //Create the entry in db
      const categoryDetails = await Category.create({
        name:name,
        description:description,
      })
         console.log(categoryDetails);


      //return response
      return res.status(200).json({
        success:true,
        message:"Tag Created Successfully",
      })

   } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message,
    });
   }
};


//Get All Category Function
exports.showAllCategory= async(req,res)=>{

     try {
        const allCategory = await Category .find({},{name:true,description:true});
        res.status(200).json({
          success:true,
          message:'All tag returned Successfully',
          allTags,
        })
     } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message,
      });
     }

}