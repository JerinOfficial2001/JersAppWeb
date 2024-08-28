import { API, GetAPK_API } from "@/api";
import { GET_LOCAL_STORAGE } from "@/utils/EncryptedCookies";
import axios from "axios";
import toast from "react-hot-toast";

const userData = GET_LOCAL_STORAGE("JersApp_userData");
const headers = userData
  ? {
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
      },
    }
  : {};
const multipartheaders = userData
  ? {
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  : {};

export const GET = async (queryOrParams: any, token?: string) => {
  try {
    const { data } = await axios.get(
      API + queryOrParams,
      token ? { headers: { Authorization: `Bearer ${token}` } } : headers
    );
    return data;
  } catch (error) {
    toast.error("Something went wrong");
  }
};
export const POST = async (
  queryOrParams: any,
  formData: any,
  isMultipart?: any
) => {
  try {
    const { data } = await axios.post(
      API + queryOrParams,
      formData,
      isMultipart ? multipartheaders : headers
    );
    return data;
  } catch (error) {
    toast.error("Something went wrong");
  }
};
export const PUT = async (
  queryOrParams: any,
  formData: any,
  isMultipart?: any
) => {
  try {
    const { data } = await axios.put(
      API + queryOrParams,
      formData,
      isMultipart ? multipartheaders : headers
    );
    return data;
  } catch (error) {
    toast.error("Something went wrong");
  }
};
export const DELETE = async (queryOrParams: any) => {
  try {
    const { data } = await axios.delete(API + queryOrParams, headers);
    return data;
  } catch (error) {
    toast.error("Something went wrong");
  }
};
export const GET_Apk = async (queryOrParams: any) => {
  try {
    const { data } = await axios.get(GetAPK_API + queryOrParams);
    return data;
  } catch (error) {
    toast.error("Something went wrong");
  }
};
