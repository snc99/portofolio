
"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ContactFormValues = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  isAvailable: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showAddress: boolean;
  showAvailability: boolean;
};

interface EditContactModalProps {
  open: boolean;
  onClose: () => void;
  values: ContactFormValues;
  setValues: Dispatch<SetStateAction<ContactFormValues>>;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export default function EditContactModal({
  open,
  onClose,
  values,
  setValues,
  onSubmit,
  isLoading = false,
  errors = {},
}: EditContactModalProps) {
  const updateField = <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fields = [
    {
      name: "email" as const,
      label: "Email",
      placeholder: "you@example.com",
      type: "email",
    },
    {
      name: "phone" as const,
      label: "Phone Number",
      placeholder: "081234567890",
      type: "tel",
    },
    {
      name: "whatsapp" as const,
      label: "WhatsApp Number",
      placeholder: "6281234567890",
      type: "tel",
    },
    {
      name: "address" as const,
      label: "Address",
      placeholder: "South Jakarta",
      type: "text",
    },
  ];

  const visibilityFields = [
    { name: "showEmail" as const, label: "Show email publicly" },
    { name: "showPhone" as const, label: "Show phone publicly" },
    { name: "showWhatsapp" as const, label: "Show WhatsApp publicly" },
    { name: "showAddress" as const, label: "Show address publicly" },
    {
      name: "showAvailability" as const,
      label: "Show availability publicly",
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Update your contact information and manage its public visibility.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-4 space-y-5"
        >
          {/* Contact Information */}
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => updateField(field.name, e.target.value)}
                disabled={isLoading}
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && (
                <p className="text-sm text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Availability */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="isAvailable">Open to Work</Label>
                <p className="text-xs text-gray-500">
                  Indicate whether you are available for opportunities.
                </p>
              </div>
              <Switch
                id="isAvailable"
                checked={values.isAvailable}
                onCheckedChange={(checked) =>
                  updateField("isAvailable", checked)
                }
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Public Visibility */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Public Visibility</h3>
              <p className="text-xs text-gray-500">
                Hidden fields should not be exposed by the public API.
              </p>
            </div>

            {visibilityFields.map((field) => (
              <div
                key={field.name}
                className="flex items-center justify-between gap-4"
              >
                <Label htmlFor={field.name} className="cursor-pointer">
                  {field.label}
                </Label>
                <Switch
                  id={field.name}
                  checked={values[field.name]}
                  onCheckedChange={(checked) =>
                    updateField(field.name, checked)
                  }
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
