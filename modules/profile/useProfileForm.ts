import { useState, useRef, useEffect } from "react";

type ProfileInitialData = {
  motto?: string;
  photo?: string | null; // ✅ URL dari DB
};

export function useProfileForm(initialData?: ProfileInitialData) {
  const isEditMode = !!initialData;

  const getInitialValues = () => ({
    motto: initialData?.motto || "",
    cv: null as File | null,
    photoFile: null as File | null, // ✅ file baru
    photoUrl: initialData?.photo || null, // ✅ url lama
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Sync kalau initialData berubah
  useEffect(() => {
    if (isEditMode) {
      setValues(getInitialValues());
    }
  }, [initialData]);

  const clearErrors = () => {
    setErrors({});
  };

  // CREATE → reset total
  const resetForCreate = () => {
    setValues({
      motto: "",
      cv: null,
      photoFile: null,
      photoUrl: null,
    });

    setErrors({});
    setLoading(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // EDIT → balik ke data DB
  const resetToInitial = () => {
    setValues(getInitialValues());
    setErrors({});
    setLoading(false);

    if (fileRef.current) {
      fileRef.current.value = "";
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
    resetForCreate,
    resetToInitial,
    isEditMode,
  };
}
