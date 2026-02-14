import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatFilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

export const ChatFilterButton = ({
  active,
  onClick,
  label,
  count,
}: ChatFilterButtonProps) => (
  <Button
    variant={active ? "default" : "ghost"}
    onClick={onClick}
    size="sm"
    className={`h-6 px-3 text-xs font-montserrat-bold transition-all rounded-full ${
      active
        ? "bg-primary-700 text-white hover:border hover:border-primary-700 shadow-sm hover:shadow-lg"
        : "text-gray-700 border border-gray-300 shadow-sm hover:bg-primary hover:text-white"
    }`}
  >
    <span className="flex-1">{label}</span>
    <Badge
      variant={active ? "default" : "secondary"}
     className="text-[10px] p-0 w-4 h-4 items-center justify-center ml-2 rounded-full flex"
    >
      {count}
    </Badge>
  </Button>
);