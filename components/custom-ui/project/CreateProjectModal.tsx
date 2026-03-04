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

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

interface ProjectFormValues {
  title: string;
  description: string;
  link: string;
  projectImage: File | null;
  skillIds: string[];
}

interface SkillOption {
  value: string;
  label: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  values: ProjectFormValues;
  setValues: React.Dispatch<React.SetStateAction<ProjectFormValues>>;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
  skillOptions: SkillOption[];
  fileRef: React.RefObject<HTMLInputElement | null>;
}

export default function CreateProjectModal({
  open,
  onClose,
  values,
  setValues,
  onSubmit,
  isLoading = false,
  errors = {},
  skillOptions,
  fileRef,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Add a new project to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4 mt-4"
        >
          {/* 🔥 Grid Layout Sama Seperti Work Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Project Title
              </label>
              <Input
                className={`text-sm h-9 ${
                  errors.title ? "border-red-500" : ""
                }`}
                value={values.title}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Link */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Project Link
              </label>
              <Input
                className={`text-sm h-9 ${errors.link ? "border-red-500" : ""}`}
                value={values.link}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    link: e.target.value,
                  }))
                }
              />
              {errors.link && (
                <p className="text-xs text-red-500">{errors.link}</p>
              )}
            </div>
          </div>
          {/* Tech Stack */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Tech Stack
            </label>

            <Select
              isMulti
              components={animatedComponents}
              options={skillOptions}
              value={skillOptions.filter((option) =>
                values.skillIds.includes(option.value),
              )}
              onChange={(selected) => {
                const ids = selected ? selected.map((item) => item.value) : [];

                setValues((prev) => ({
                  ...prev,
                  skillIds: ids,
                }));
              }}
              className="text-sm"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "36px",
                  fontSize: "0.875rem",
                  borderRadius: "0.5rem",
                }),
              }}
            />

            {errors.skillIds && (
              <p className="text-xs text-red-500">{errors.skillIds}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Project Image
            </label>
            <Input
              type="file"
              ref={fileRef}
              className={`text-sm ${
                errors.projectImage ? "border-red-500" : ""
              }`}
              accept="image/*"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  projectImage: e.target.files?.[0] || null,
                }))
              }
            />
            {errors.projectImage && (
              <p className="text-xs text-red-500">{errors.projectImage}</p>
            )}
          </div>

          {/* Description Full Width */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Description
            </label>
            <Textarea
              rows={3}
              className={`text-sm ${
                errors.description ? "border-red-500" : ""
              }`}
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Buttons Sama Style-nya */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
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
