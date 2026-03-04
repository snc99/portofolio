import { useState, useEffect, useRef } from "react";

type ProjectInitialData = {
  title?: string;
  description?: string | null;
  link?: string | null;
  skillIds?: string[];
};

export function useProjectForm(initialData?: ProjectInitialData) {
  const isEditMode = !!initialData;

  const getInitialValues = () => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    link: initialData?.link || "",
    projectImage: null as File | null,
    skillIds: initialData?.skillIds || ([] as string[]),
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Sync kalau edit item berubah
  useEffect(() => {
    if (isEditMode) {
      setValues(getInitialValues());
    }
  }, [initialData]);

  const clearErrors = () => {
    setErrors({});
  };

  const resetForCreate = () => {
    setValues({
      title: "",
      description: "",
      link: "",
      projectImage: null,
      skillIds: [],
    });

    setErrors({});
    setLoading(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const resetToInitial = () => {
    setValues(getInitialValues());
    setErrors({});
    setLoading(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const reset = () => {
    if (isEditMode) {
      resetToInitial();
    } else {
      resetForCreate();
    }
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    loading,
    setLoading,
    fileRef,
    clearErrors,
    reset,
    resetForCreate,
    resetToInitial,
    isEditMode,
  };
}
