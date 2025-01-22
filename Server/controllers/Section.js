const  Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async(req,res)=>{
  try {
    //data fetch
  const {sectionName,courseId}= req.body;

  //data validation
   if(!sectionName||!courseId){
    return res.status(400).json({
          success:false,
          message:"Missing Properties",
    });

   }

   //create Section
   const newSection = await Section.create({sectionName});

   //update course sith section ObjectIDs

  //  const updatedCourseDetails= await Course.findByIdAndUpdate(
  //                                                   courseId,
  //                                                    {

  //                                                     $push:{
  //                                                   courseContent:newSection._id
  //                                                     }
  //                                                    }
  //                                                    ,
  //                                                     {new:true},
  //                                                 );
   //HW:use populate to replace section/subsection both in the
    //updatedCourseDetails
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true } // Ensure the updated document is returned
    ).populate({
      path: 'courseContent', // Field to populate
      populate: {
        path: 'subsections', // Nested field to populate
        model: 'Subsection', // Model for subsections
      },
    });

    console.log(updatedCourseDetails);

   return res.statis(200).json({
        success:true,
        message:'Section create Successfully',
        updatedCourseDetails,
   })
  } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Unable to create the section,please tyr again",
        error:error.message,
            })
  }

  }



  exports.updateSection = async (req,res)=>{
    try {
          //data input
          const {sectionName,sectionId} = req.body;

          //data validation
          if(!sectionName||!sectionId){
            return res.status(400).json({
                  success:false,
                  message:"Missing Properties",
            });

           }
           //update data
           const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

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



  exports.deleteSection= async (req,res)=>{
    try {
        //get Id:- assuming that are we sending Id in params
          const {sectionId}=req.params

          //use findByIDandDelete
          await Section.findByIdAndDelete(sectionId)

//ToDO :- do we need to delete  entry from the course Schema?

          //return res
          return res.status(200).json({
            success:true,
            message:"Section Deleted Succssfuly",
          })
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Unable to delete the section,please tyr again",
        error:error.message,
            })
  }
  }