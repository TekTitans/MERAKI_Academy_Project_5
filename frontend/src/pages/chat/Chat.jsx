import React, { useEffect } from "react";
import { useSocket } from "./socketContext"; 
import Messages from "./Messages";
import  "./chat.css";


const Chat = () => {
  const { socket } = useSocket(); 

  return (
    <div>
      <h1>Chat</h1>
    
      {socket ? <Messages socket={socket} /> : <h1>No messages</h1>}
    </div>
  );
};

export default Chat;
