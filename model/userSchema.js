const mongoose = require("mongoose");
const userSchmea = new mongoose.Schema({
    googleId:String,
    displayName:String,
    email:String,
    image:String,
    history:Object //for multiple nested object array using Object instead of array
},{timestamps:true})
const usermodel = new mongoose.model('Myquiz',userSchmea);
module.exports = usermodel;