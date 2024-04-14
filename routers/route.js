const express = require("express");
const paymentHandler = require("../controllers/PaymentHandler");
const PaymentVerify = require("../controllers/paymentVerify");
const addAnswers = require("../controllers/AddAnswers");
const authentication = require("../auth/googleAuth");
const route = new express.Router();
route.get('/payment',paymentHandler)
route.post("/payment/verify",PaymentVerify)
route.post("/addanswers",authentication,addAnswers)
module.exports = route;