const authentication = async(req,res,next)=>{
    const token = req.cookies["quizpluser"];
    if(!token || !req.user){
        return res.status(501).json("Unable to verify. Try login in again!")
    }
    next()
}
module.exports = authentication;