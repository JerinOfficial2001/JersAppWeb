import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GET_LOCAL_STORAGE } from "./EncryptedCookies";
import { Socket_URL } from "@/api";
import { getUserNameByID } from "@/controllers/auth";
import { queryClient } from "./providers";
import toast from "react-hot-toast";

const SocketContext = createContext<any>({});
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";

  if (userAgent.indexOf("Edg") > -1) {
    browserName = "edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "chrome";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "firefox";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "safari";
  } else if (
    userAgent.indexOf("MSIE") > -1 ||
    userAgent.indexOf("Trident") > -1
  ) {
    browserName = "Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    browserName = "explorer";
  }

  return browserName;
};
export default function SocketProvider({ children }: any) {
  const [socket, setsocket] = useState<any>(null);
  const [socketID, setsocketID] = useState<any>(null);
  const [token, settoken] = useState("");
  const [activeUsers, setactiveUsers] = useState([]);
  const [isConnected, setisConnected] = useState(false);
  const [usersInGroup, setusersInGroup] = useState([]);
  const userData = GET_LOCAL_STORAGE("JersApp_userData");
  const [appSocketID, setappSocketID] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const connection = io(Socket_URL || "", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });
    setsocket(connection);
    connection.on("connect", () => {
      setsocketID(connection?.id);
      if (userData) {
        toast.success("Online");
        connection.emit("me", userData._id);
        connection.emit("set_user_id", userData._id);
        connection.emit("user_connected", {
          id: userData._id,
          status: "online",
        });
      }
      setisConnected(true);
    });
    connection.on("disconnect", () => {
      setisConnected(false);
      toast.error("offline");
    });
    connection.on("webAuthToken", (data) => {
      settoken(data.token);
      setappSocketID(data.socket_id);
    });
    connection.on("user_connected", (data) => {
      setactiveUsers(data);
    });
    connection.on("message", (data) => {
      queryClient.invalidateQueries({ queryKey: ["message"] });
    });
    connection.on("new_group_msg", () => {
      queryClient.invalidateQueries({ queryKey: ["grpmessages"] });
    });
    connection.on("userInGroup", (data) => {
      setusersInGroup(data);
    });
    connection.on("receivedMsg", async (data) => {
      queryClient.invalidateQueries({ queryKey: ["message"] });

      if ("Notification" in window && data.sender != userData._id) {
        const user = await getUserNameByID(data.sender);
        // Notification.requestPermission().then((result) => {
        //   console.log(result, "notification");

        //   if (result === "granted") {
        //     new Notification(user.name, {
        //       body: data.message,
        //     });
        //   }
        // });
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
              console.log(
                "ServiceWorker registered with scope:",
                registration.scope
              );
            })
            .catch((error) => {
              console.error("ServiceWorker registration failed:", error);
            });
        }
        if ("Notification" in window) {
          Notification.requestPermission()
            .then((permission) => {
              if (permission === "granted") {
                new Notification("Notification title", {
                  body: "Notification body",
                });
              } else {
                console.log("Notification permission denied");
              }
            })
            .catch((err) => {
              console.error("Error requesting notification permission:", err);
            });
        }
      }
    });
    return () => {
      if (socket) {
        socket.disconnect();
        setisConnected(false);
      }
    };
  }, []);
  const handleAuthSuccess = (id: any, data: any) => {
    const browser_name = getBrowserName();
    socket?.emit("authenticated", {
      userID: id,
      session_data: {
        imageType: browser_name,
        socket_id: socketID,
      },
      id: appSocketID,
    });
  };
  const handleSendMsg = (data: any) => {
    socket?.emit("message", data);
  };

  const socketUserID = (data: any) => {
    socket?.emit("set_user_id", data);
    socket?.emit("me", data);
  };
  const socketRommID = (data: any) => {
    socket?.emit("roomID", data);
  };
  const socketUserConnected = (data: any) => {
    socket?.emit("user_connected", data);
  };
  const socketUserWatching = (data: any) => {
    socket?.emit("user_watching", data);
  };
  const socketUserTyping = (data: any) => {
    socket?.emit("user_typing", data);
  };
  const socketUserTyped = (data: any) => {
    socket?.emit("user_typed", data);
  };
  const socketUserWatched = (data: any) => {
    socket?.emit("user_watchout", data);
  };
  const socketLogout = () => {
    socket?.emit("removeUser", userData?._id);
  };
  const socketJoinGroup = (data: any) => {
    socket?.emit("join_group", data);
  };
  const socketRemoveGroup = (data: any) => {
    socket?.emit("remove_group", data);
  };
  const socketSendGroupMsg = (data: any) => {
    socket?.emit("send_group_msg", data);
  };
  const socketUpdateRole = (data: any) => {
    socket?.emit("update_role", data);
  };
  const socketRemoveMember = (data: any) => {
    socket?.emit("remove_member", data);
  };
  const socketAddMember = (data: any) => {
    socket?.emit("add_member", data);
  };
  const socketJoinUserVcall = (data: any) => {
    socket?.emit("videocall", JSON.stringify({ sdp: data }));
  };
  // const isOnline = (id:any) => {
  //   const isActive = activeUsers?.find((res) => res.id == id);
  //   return isActive;
  // };

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketID,
        token,
        activeUsers,
        setactiveUsers,
        handleAuthSuccess,
        handleSendMsg,
        isConnected,
        socketRommID,
        socketSendGroupMsg,
        socketJoinGroup,
        socketRemoveGroup,
        usersInGroup,
        setusersInGroup,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
