import { GET, POST } from "@/services/requests";
import { GET_UserData } from "@/utils/EncryptedCookies";
import axios from "axios";

const userData = GET_UserData();
export const AddStatus = async (formData: any) => {
  try {
    const data: any = await POST(`/api/status/add`, formData, "multipart");

    if (data.status == "ok") {
      return data;
    } else {
      console.log(data.message, "StatusERR");
    }
  } catch (error) {
    console.log("AddStatus Err:", error);
  }
};
export const GetAllStatus = async () => {
  try {
    const data: any = await GET("/api/status/get?userID=" + userData._id);
    if (data.status == "ok") {
      return data.data;
    } else {
      console.log(data.message, "StatusERR");
    }
  } catch (error) {
    console.log("AddStatus Err:", error);
  }
};
export const GetStatusByID = async (id: any) => {
  try {
    const data: any = await GET(`/api/status/get/${id}`);
    if (data.status == "ok") {
      return data.data;
    } else {
      console.log(data.message, "StatusERR");
    }
  } catch (error) {
    console.log("AddStatus Err:", error);
  }
};
export const DeleteStatus = async (id: any) => {
  try {
    const data: any = await axios.get(`/api/status/delete/${id}`);
    if (data.status == "ok") {
      return data.data;
    } else {
      console.log(data.message, "StatusERR");
    }
  } catch (error) {
    console.log("AddStatus Err:", error);
  }
};
