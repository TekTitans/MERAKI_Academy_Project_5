import socketInit from "./socket.server";
import { useState, useEffect } from "react";

const Chat = () => {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [socket, setSocket] = useState(null);
  useEffect(()=>{
    socket?.on("connect",()=>{
        console.log(true)
    })
  },[socket])

  return (
    <div>
      <h1> chat</h1>
      <input
        onChange={(e) => {
          setUserId(e.target.value);
        }}
        type="text"
        placeholder="user_id"
      ></input>
      <input
        onChange={(e) => {
          setToken(e.target.value);
        }}
        type="text"
        placeholder="token"
      ></input>
      <button
        onClick={() => {
          setSocket(
            socketInit({
              userId,
              token,
            })
          );
        }}
      >
        connect
      </button>
    </div>
  );
};
export default Chat;
