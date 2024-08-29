import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  PhoneCall,
  RefreshCw,
  Reply,
  ReplyAll,
  Send,
  Trash2,
  Video,
} from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail } from "../data";
import { addDays, addHours, format, nextSaturday } from "date-fns";
import Bubble from "@/components/chatComponents/Bubble";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessage } from "@/controllers/chat";
import Loader from "@/components/chatComponents/Loader";
import { useEffect, useRef, useState } from "react";
import { getTime, groupMessagesByDate } from "@/utils/Date&Time";
import { useSocket } from "@/utils/socket";
import { GET_UserData } from "@/utils/EncryptedCookies";
import { sendMsg } from "@/controllers/messages";
import { queryClient } from "@/utils/providers";
import toast from "react-hot-toast";
import { RemoveSfromName } from "@/utils/methods";
import { useGlobalContext } from "@/utils/globalContext";
import StoryCarosel from "@/components/chatComponents/StoryCarosel";
import { GetStatusByID } from "@/controllers/story";
import { getGroupMsg } from "@/controllers/groups";

interface MailDisplayProps {
  mail: any;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const userData = GET_UserData();
  const [inputData, setinputData] = useState("");
  const chatID = [userData?._id, mail?.user_id].sort().join("_");
  const today = new Date();
  const {
    handleSendMsg,
    socketRommID,
    socketRemoveGroup,
    socketJoinGroup,
    socketSendGroupMsg,
    usersInGroup,
    setusersInGroup,
  } = useSocket();
  const { title } = useGlobalContext();
  const scrollRef = useRef<any>();
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch,
  } = useQuery({
    queryKey: ["message"],
    queryFn: () => getMessage(mail.user_id),
    enabled: title == "Chats",
  });
  const {
    data: grpmessages,
    isLoading: grpmessagesLoading,
    refetch: refetch_grpmessages,
  } = useQuery({
    queryKey: ["grpmessages"],
    queryFn: () => getGroupMsg(userData._id, mail._id),
    enabled: title == "Groups",
  });
  const {
    data: Story,
    isLoading: storyLoading,
    refetch: refetchStory,
  } = useQuery({
    queryKey: ["Story"],
    queryFn: () => GetStatusByID(mail._id),
    enabled: title == "Story" && !!mail?._id,
  });
  const { mutate: SendMsg, isPending: sending } = useMutation({
    mutationFn: sendMsg,
    onSuccess: (data: any) => {
      if (data && data.status == "ok") {
        handleSendMsg({
          chatID: chatID,
          sender: userData._id,
          receiver: mail._id,
          message: inputData,
          name: userData.name,
        });
        queryClient.invalidateQueries({ queryKey: ["message"] });
      } else {
        toast.error("Send Message failed");
      }
    },
  });
  useEffect(() => {
    if (mail) {
      refetch();
    }
    if (chatID) socketRommID(chatID);
  }, [mail]);
  useEffect(() => {
    if (scrollRef && scrollRef?.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length]);
  const groupedMessages = groupMessagesByDate(
    messages?.map((elem: any) => ({ ...elem, time: getTime(elem.createdAt) }))
  );
  const grouped_GrpMessages = groupMessagesByDate(
    grpmessages?.map((elem: any) => ({
      ...elem,
      time: getTime(elem.createdAt),
    }))
  );

  const Messages = title == "Chats" ? groupedMessages : grouped_GrpMessages;
  const sections = Messages
    ? Object.keys(Messages).map((date) => ({
        title: date,
        data: Messages[date],
      }))
    : [];
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (inputData != "") {
      SendMsg({
        chatID: chatID,
        sender: userData._id,
        receiver: mail.user_id,
        message: inputData,
        name: userData.name,
      });

      setinputData("");
    }
  };

  const name = mail?.given_name
    ? mail?.given_name
    : mail?.phone
    ? mail?.phone
    : mail?.group_name
    ? mail?.group_name
    : mail?.userName
    ? mail?.userName
    : null;

  //*Group
  const [formDatas, setformDatas] = useState({
    msg: "",
    sender_id: userData?._id,
    group_id: mail?._id,
  });

  const groupMembers =
    mail && title == "Groups"
      ? mail.members.filter((elem: any) => elem != userData._id)
      : [];
  const handleSubmitGroup = (e: any) => {
    e.preventDefault();
    if (
      formDatas.msg !== "" &&
      formDatas.group_id !== "" &&
      formDatas.sender_id !== ""
    ) {
      socketSendGroupMsg({
        msg: formDatas.msg,
        sender_id: userData?._id,
        group_id: mail?._id,
        receivers: groupMembers,
        name: userData?.name,
        group_name: mail?.group_name,
      });
      setformDatas((prev) => ({ ...prev, msg: "" }));
    }
  };
  useEffect(() => {
    if (mail && title == "Groups") {
      socketJoinGroup({ groupID: mail._id, userID: userData?._id });

      return () => {
        socketRemoveGroup({ groupID: mail._id, userID: userData?._id });
      };
    }
  }, []);

  return (
    <div className="flex h-[100vh] flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {mail && (
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage
                  alt={name}
                  src={mail.image ? mail.image.url : ""}
                />
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((chunk: any) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{name}</div>
                <div className="line-clamp-1 text-xs cursor-pointer">
                  View Profile
                </div>
              </div>
            </div>
          )}
          {/* <Separator orientation="vertical" className="mx-1 h-6" /> */}
          {/* <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!mail}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip> */}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <PhoneCall className="h-4 w-4" />
                <span className="sr-only">Audio Call</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Audio Call</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Video className="h-4 w-4" />
                <span className="sr-only">Video Call</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video Call</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {title != "Story" ? (
        mail ? (
          <div className="flex flex-1 flex-col overflow-y-auto max-h-[100vh]">
            {messagesLoading || grpmessagesLoading ? (
              <Loader />
            ) : messages?.length > 0 || grpmessages?.length > 0 ? (
              <div className="p-4 text-sm overflow-y-auto max-h-[77vh] chatContainer">
                {sections.map((data: any, index: number) => {
                  return (
                    <div key={index}>
                      <div className="w-[100%] flex flex-col gap-1 justify-center items-center mb-2">
                        <h2 className="text-[#787878] font-bold">
                          {data.title}
                        </h2>
                      </div>
                      {data?.data.map((elem: any, msgIndex: number) => {
                        return (
                          <Bubble
                            key={msgIndex}
                            text={elem.message || elem.msg}
                            name={
                              elem.given_name ? elem.given_name : elem.phone
                            }
                            src={elem.image ? elem.image.url : ""}
                            id={elem.sender || elem.sender_id}
                            time={elem.time}
                          />
                        );
                      })}
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
            ) : (
              <div className="h-[100%] p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                No messages
              </div>
            )}
            <Separator className="mt-auto" />
            <div className="p-4 ">
              <form
                onSubmit={title == "Groups" ? handleSubmitGroup : handleSubmit}
              >
                <div className="grid gap-4 ">
                  <Textarea
                    value={title == "Groups" ? formDatas.msg : inputData}
                    onChange={(e) => {
                      title == "Groups"
                        ? setformDatas((prev) => ({
                            ...prev,
                            msg: e.target.value,
                          }))
                        : setinputData(e.target.value);
                    }}
                    className="p-4 rounded-[10px]"
                    placeholder={`Reply ${
                      mail.given_name
                        ? mail.given_name
                        : mail.phone
                        ? mail.phone
                        : ""
                    }...`}
                  />
                  <div className="flex items-center">
                    <Label
                      htmlFor="mute"
                      className="flex items-center gap-2 text-xs font-normal"
                    >
                      <Switch id="mute" aria-label="Mute thread" /> Mute this
                      thread
                    </Label>
                    <Button
                      type="submit"
                      size="sm"
                      className="ml-auto rounded-[10px] flex gap-1"
                    >
                      {sending ? (
                        <RefreshCw className="h-[20px] loadingBtn" />
                      ) : (
                        <Send className="h-[20px]" />
                      )}{" "}
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="h-[600px] p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
            No {RemoveSfromName(title)} selected
          </div>
        )
      ) : storyLoading && mail ? (
        <Loader />
      ) : title == "Story" && mail ? (
        <div className="w=[100%] h-[90%] flex justify-center items-center">
          <div className="w-[100%] h-[80%]">
            <StoryCarosel story={Story.file} />
          </div>
        </div>
      ) : (
        <div className="h-[600px] p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
          No story selected
        </div>
      )}
    </div>
  );
}
