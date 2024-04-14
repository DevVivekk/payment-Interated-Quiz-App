const mongoose = require("mongoose");
const connectToDb = async()=>{
await mongoose.connect(process.env.MONGO).then(()=>console.log("connected")).catch((err)=>console.log(err));
}
module.exports = connectToDb;