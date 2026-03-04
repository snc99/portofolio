import { useState, useEffect } from "react";

type InitialData = {
  companyName?: string;
  position?: string;
  startDate?: string;
  endDate?: string | null;
  isPresent?: boolean;
  description?: string;
};

export function useWorkExperienceForm(initialData?: InitialData) {
  const isEditMode = !!initialData;

  const normalizeDate = (date?: string | null) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const getInitialValues = () => ({
    companyName: initialData?.companyName || "",
    position: initialData?.position || "",
    startDate: normalizeDate(initialData?.startDate),
    endDate: normalizeDate(initialData?.endDate),
    isPresent: initialData?.isPresent || false,
    description: initialData?.description || "",
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setValues(getInitialValues());
    }
  }, [initialData]);

  const resetForCreate = () => {
    setValues({
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
    });
    setErrors({});
    setLoading(false);
  };

  const resetToInitial = () => {
    setValues(getInitialValues());
    setErrors({});
    setLoading(false);
  };

  const reset = () => {
    isEditMode ? resetToInitial() : resetForCreate();
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    loading,
    setLoading,
    reset,
    isEditMode,
  };
}
