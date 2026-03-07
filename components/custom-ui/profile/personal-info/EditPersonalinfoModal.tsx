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

interface EditPersonalModalProps {
  open: boolean;
  onClose: () => void;
  values: {
    motto: string;
    cv: File | null;
    photoFile: File | null;
    photoUrl: string | null;
  };
  setValues: React.Dispatch<
    React.SetStateAction<{
      motto: string;
      cv: File | null;
      photoFile: File | null;
      photoUrl: string | null;
    }>
  >;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: {
    motto?: string;
    cv?: string;
    photoFile?: string;
    photoUrl?: string;
  };
}

export default function EditPersonalModal({
  open,
  onClose,
  values,
  setValues,
  onSubmit,
  isLoading = false,
  errors = {},
}: EditPersonalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Personal Information</DialogTitle>
          <DialogDescription>
            Update your profile information below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-5 mt-4"
        >
          {/* Motto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Motto</label>
            <Textarea
              value={values.motto}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  motto: e.target.value,
                }))
              }
              className={errors.motto ? "border-red-500" : ""}
            />
            {errors.motto && (
              <p className="text-sm text-red-500 mt-1">{errors.motto}</p>
            )}
          </div>

          {/* CV */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Replace CV (optional)</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  cv: e.target.files?.[0] || null,
                }))
              }
              className={errors.cv ? "border-red-500" : ""}
            />
            {errors.cv && (
              <p className="text-sm text-red-500 mt-1">{errors.cv}</p>
            )}
          </div>

          {/* PHOTO */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Replace Profile Photo (optional)
            </label>
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  photo: e.target.files?.[0] || null,
                }))
              }
              className={errors.photoFile ? "border-red-500" : ""}
            />
            {errors.photoFile && (
              <p className="text-sm text-red-500 mt-1">{errors.photoFile}</p>
            )}
          </div>

          {/* Actions */}
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
