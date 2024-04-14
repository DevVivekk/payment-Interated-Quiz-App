const express = require("express");
const paymentHandler = require("../controllers/PaymentHandler");
const PaymentVerify = require("../controllers/paymentVerify");
const addAnswers = require("../controllers/AddAnswers");
const route = new express.Router();
route.get('/payment',paymentHandler)
route.post("/payment/verify",PaymentVerify)
route.post("/addanswers",addAnswers)
module.exports = route;