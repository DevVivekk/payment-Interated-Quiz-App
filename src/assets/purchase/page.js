"use client"
import  { useEffect, useState } from 'react'
import { load } from '@cashfreepayments/cashfree-js'
export const PurchasePage = () => {
  const [cashfree,setCashfree] = useState();
  useEffect(() => {
    const initializeSDK = async () => {
      const cashfreeInstance = await load({
        mode: "sandbox",
      });
      setCashfree(cashfreeInstance);
    }
    initializeSDK();
  }, []);

  const verifyPayment = async (item,cf_order_id) => {
    try {
      console.log("orderidd ",item)
      const res = await fetch("http://localhost:5000/payment/verify",{
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" // Specify content type for the request
        },
        body: JSON.stringify({ orderid:item,cf_order_id })
      });
      const data = await res.json();
      console.log("dataaa", data);
      if(data.success){
        alert("done")
      }else{
        alert("not done")
      }
    }catch(e){
      console.log(e);
    }
  };
  
    const getSessionId = async()=>{
        try{
            const res = await fetch("http://localhost:5000/payment")
            const data = await res.json();
            console.log(data);
            if(data && data.payment_session_id){
              console.log("data orderid", data.order_id);
              return {sessionId:data.payment_session_id,orderrid:data.order_id,cf_order_id:data.cf_order_id}
            }
        }catch(e){
          throw new Error(e);
        }
    }
    const handleClickk = async()=>{
    let {sessionId,orderrid,cf_order_id}  = await getSessionId();
    console.log("session",sessionId)
    let checkoutOptions ={
      paymentSessionId:sessionId,
      redirectTarget:"_modal"
    }
   cashfree.checkout(checkoutOptions).then(async(res)=>{console.log("payment intiated ",res);
    await verifyPayment(orderrid,cf_order_id)
    });
    }
  return {handleClickk}
}