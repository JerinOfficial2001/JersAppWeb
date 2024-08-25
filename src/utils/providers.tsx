"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import SocketProvider from "./socket";
import { useRouter } from "next/navigation";
import { GET_LOCAL_STORAGE } from "./EncryptedCookies";
import GlobalContextProvider from "./globalContext";

type Props = {
  children: any;
};
export const queryClient = new QueryClient();
export default function Providers({ children }: Props) {
  const router = useRouter();
  const userData = GET_LOCAL_STORAGE("JersApp_userData");
  useEffect(() => {
    if (userData) {
      router.push("/chats");
    } else {
      router.push("/");
    }
  }, []);
  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </QueryClientProvider>
    </SocketProvider>
  );
}
