const db=require("../../config/db");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
module.exports={
    register:(req,res)=>{
        const {name,email,password}=req.body;
         if(!name||!email||!password){
            return res.status(400).json({message:"All fields are required"});
         }
    const uQuery="SELECT * FROM user WHERE email=?";
    db.query(uQuery,[email],(err,result)=>{
        if(err){
            return res.status(500).json({message:"Error checking user"});
        }
    
    if(result.length>0){
        return res.status(409).json({message:"User already exists"});
    }
    req.body.password=bcrypt.hashSync(password,bcrypt.genSaltSync(10));
    const query="INSERT INTO user(name,email,password) VALUES (?,?)";
        db.query(query,[req.body.email,req.body.password],(err,result)=>{
            if(err){
                callback(err);
            }else{
                callback(null,result);
            }
        });
    })},

    login:(req,res)=>{
        const query="SELECT * FROM user WHERE email=?";
        db.query(query,[req.body.email],(err,result)=>{
            if(err){
                return res.status(500).json({message:"Error fetching user"});
            }else{
                if(result.length===0){
                    return res.status(404).json({message:"User not found"});
                }
                bcrypt.compare(req.body.password,result[0].password,(err,match)=>{
                    if(err){
                        return res.status(500).json({message:"Error comparing passwords"});
                    }
                    if(!match){
                        return res.status(401).json({message:"Invalid password"});
                    }
                const token=jwt.sign({id:result[0].id},process.env.JWT_SECRET );
                res.cookie("token", token, {
                httpOnly: true,
                secure: false, 
                sameSite: "lax",
                path: "/",

            });
                return res.status(200).json({message:"Login successful",data:{id:result[0].id,name:result[0].name,email:result[0].email}});
                });
            }
        });
    }
};