"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, MoreHorizontal, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

const SocialMediaTable = ({
  data,
  onDelete,
  onEdit,
}: {
  data: SocialMediaItem[];
  onDelete: (id: string) => void;
  onEdit: (item: SocialMediaItem) => void;
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-[600px] md:min-w-[700px] w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
              Platform
            </th>
            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
              URL
            </th>
            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
              Photo
            </th>
            <th className="w-[80px] px-4 py-3 text-right font-medium whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.platform}
                </td>

                <td className="px-4 py-3 w-[220px]">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-emerald-600 hover:underline"
                  >
                    {item.url}
                  </a>
                </td>

                <td className="px-4 py-3">
                  {item.photo ? (
                    <Image
                      src={item.photo}
                      alt={item.platform}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
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
                colSpan={4}
                className="px-4 py-6 text-center text-gray-500 text-sm"
              >
                No social media data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SocialMediaTable;
