const db = require("../../config/db");
module.exports={
    addnominee:({name, department,nimage},callback)=>{
        const value=[name,department,nimage]
        console.log(value);
        const sql="INSERT INTO nominee (name,dep,photo) VALUES (?)"
        db.query(sql,[value],(err,results)=>{
            if(err){
                return callback(err);
            }
            return callback(null,results);
        })
    },
    getnominees:(callback)=>{
    
        const sql="SELECT * FROM nominee"
        db.query(sql,(err,results)=>{
            if(err){
                return callback(err);
            }
            return callback(null,results);
        })
    },
    updateNominee:(data,callback)=>{
        const values=[data.name,data.department,data.nimage,data.id]
        const sql="UPDATE nominees SET name=?,department=?,nimage=? WHERE id=?"
        db.query(sql,values,(err,results)=>{
            if(err){
                return callback(err);
            }
            return callback(null,results);
        })
    },
}