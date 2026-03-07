import { useState, useEffect, useRef, useMemo } from "react";

type ProjectInitialData = {
  title?: string;
  description?: string | null;
  link?: string | null;
  skillIds?: string[];
};

export function useProjectForm(initialData?: ProjectInitialData) {
  const isEditMode = !!initialData;

  // ✅ Memo biar gak bikin object baru tiap render
  const initialValues = useMemo(
    () => ({
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      link: initialData?.link ?? "",
      projectImage: null as File | null,
      skillIds: initialData?.skillIds ?? ([] as string[]),
    }),
    [
      initialData?.title,
      initialData?.description,
      initialData?.link,
      initialData?.skillIds,
    ],
  );

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ✅ Sync hanya kalau data edit benar-benar berubah
  useEffect(() => {
    if (isEditMode) {
      setValues(initialValues);
    }
  }, [isEditMode, initialValues]);

  const clearErrors = () => setErrors({});

  const clearFileInput = () => {
    if (fileRef.current) fileRef.current.value = "";
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
    clearFileInput();
  };

  const resetToInitial = () => {
    setValues(initialValues);
    setErrors({});
    setLoading(false);
    clearFileInput();
  };

  const reset = () => (isEditMode ? resetToInitial() : resetForCreate());

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
