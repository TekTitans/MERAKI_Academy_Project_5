const express = require("express");

const {
  makeAPayment,
  
  
} = require("../controllers/payment");

const paymentRouter = express.Router();

paymentRouter.post("/", makeAPayment);



module.exports = paymentRouter;
