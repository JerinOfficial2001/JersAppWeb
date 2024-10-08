import { GET_LOCAL_STORAGE } from "@/utils/EncryptedCookies";
import { DELETE, GET, POST } from "../services/requests";
import toast from "react-hot-toast";
const userData = GET_LOCAL_STORAGE("JersApp_userData");

export const getMessage = async (id: any) => {
  const chatID = [userData._id, id].sort().join("_");
  try {
    const response = await GET("/api/message");

    if (response.status == "ok") {
      const filteredMsg = response.data.filter(
        (msg: any) => msg.chatID == chatID
      );

      if (filteredMsg) {
        return filteredMsg;
      }
    }
  } catch (error) {
    console.error("Error sending private message:", error);
  }
};
export const getAllChats = async () => {
  if (userData) {
    try {
      const response = await GET(`/api/chats?user_id=${userData?._id}`);
      if (response.status == "ok") {
        return response.data;
      } else {
        toast.error(response.message);
        return [];
      }
    } catch (error) {
      toast.error("Failed to load");
      return error;
    }
  } else {
    return [];
  }
};
export const addChat = async (id: any) => {
  if (userData) {
    try {
      const data = await POST("/api/contact?userID=" + userData._id, id);
      return data;
    } catch (error) {
      console.log(error);
    }
  } else {
    toast.error("Un-authenticated");
  }
};
export const deleteMessageById = async (id: any) => {
  try {
    const response = await DELETE(`/api/message?id=${id}`);

    return response;
  } catch (error) {
    console.log(error);
  }
};
