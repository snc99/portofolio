"use client";

import { Trash2, MoreHorizontal, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatWorkPeriod } from "@/shared/utils/formatPeriod";
import { calculateWorkDuration } from "@/shared/utils/workDuration";

interface WorkItem {
  id: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  isPresent: boolean;
  description?: string;
}

interface Props {
  data: WorkItem[];
  onDelete: (id: string) => void;
  onEdit: (item: WorkItem) => void;
}

export default function WorkExperienceTable({ data, onDelete, onEdit }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Company</th>
            <th className="px-4 py-3 text-left font-medium">Position</th>
            <th className="px-4 py-3 text-left font-medium">Location</th>
            <th className="px-4 py-3 text-left font-medium">Period</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.companyName}
                </td>

                <td className="px-4 py-3 text-gray-600">{item.position}</td>
                <td className="px-4 py-3 text-gray-500">{item.location}</td>

                <td className="px-4 py-3 text-gray-500">
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatWorkPeriod(
                        item.startDate,
                        item.endDate,
                        item.isPresent,
                      )}
                    </span>

                    <span className="text-xs text-gray-400">
                      {calculateWorkDuration(
                        item.startDate,
                        item.endDate,
                        item.isPresent,
                      )}
                    </span>
                  </div>
                </td>

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
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className="
                        flex items-center gap-2
                        text-red-600
                        data-[highlighted]:bg-red-50
                        data-[highlighted]:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No work experience added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
