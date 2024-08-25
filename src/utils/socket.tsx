import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GET_LOCAL_STORAGE } from "./EncryptedCookies";
import { Socket_URL } from "@/api";
import { getUserNameByID } from "@/controllers/auth";

const SocketContext = createContext<any>({});
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export default function SocketProvider({ children }: any) {
  const [socket, setsocket] = useState<any>(null);
  const [socketID, setsocketID] = useState<any>(null);
  const [token, settoken] = useState("");
  const [activeUsers, setactiveUsers] = useState([]);

  const userData = GET_LOCAL_STORAGE("JersApp_userData");
  useEffect(() => {
    const connection = io(Socket_URL || "");
    setsocket(connection);
    connection.on("connect", () => {
      setsocketID(connection?.id);
      if (userData) {
        connection.emit("set_user_id", userData._id);
        connection.emit("user_connected", {
          id: userData._id,
          status: "online",
        });
      }
    });
    connection.on("webAuthToken", (data) => {
      settoken(data);
    });
    connection.on("user_connected", (data) => {
      setactiveUsers(data);
    });
    connection.on("receivedMsg", async (data) => {
      if ("Notification" in window && data.sender !== userData._id) {
        const user = await getUserNameByID(data.sender);
        Notification.requestPermission().then((result) => {
          if (result === "granted") {
            new Notification(user.name, {
              body: data.message,
            });
          }
        });
      }
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, socketID, token, activeUsers, setactiveUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
}
