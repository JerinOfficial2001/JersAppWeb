import toast from "react-hot-toast";
import { GET, POST, PUT } from "../services/requests";
import { GET_LOCAL_STORAGE } from "@/utils/EncryptedCookies";

const userData = GET_LOCAL_STORAGE("JersApp_userData");

export const GetGroups = async () => {
  if (userData) {
    try {
      const data = await GET(`/api/group/getGroups?userID=${userData._id}`);
      if (data.status == "ok") {
        return data.data;
      } else {
        toast.error(data.message);
        console.log(data.message, "GetGroupsERR");
        return [];
      }
    } catch (error) {
      console.log("GetGroupsERR Err:", error);
    }
  } else {
    toast.error("Un-autorized");
    return [];
  }
};
export const GetGroupByID = async ({ id, groupID }: any) => {
  try {
    const data = await GET(`/api/group/getgroupbyid/${groupID}?userID=${id}`);
    if (data.status == "ok") {
      return data.data;
    } else {
      console.log(data.message, "GetGroupsERR");
    }
  } catch (error) {
    console.log("GetGroupsERR Err:", error);
  }
};
export const getGroupMsg = async (id: string, groupID: string) => {
  try {
    const data = await GET(`/api/groupMsg?userID=${id}&groupID=${groupID}`);
    if (data) {
      return data.data;
    } else {
      toast.error(data.message);
      return [];
    }
  } catch (error) {
    console.log("getGroupMsgERR", error);
  }
};
export const CreateNewGroup = async ({ token, id, formData }: any) => {
  try {
    const data = await POST(`/api/group/creategroup?userID=${id}`, formData);
    if (data) {
      return data;
    } else {
      console.log("CreateGroupERR");
    }
  } catch (error) {
    console.log("CreateGroup Err:", error);
  }
};
export const UpdateGroup = async ({ token, id, formData, groupID }: any) => {
  try {
    const { data } = await PUT(
      `/api/group/updategroup/${groupID}?userID=${id}`,
      formData
    );
    if (data) {
      return data;
    } else {
      console.log("UpdateGroupERR");
    }
  } catch (error) {
    console.log("UpdateGroup Err:", error);
  }
};
