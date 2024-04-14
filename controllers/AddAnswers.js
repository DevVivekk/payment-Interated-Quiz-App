const usermodel = require("../model/userSchema");

const addAnswers = async(req,res)=>{
    try{
        const {answers} = req.body;
        //const ans = await usermodel.findOneAndUpdate({googleId:"111545277468921119586"},{history:answers},{new:true});
        //this approach will override the previous ones;

        //this approach will add the new ones each without changing the prev ones
        const ans = await usermodel.findOneAndUpdate({googleId:req.user.googleId},{$push:{history:answers}},{new:true});
        console.log(ans);
        res.status(201).json("success!")
    }catch(e){
        return res.status(400).json("error caught!")
    }
}
module.exports = addAnswers;