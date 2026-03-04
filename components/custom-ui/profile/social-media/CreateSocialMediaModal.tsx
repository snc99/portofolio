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

interface CreateSocialMediaModalProps {
  open: boolean;
  onClose: () => void;
  values: {
    platform: string;
    url: string;
    photo: File | null;
  };
  setValues: React.Dispatch<
    React.SetStateAction<{
      platform: string;
      url: string;
      photo: File | null;
    }>
  >;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: {
    platform?: string;
    url?: string;
    photo?: string;
  };
}

export default function CreateSocialMediaModal({
  open,
  onClose,
  values,
  setValues,
  onSubmit,
  isLoading = false,
  errors = {},
}: CreateSocialMediaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Social Media</DialogTitle>
          <DialogDescription>
            Add a new social media account to your profile.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-5 mt-4"
        >
          {/* Platform */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Input
              value={values.platform}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  platform: e.target.value,
                }))
              }
              placeholder="Instagram, LinkedIn, Github..."
              className={errors.platform ? "border-red-500" : ""}
            />
            {errors.platform && (
              <p className="text-sm text-red-500">{errors.platform}</p>
            )}
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile URL</label>
            <Input
              value={values.url}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  url: e.target.value,
                }))
              }
              placeholder="https://..."
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon / Logo</label>
            <Input
              type="file"
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
