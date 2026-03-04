import { useState, useEffect, useRef } from "react";

type SocialInitialData = {
  platform?: string;
  url?: string;
};

export function useSocialMediaForm(initialData?: SocialInitialData) {
  const isEditMode = !!initialData;

  const getInitialValues = () => ({
    platform: initialData?.platform || "",
    url: initialData?.url || "",
    photo: null as File | null,
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Sync when edit data changes
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
      platform: "",
      url: "",
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
