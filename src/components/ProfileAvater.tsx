import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user.types";
import { Logout, Settings, User as UserIcon } from "@solar-icons/react";

interface ProfileAvatarProps {
  user: User;
  onLogout: () => void;
  onViewProfile: () => void;
  onSettings?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  user,
  onLogout,
  onViewProfile,
  onSettings,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage} alt={user.firstName} />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-montserrat-semibold">
          <div className="flex flex-col space-y-1">
            <p className="leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewProfile}>
          <UserIcon size={24} className="mr-2" />
          <span className="font-montserrat-semibold">View Profile</span>
        </DropdownMenuItem>
        {onSettings && (
          <DropdownMenuItem onClick={onSettings}>
            <Settings size={24} className="mr-2" />
            <span className="font-montserrat-semibold">Settings</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <Logout size={24} className="mr-2" />
          <span className="font-montserrat-semibold">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileAvatar;
