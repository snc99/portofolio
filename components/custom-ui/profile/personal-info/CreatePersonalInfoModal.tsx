"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreatePersonalInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
  errors?: {
    motto?: string;
    cv?: string;
  };
}

export default function CreatePersonalInfoModal({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  errors = {},
}: CreatePersonalInfoModalProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create Personal Information</DialogTitle>
          <DialogDescription>
            Fill in your basic profile details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Motto</label>
            <Textarea
              name="motto"
              placeholder="Write your personal motto..."
              className={errors.motto ? "border-red-500" : ""}
            />
            {errors.motto && (
              <p className="text-sm text-red-500 mt-1">{errors.motto}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CV</label>
            <Input
              type="file"
              name="cv"
              className={errors.cv ? "border-red-500" : ""}
            />
            {errors.cv && (
              <p className="text-sm text-red-500 mt-1">{errors.cv}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
