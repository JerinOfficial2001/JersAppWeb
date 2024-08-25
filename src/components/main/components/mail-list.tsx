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

interface MailListProps {
  items: Mail[];
  isChip?: boolean;
}

export function MailList({ items, isChip }: MailListProps) {
  const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0 pb-[100px]">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-row items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex flex-row gap-2 w-full">
              <AvatarIcon name={item.name} />

              <div className="flex flex-col w-full items-start gap-2 rounded-lg  text-left text-sm transition-all">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.name}</div>
                      {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        mail.selected === item.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between align center w-[100%]">
                  <div className="flex gap-1 flex-row align-center ">
                    <div className="text-xs font-medium">{item.subject} :</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {item.text.substring(0, 60)}
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
