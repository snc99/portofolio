"use client";

import Image from "next/image";
import { Trash2, MoreHorizontal, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SkillItem {
  id: string;
  name: string;
  photo?: string;
  createdAt: string;
}

interface SkillsTableProps {
  data: SkillItem[];
  onDelete: (id: string) => void;
  onEdit: (item: SkillItem) => void;
}

const SkillsTable = ({ data, onDelete, onEdit }: SkillsTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Skill</th>
            <th className="px-4 py-3 text-left font-medium">Icon</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* Name */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.name}
                </td>

                {/* Photo */}
                <td className="px-4 py-3">
                  {item.photo ? (
                    <Image
                      src={item.photo}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onEdit(item)}
                      >
                        <SquarePen className="h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 
                          data-[highlighted]:bg-red-50 
                          data-[highlighted]:text-red-700"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-6 text-center text-gray-500 text-sm"
              >
                No skills available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SkillsTable;
