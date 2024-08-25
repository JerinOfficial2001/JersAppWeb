"use client";
import Loader from "@/components/chatComponents/Loader";
import { Separator } from "@/components/ui/separator";
import { DownloadAPK_URL } from "@/controllers/apk";
import { AuthenticateByToken } from "@/controllers/auth";
import { useSocket } from "@/utils/socket";
import { useMutation } from "@tanstack/react-query";
import { Download, MoreVertical } from "lucide-react";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { mutate: Authenticate } = useMutation({
    mutationFn: AuthenticateByToken,
  });
  const { socketID, token } = useSocket();
  useEffect(() => {
    if (token) {
      Authenticate(token);
    }
  }, [token]);

  return (
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
          <h1 className="mt-2 text-xl font-bold text-[#242C3B]  dark:text-white">
            JersApp
          </h1>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-[#4BA9DD] dark:text-white">
          Use JersApp on your computer
        </h2>
        <ul className="max-w-md space-y-1 text-gray-500  list-inside dark:text-gray-400">
          <li>1 . Open JersApp on your phone</li>
          <li className="flex flex-row gap-2">
            2 . On Home page tap click Menu
            <MoreVertical className="bg-[gray] rounded-[5px] p-1 text-black" />
          </li>
          <li className="flex flex-row gap-2">3 . Tap JersApp web and scan </li>
          <li className="flex flex-row gap-2">
            4 . Point your phone to this screen to capture th QR
          </li>{" "}
        </ul>
        <button
          onClick={() => {
            window.open(DownloadAPK_URL);
          }}
          className="mt-2 rounded-[10px] relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white  group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
        >
          <span className="flex gap-2 align-center rounded-[11px] relative px-5 py-2.5 transition-all ease-in duration-75 dark:bg-gray-900 group-hover:bg-opacity-0">
            <Download /> Download Apk
          </span>
        </button>
      </div>
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
          <QRCode style={{ height: "100%", width: "100%" }} value={socketID} />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
