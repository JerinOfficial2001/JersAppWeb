import { addChat, getAllChats } from "@/controllers/chat";
import { getContactByUserId } from "@/controllers/contacts";
import { GetGroups } from "@/controllers/groups";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { queryClient } from "./providers";
import { GET_LOCAL_STORAGE } from "./EncryptedCookies";

const GlobalContext = createContext({});
export const useGlobalContext = () => {
  const data = useContext<any>(GlobalContext);
  return data;
};

export default function GlobalContextProvider({ children }: any) {
  const userDatas = GET_LOCAL_STORAGE("JersApp_userData");
  const JersAppThemes: any = {
    whatsappDark: {
      userContainer: "#111b21",
      header: "#202c33",
      text: "white",
      inputBg: "#2a3942",
      subText: "#ffffff99",
      chatContainer: "#0b141a",
      receiverBubbleColor: "#202c33",
      senderBubbleColor: "#005c4b",
    },
    whatsappLight: {
      userContainer: "white",
      header: "#f1efed",
      text: "black",
      inputBg: "",
      subText: "slategray",
      chatContainer: "#e4ddd9",
      receiverBubbleColor: "white",
      senderBubbleColor: "#dcf8c6",
    },
    JersApp: {
      userContainer: "#B8B8B80A",
      header: "#0E0E0E4A",
      text: "white",
      inputBg: "",
      subText: "slategray",
      chatContainer:
        "linear-gradient(125.42deg, rgba(9, 9, 9, 0.23) 8.37%, rgba(176, 176, 176, 0.2) 90.72%)",
      receiverBubbleColor:
        "linear-gradient(98.14deg, rgba(75, 76, 237, 0.71) 2.13%, #37B6E9 98.44%)",
      senderBubbleColor: "#242C3B",
    },
  };
  const [themeHandler, setthemeHandler] = useState<any>("JersApp");
  const [JersAppTheme, setJersAppTheme] = useState<any>(
    JersAppThemes[themeHandler]
  );
  useEffect(() => {
    setJersAppTheme(JersAppThemes[themeHandler]);
  }, [themeHandler]);

  const {
    data: Chats,
    isLoading: chatLoading,
    refetch: refetchChats,
  } = useQuery({
    queryFn: getAllChats,
    queryKey: ["chats"],
    enabled: !!userDatas,
  });
  const {
    data: Contacts,
    refetch: refetchContacts,
    isLoading: contactsLoading,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContactByUserId,
    enabled: !!userDatas,
  });
  const {
    data: Groups,
    refetch: refetchGroups,
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: GetGroups,
    enabled: !!userDatas,
  });
  const { mutate: AddChat, isPending: AddChatLoading } = useMutation({
    mutationFn: addChat,
    onSuccess: (data: any) => {
      if (data.message === "already registered") {
        //  setFocusedIdx(2);
      } else {
        //  setFocusedIdx(0);
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    },
  });

  return (
    <GlobalContext.Provider
      value={{
        JersAppTheme,
        themeHandler,
        setthemeHandler,
        Chats,
        chatLoading,
        Contacts,
        contactsLoading,
        Groups,
        groupsLoading,
        addChat,
        AddChatLoading,
        refetchGroups,
        refetchChats,
        refetchContacts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
