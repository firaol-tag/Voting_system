const path = require('path');
const { addnominee, getnominees } = require('./nominee..service');
module.exports={
addNominee: (req, res) => {
  const { name, department } = req.body;

  if (!name || !department) {
    return res.status(400).json({
      success: false,
      message: "Name and department are required"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image is required"
    });
  }

  const nimage = `/uploads/${req.file.filename}`;

  addnominee({ name, department, nimage }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    return res.json({
      success: true,
      data: results
    });
  });
},
    getNominees:(req,res)=>{
       
        getnominees((err,results)=>{
            if(err){
                console.log(err);
                return res.status(560).json({
                    success:false,
                    message:"sth went wrong"
                });
            }
            return res.json({
                success:true,
                data:results
            });
        });
    },
    updateNominee:(req,res)=>{
        updatenominee((err,results)=>{
            if(err){
                console.log(err);
                return res.status(560).json({
                    success:false,
                    message:"sth went wrong"
                });
            }
            return res.json({
                success:true,
                data:results
            });
        });
    },
  
}   