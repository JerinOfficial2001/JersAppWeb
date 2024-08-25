import { GET_LOCAL_STORAGE } from "@/utils/EncryptedCookies";
import { DELETE, GET, POST } from "../services/requests";
import toast from "react-hot-toast";

const userData = GET_LOCAL_STORAGE("JersApp_userData");
export const getContactByUserId = async () => {
  try {
    const response = await GET(`/api/contact?user_id=${userData?._id}`);
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
};
export const addContact = async (
  ContactDetails: any,
  user_id: any,
  name: any,
  Contact_id: any
) => {
  try {
    const response = await POST("/api/contact", {
      ContactDetails,
      user_id,
      name,
      Contact_id,
    });
    if (response.status == "error") {
      //   if (response.message === "already registered") {
      //     props.navigation.navigate("Message", {
      //       id: response.data,
      //     });
      //   } else {
      //     props.navigation.navigate("Home");
      //     return response.data;
      //   }
    } else {
      if (response.status == "ok") {
        // props.navigation.navigate("Home");
      } else {
        console.log(response);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const deleteContactById = async (
  sender_id: any,
  receiver_id: any,
  contact_id: any
) => {
  try {
    const response = await DELETE(
      `/api/contact?sender_id=${sender_id}&receiver_id=${receiver_id}&Contact_id=${contact_id}`
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
