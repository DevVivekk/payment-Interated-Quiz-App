const { Cashfree } = require("cashfree-pg")

const PaymentVerify = async(req,res)=>{
    Cashfree.PGOrderFetchPayments("2023-08-01",req.body.orderid).then((ress)=>{
    if(ress.data[0].payment_status!=="SUCCESS" && ress.data[0].payment_status!=='PENDING'){
        res.json("Pement failed!")
    }else if(ress.data[0].payment_status==="PEDNING"){
      res.json({pending:"amount pending!"})
    }
    else{
        res.json({success:"amount done!"})}
    }
).catch((err)=>{
    res.json("error")
})
}
module.exports = PaymentVerify