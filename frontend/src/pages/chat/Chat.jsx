import React, { useEffect } from "react";
import { useSocket } from "./socketContext"; 
import Messages from "./Messages";
import { useParams } from "react-router-dom";
import  "./chat.css";


const Chat = () => {
  const {userid}=useParams()
  const { socket } = useSocket(); 

  return (
    <div>
      <h1>Chat</h1>
    
      {socket ? <Messages socket={socket} userid={userid}/> : <h1>No messages</h1>}
    </div>
  );
};

export default Chat;
