"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  Trash2,
  SquarePen,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonalInfo } from "@/modules/profile/profile.types";

interface PersonalInfoCardProps {
  data: PersonalInfo | null;
  onRequestDelete: () => void;
  onRequestEdit: () => void;
  onRequestCreate: () => void;
}

export default function PersonalInfoCard({
  data,
  onRequestDelete,
  onRequestEdit,
  onRequestCreate,
}: PersonalInfoCardProps) {
  if (!data) {
    return (
      <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="p-6 md:p-8 lg:p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
              <User className="h-8 w-8 text-emerald-500" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Personal Information
            </h3>

            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Add your personal information so it can be displayed on your
              portfolio.
            </p>

            <Button
              onClick={onRequestCreate}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
            >
              Add Information
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
      <CardContent className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center">
              {data.photo ? (
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-emerald-500" />
              )}
            </div>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="text-xs text-gray-400">
                Manage your basic profile data
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={onRequestEdit}
              >
                <SquarePen className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 
                           data-[highlighted]:bg-red-50 
                           data-[highlighted]:text-red-700"
                onClick={onRequestDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Motto
            </p>
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 break-words">
              {data.motto || "—"}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              CV
            </p>

            {data.cvLink ? (
              <a
                href={data.cvLink}
                download={data.cvFilename}
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 break-all"
              >
                <FileText className="h-4 w-4" />
                Download CV
              </a>
            ) : (
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400">
                No CV uploaded
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
