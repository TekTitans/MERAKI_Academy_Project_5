const express = require("express");

const {
  createMessage,
  getMessages
  
} = require("../controllers/messages");

const messagesRouter = express.Router();

messagesRouter.post("/", createMessage);

messagesRouter.get("/", getMessages);


module.exports = messagesRouter;
