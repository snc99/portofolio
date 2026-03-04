"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ExternalLink, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  photo: string;
}

interface Project {
  id: string;
  title: string;
  link?: string | null;
  description?: string | null;
  projectImage?: string | null;
  skills: Skill[];
}

interface Props {
  item: Project;
  onDelete: () => void;
  onEdit: () => void;
}

export default function ProjectItemCard({ item, onDelete, onEdit }: Props) {
  return (
    <div className="p-5 border rounded-xl hover:shadow-md transition bg-white">
      <div className="flex justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.title}</h3>

          {item.description && (
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          )}

          {/* Tech Stack */}
          {(item.skills ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {(item.skills ?? []).map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          {/* Link */}
          {item.link && (
            <div className="mt-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Project
              </a>
            </div>
          )}
        </div>

        {/* 🔥 Action Dropdown */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={onEdit}
              >
                <SquarePen className="h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onDelete}
                className="
                  flex items-center gap-2
                  text-red-600
                  data-[highlighted]:bg-red-50
                  data-[highlighted]:text-red-700
                "
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
