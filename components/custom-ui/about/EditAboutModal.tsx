"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EditAboutModalProps {
  open: boolean;
  onClose: () => void;
  values: {
    description: string;
    photoFile: File | null;
    photoUrl: string | null;
  };
  setValues: React.Dispatch<
    React.SetStateAction<{
      description: string;
      photoFile: File | null;
      photoUrl: string | null;
    }>
  >;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: {
    description?: string;
    photo?: string;
  };
}

export default function EditAboutModal({
  open,
  onClose,
  values,
  setValues,
  onSubmit,
  isLoading = false,
  errors = {},
}: EditAboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit About</DialogTitle>
          <DialogDescription>
            Update your about description and photo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-5 mt-4"
        >
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Replace Photo (optional)
            </label>
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  photoFile: e.target.files?.[0] || null,
                }))
              }
              className={errors.photo ? "border-red-500" : ""}
            />
            {errors.photo && (
              <p className="text-sm text-red-500">{errors.photo}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
