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

interface EditSkillModalProps {
  open: boolean;
  onClose: () => void;
  values: {
    name: string;
    photo: File | null;
    level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
  };
  setValues: React.Dispatch<
    React.SetStateAction<{
      name: string;
      photo: File | null;
      level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
    }>
  >;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: {
    name?: string;
    photo?: string;
  };
}

export default function EditSkillModal({
  open,
  onClose,
  values,
  setValues,
  fileRef,
  onSubmit,
  isLoading = false,
  errors = {},
}: EditSkillModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
          <DialogDescription>Update your skill information.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-5 mt-4"
        >
          {/* Skill Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill Name</label>
            <Input
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Skill Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill Level</label>
            <select
              value={values.level}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  level: e.target.value as any,
                }))
              }
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
            >
              <option value="JUNIOR">Junior</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="SENIOR">Senior</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          {/* Replace Icon */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Replace Icon (optional)
            </label>
            <Input
              ref={fileRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  photo: e.target.files?.[0] || null,
                }))
              }
              className={errors.photo ? "border-red-500" : ""}
            />
            {errors.photo && (
              <p className="text-sm text-red-500">{errors.photo}</p>
            )}
          </div>

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
