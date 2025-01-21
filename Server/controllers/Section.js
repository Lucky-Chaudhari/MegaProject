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

   const updatedCourseDetails= await Course.findByIdAndUpdate(
                                                    courseId,
                                                     {

                                                      $push:{
                                                        courseContent:newSection._id
                                                      }
                                                     }
                                                     ,
                                                      {new:true},
                                                  );
   //HW:use populate to replace section/subsection both in the updatedCourseDetails

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