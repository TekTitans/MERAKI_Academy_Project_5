import React, { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import socketInit from "./socket.server";
import { addToRecived, setAllMessages } from "../../components/redux/reducers/auth";
import { useDispatch } from "react-redux";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch=useDispatch()
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const allMessages = useSelector((state) => state.auth.allMessages);
  const recived = useSelector((state) => state.auth.recived);

  
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    socket?.on("message", (data) => {
      dispatch(setAllMessages([...allMessages, data]));
      if(data.fromId!=userId){
      dispatch(addToRecived([...recived, data]))};

    });

    return () => {
      socket?.off("message");
    };
  }, [allMessages, dispatch, socket,recived]);

console.log(allMessages)
  useEffect(() => {
    if (userId && token) {
      const newSocket = socketInit({ userId, token });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected");
      });

      newSocket.on("connect_error", (error) => {
        console.log("Connection error", error);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [userId, token]);

  return (
    <SocketContext.Provider value={{ socket,allMessages,recived }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
