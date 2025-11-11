import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { UsersGroupTwoRounded, MenuDots, Pen2, TrashBinTrash, Settings } from "@solar-icons/react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function ParticipantOrganizationCard({
  organization,
  onViewDetails,
}: {
  organization: any;
  onViewDetails: () => void;
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Organization Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <UsersGroupTwoRounded className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-1">
                {organization.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {organization.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-1000">Created on</p>
                  <p className="font-montserrat-semibold">
                    {format(parseISO(organization.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-1000">Last Updated</p>
                  <p className="font-montserrat-semibold">
                    {format(parseISO(organization.updatedAt), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-1000">Organization ID</p>
                  <p className="font-mono text-xs">{organization._id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row md:flex-col gap-2 md:w-32">
           
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MenuDots className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pen2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <TrashBinTrash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
             <Button
              className="border border-primary text-primary hover:bg-primary "
              variant="outline"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}