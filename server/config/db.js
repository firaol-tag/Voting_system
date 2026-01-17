const mysql=require('mysql');
const db=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    database:process.env.DATABASE,  
    password:process.env.PASSWORD
});
db.connect((err)=>{
    if(err) console.log(`Something went wrong with database: ${err}`);
    else console.log("MySQL Connected...");
})
console.log( process.env.HOST);
module.exports = db;