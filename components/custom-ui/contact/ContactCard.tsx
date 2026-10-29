
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Contact as ContactIcon,
  MoreHorizontal,
  SquarePen,
  Trash2,
  Plus,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  BriefcaseBusiness,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Contact } from "@/modules/contact/contact.types";

interface ContactCardProps {
  data: Contact | null;
  onRequestEdit: () => void;
  onRequestDelete: () => void;
  onRequestCreate: () => void;
}

export default function ContactCard({
  data,
  onRequestEdit,
  onRequestDelete,
  onRequestCreate,
}: ContactCardProps) {
  if (!data) {
    return (
      <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <ContactIcon className="h-8 w-8 text-emerald-500" />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Contact Information
            </h3>

            <p className="mb-6 max-w-sm text-sm text-gray-500">
              Add your contact information so recruiters and visitors can reach
              you through your portfolio.
            </p>

            <Button
              onClick={onRequestCreate}
              className="bg-emerald-500 px-6 text-white hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      label: "Email",
      value: data.email,
      visible: data.showEmail,
      icon: Mail,
    },
    {
      label: "Phone",
      value: data.phone,
      visible: data.showPhone,
      icon: Phone,
    },
    {
      label: "WhatsApp",
      value: data.whatsapp,
      visible: data.showWhatsapp,
      icon: MessageCircle,
    },
    {
      label: "Address",
      value: data.address,
      visible: data.showAddress,
      icon: MapPin,
    },
    {
      label: "Availability",
      value: data.isAvailable ? "Open to Work" : "Not Available",
      visible: data.showAvailability,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <Card className="w-full rounded-2xl border border-gray-100 shadow-sm">
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <ContactIcon className="h-6 w-6 text-emerald-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Contact
              </h2>
              <p className="text-xs text-gray-400">
                Manage your contact information and visibility
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
                className="flex items-center gap-2 text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700"
                onClick={onRequestDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Availability */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-gray-500" />

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Open to Work
                </p>
                <p className="text-xs text-gray-500">
                  {data.isAvailable
                    ? "You are available for opportunities"
                    : "You are not currently available"}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                data.isAvailable
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {data.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      {item.label}
                    </p>

                    <p className="mt-1 break-words text-sm text-gray-900">
                      {item.value || "Not provided"}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-1 text-xs ${
                    item.visible ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {item.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}

                  <span>{item.visible ? "Public" : "Hidden"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
