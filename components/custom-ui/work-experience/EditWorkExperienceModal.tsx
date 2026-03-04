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
import { MonthYearPicker } from "../MonthYearPicker";

interface WorkFormValues {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  description: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  values: WorkFormValues;
  setValues: React.Dispatch<React.SetStateAction<WorkFormValues>>;
  onSubmit: () => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export default function EditWorkExperienceModal({
  open,
  onClose,
  values,
  setValues,
  onSubmit,
  isLoading = false,
  errors = {},
}: Props) {
  const parseMonthYear = (value: string) => {
    if (!value) return { month: null, year: null };
    const [year, month] = value.split("-");
    return {
      month: Number(month) - 1,
      year: Number(year),
    };
  };

  const formatMonthYear = (month: number, year: number) => {
    const mm = String(month + 1).padStart(2, "0");
    return `${year}-${mm}-01`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Work Experience</DialogTitle>
          <DialogDescription>
            Update your professional experience.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4 mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Company Name
              </label>
              <Input
                className={`text-sm h-9 ${
                  errors.companyName ? "border-red-500" : ""
                }`}
                value={values.companyName}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
              />
              {errors.companyName && (
                <p className="text-xs text-red-500">{errors.companyName}</p>
              )}
            </div>

            {/* Position */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Position
              </label>
              <Input
                className={`text-sm h-9 ${
                  errors.position ? "border-red-500" : ""
                }`}
                value={values.position}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
              />
              {errors.position && (
                <p className="text-xs text-red-500">{errors.position}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Start Date
              </label>

              <MonthYearPicker
                {...parseMonthYear(values.startDate)}
                onChange={(month, year) => {
                  const formatted = formatMonthYear(month, year);
                  setValues((prev) => ({
                    ...prev,
                    startDate: formatted,
                  }));
                }}
              />

              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                End Date
              </label>

              <MonthYearPicker
                {...parseMonthYear(values.endDate)}
                disabled={values.isPresent}
                onChange={(month, year) => {
                  const formatted = formatMonthYear(month, year);
                  setValues((prev) => ({
                    ...prev,
                    endDate: formatted,
                  }));
                }}
              />

              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Present Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              checked={values.isPresent}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  isPresent: e.target.checked,
                  endDate: e.target.checked ? "" : prev.endDate,
                }))
              }
            />
            <label className="text-xs text-gray-600">
              Currently working here
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Description
            </label>
            <Textarea
              className={`text-sm ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={3}
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
