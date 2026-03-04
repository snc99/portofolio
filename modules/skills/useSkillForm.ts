import { useState, useEffect, useRef } from "react";

type SkillInitialData = {
  name?: string;
};

export function useSkillForm(initialData?: SkillInitialData) {
  const isEditMode = !!initialData;

  const getInitialValues = () => ({
    name: initialData?.name || "",
    photo: null as File | null,
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Sync ketika edit data berubah
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
      name: "",
      photo: null,
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
