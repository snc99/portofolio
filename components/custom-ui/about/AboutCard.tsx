"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  MoreHorizontal,
  SquarePen,
  Trash2,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AboutCardProps {
  data: {
    id: string;
    description: string;
    photo?: string | null;
  } | null;
  onRequestEdit: () => void;
  onRequestDelete: () => void;
  onRequestCreate: () => void;
}

export default function AboutCard({
  data,
  onRequestEdit,
  onRequestDelete,
  onRequestCreate,
}: AboutCardProps) {
  if (!data) {
    return (
      <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
              <FileText className="h-8 w-8 text-emerald-500" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No About Section
            </h3>

            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Add a short description about yourself to introduce who you are on
              your portfolio.
            </p>

            <Button
              onClick={onRequestCreate}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
            >
              Add About
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center">
              {data.photo ? (
                <img
                  src={data.photo}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-emerald-500" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
              <p className="text-xs text-gray-400">
                A short introduction about you
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
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Description
          </p>

          <div className="bg-gray-50 rounded-xl px-4 py-4 text-sm text-gray-900 leading-relaxed whitespace-pre-line">
            {data.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
