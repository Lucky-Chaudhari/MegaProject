const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadImageToCloudinary}= require("../utils/imageUploader");


//create SubSection


exports.createSubSection = async (req,res)=>{
  try {
       // fetch the data

       const {sectionId,title,timeDuration,description}=req.body;


       //extract file/video
       const video=req.files.videoFile;

       //validation
       if(!sectionId||!title||!timeDuration||!description||!video){
        return res.status(400).json({
          success:false,
          message:"All fields are required",
        });
       }
       //Upload video to cloudinary
       const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

       //create a subSection
         const subSectionDetails= await SubSection.create({
          title:title,
          timeDuration:timeDuration,
          description:description,
          videoUrl:uploadDetails.secure_url,
         })

         //update section with this sub section

         const updatedSection = await Section.findByIdAndUpdate(
          { _id: sectionId },
          {
            $push: {
              subSection:subSectionDetails._id,
            },
          },
          { new: true }
        ).populate('subSection'); // Populate the subSection details

        // HW: Log the updated section with populated subSection
        console.log("Updated Section with populated subSection:", updatedSection);

            //return
            return res.status(200).json({
              success:true,
              message:"Sub Section Created Successfully",
              updatedSection,
            });

  } catch (error) {
        return res.status(500).json({
          success:false,
          message:"Internal Server Error",
          error:error.message,
        })
  }
};



//update the sub section

exports.updateSubSection = async (req,res)=>{
    try {
          //data input
          const {sectionId} = req.body;

          //data validation
          if(!sectionId){
            return res.status(400).json({
                  success:false,
                  message:"Missing Properties",
            });

           }
           //update data
           const section = await SubSection.findByIdAndUpdate(sectionId,{new:true});

           //return respones

           return res.status(200).json({
            success:true,
            message:'Section Updated Sucessfull'
           });

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Unable to update the section,please tyr again",
        error:error.message,
            })
  }
  }



//Delete the SubSection
    exports.deleteSubSection= async (req,res)=>{
      try {
          //get Id:- assuming that are we sending Id in params
            const {sectionId}=req.params

            //use findByIDandDelete
            await SubSection.findByIdAndDelete(sectionId)

  //ToDO :- do we need to delete  entry from the course Schema?

            //return res
            return res.status(200).json({
              success:true,
              message:"SubSection Deleted Succssfuly",
            })
      } catch (error) {
        return res.status(500).json({
          success:false,
          message:"Unable to delete the Subsection,please tyr again",
          error:error.message,
              })
    }
    }