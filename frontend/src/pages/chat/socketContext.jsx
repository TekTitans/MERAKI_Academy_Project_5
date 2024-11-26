import React, { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import socketInit from "./socket.server";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  
  const [socket, setSocket] = useState(null);

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
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
