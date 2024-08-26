import { ComponentProps } from "react";
// import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail } from "../data";
import { useMail } from "../use-mail";
import { formatDistanceToNow } from "date-fns";
import AvatarIcon from "@/components/chatComponents/AvatarIcon";
import { useGlobalContext } from "@/utils/globalContext";

interface MailListProps {
  items: [];
  isChip?: boolean;
  title: string;
}

export function MailList({ items, isChip, title }: MailListProps) {
  const [mail, setMail] = useMail();
  const { handleSelectID, configs } = useGlobalContext();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0 pb-[100px]">
        {items?.map((item: any) => (
          <button
            key={item._id}
            className={cn(
              "flex flex-row items-start gap-2 rounded-[10px] border p-3 text-left text-sm transition-all hover:bg-accent",
              configs?.selected === item._id && "bg-muted"
            )}
            onClick={() => handleSelectID(item._id, title)}
          >
            <div className="flex flex-row gap-2 w-full">
              <AvatarIcon
                name={item.name}
                src={item.image ? item.image.url : ""}
              />

              <div className="flex flex-col w-full items-start gap-2 rounded-lg  text-left text-sm transition-all">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        {item.given_name ? item.given_name : item.phone}
                      </div>
                      {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        configs?.selected === item._id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between align center w-[100%]">
                  <div className="flex gap-1 flex-row align-center ">
                    <div className="text-xs font-medium">
                      {title == "Contacts"
                        ? "+91 " + item.phone
                        : item.lastMsg?.name}
                    </div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {item.lastmsg?.msg.substring(0, 60)}
                    </div>
                  </div>
                  {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
                  {isChip && (
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Admin</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
