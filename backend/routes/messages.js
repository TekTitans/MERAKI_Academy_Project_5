const express = require("express");
const auth = require("../middleware/authentication");

const {
  createMessage,
  getMessages
  
} = require("../controllers/messages");

const messagesRouter = express.Router();

messagesRouter.post("/", createMessage);

messagesRouter.get("/:id",auth, getMessages);


module.exports = messagesRouter;
