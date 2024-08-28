"use client";
import Loader from "@/components/chatComponents/Loader";
import { Separator } from "@/components/ui/separator";
import { DownloadAPK_URL, getAPK } from "@/controllers/apk";
import { AuthenticateByToken } from "@/controllers/auth";
import useWindowWidth from "@/hooks/windowData";
import { useSocket } from "@/utils/socket";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Ban, Download, MoreVertical, RefreshCw } from "lucide-react";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

interface APKType {
  fileId: string;
}

interface DownloadButtonProps {
  isApkLoading: boolean;
  APK: APKType | null;
  DownloadAPK_URL: string;
}

export default function Home() {
  const { socketID, token, handleAuthSuccess } = useSocket();
  const { mutate: Authenticate } = useMutation({
    mutationFn: AuthenticateByToken,
    onSuccess: (data) => {
      handleAuthSuccess(data?._id);
    },
    onError: (err) => {
      console.log(err, "AUTH ");
    },
  });
  useEffect(() => {
    if (token) {
      Authenticate(token);
    }
  }, [token]);
  const { data: APK, isLoading: isApkLoading } = useQuery({
    queryKey: ["apk"],
    queryFn: getAPK,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    if (APK) {
      setIsLoading(true);

      try {
        const downloadUrl = `${DownloadAPK_URL}/${APK.fileId}`;
        const response = await fetch(downloadUrl);

        if (response.ok) {
          const blob = await response.blob();
          const contentDisposition =
            response.headers.get("Content-Disposition") || "";
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          const filename = filenameMatch ? filenameMatch[1] : "download.apk"; // Default filename if not provided

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } else {
          console.error("Download failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const windowWidth = useWindowWidth();
  const [isClient, setisClient] = useState(false);
  useEffect(() => {
    setisClient(true);
    return () => {
      setisClient(false);
    };
  }, []);

  return (
    <>
      {" "}
      {isClient && (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <div className="w-[100%] flex items-center justify-center flex-col mb-5">
              <img
                src="/JersApp Icon.png"
                alt=""
                className="h-[150px] object-contain float"
              />
              <Separator className="mt-3 w-[50%] h-1 rounded-xl text-[#4BA9DD]" />
              <h1 className="mt-2 text-xl font-bold text-[#4BA9DD]  dark:text-white">
                JersApp
              </h1>
              {windowWidth < 778 && (
                <p className="mt-2 text-[15px] font-semibold text-[#ffffff61]  dark:text-white">
                  Real time chat application
                </p>
              )}
            </div>
            {windowWidth > 778 && (
              <>
                <h2 className="mb-2 text-lg font-semibold text-white dark:text-white">
                  Use JersApp on your computer
                </h2>
                <ul className="max-w-md space-y-1 text-gray-500  list-inside dark:text-gray-400">
                  <li>1 . Open JersApp on your phone</li>
                  <li className="flex flex-row gap-2">
                    2 . On Home page tap click Menu
                    <MoreVertical className="bg-[gray] rounded-[5px] p-1 text-black" />
                  </li>
                  <li className="flex flex-row gap-2">
                    3 . Tap JersApp web and scan{" "}
                  </li>
                  <li className="flex flex-row gap-2">
                    4 . Point your phone to this screen to capture th QR
                  </li>
                </ul>
              </>
            )}

            <button
              onClick={
                isApkLoading || isLoading || !APK ? undefined : handleDownload
              }
              disabled={isApkLoading || isLoading || !APK}
              className="mt-2 rounded-[10px] relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white  group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
            >
              <span
                className={
                  !APK
                    ? "text-[red] flex gap-2 align-center rounded-[11px] relative px-5 py-2.5 transition-all ease-in duration-75 dark:bg-gray-900 group-hover:bg-opacity-0"
                    : "flex gap-2 align-center rounded-[11px] relative px-5 py-2.5 transition-all ease-in duration-75 dark:bg-gray-900 group-hover:bg-opacity-0"
                }
              >
                {isApkLoading || isLoading ? (
                  <RefreshCw className="loadingBtn text-[10px]" />
                ) : APK ? (
                  <Download />
                ) : (
                  <Ban className="text-[red]" />
                )}{" "}
                Download Apk
              </span>
            </button>
          </div>
          {windowWidth > 778 && (
            <div
              style={{
                height: "400px",
                width: "400px",
                padding: 10,
                borderRadius: 10,
                backgroundColor: "white",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              {socketID ? (
                <QRCode
                  style={{ height: "100%", width: "100%" }}
                  value={socketID}
                />
              ) : (
                <Loader />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
