const db=require("../../config/db")
module.exports={
    getadmins:(callback)=>{
        const uquery="SELECT * FROM user"
        db.query(uquery,(err,result)=>{
            if(err) {return callback(err)}
            return callback(null, result)
        })
    },

}