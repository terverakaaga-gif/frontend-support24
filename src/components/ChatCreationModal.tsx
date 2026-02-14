import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Refresh } from "@solar-icons/react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ChatCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatType: "direct" | "group";
  users: any[];
  selectedUsers: string[];
  onUserSelect: (userId: string) => void;
  groupName: string;
  onGroupNameChange: (name: string) => void;
  onCreate: () => void;
  isLoading: boolean;
}

export function ChatCreationModal({
  isOpen,
  onClose,
  chatType,
  users,
  selectedUsers,
  onUserSelect,
  groupName,
  onGroupNameChange,
  onCreate,
  isLoading,
}: ChatCreationModalProps) {
  if (!isOpen) return null;

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white font-montserrat">
      <CardHeader>
        <CardTitle>
          {chatType === "group" || selectedUsers.length > 1
            ? "Group Chat"
            : "New Chat"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedUsers.length > 1 && (
          <div className="mb-4">
            <Input
              placeholder="Group name"
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              className="mb-2"
            />
            <div className="flex max-w-60 flex-wrap gap-2 mb-2">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u._id === userId);
                return user ? (
                  <span
                    key={userId}
                    className="px-2 py-1 truncate bg-primary-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {user.firstName}
                    <button
                      onClick={() => onUserSelect(userId)}
                      className="text-[#FF2D55]"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                selectedUsers.includes(user._id)
                  ? "bg-primary-100"
                  : "hover:bg-[#66C2EB40]"
              }`}
              onClick={() => onUserSelect(user._id)}
            >
              <Avatar className="h-8 flex w-8 mr-2 overflow-hidden rounded-full items-center justify-center ring-2 ring-white shadow-md">
                <AvatarImage
                  className="h-8 w-8 object-cover"
                  src={user.profileImage}
                />
                <AvatarFallback>
                  {user.firstName.charAt(0).concat(user.lastName.charAt(0))}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-montserrat-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-[#9395A2]">{user.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-700"
          >
            {isLoading ? (
              <Refresh className="h-4 w-4 animate-spin" />
            ) : selectedUsers.length > 1 ? (
              "Create Group"
            ) : (
              "Start Chat"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
