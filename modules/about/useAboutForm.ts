import { useState, useEffect } from "react";

type AboutInitialData = {
  description?: string;
  photo?: string | null;
};

export function useAboutForm(initialData?: AboutInitialData) {
  const getInitialValues = () => ({
    description: initialData?.description || "",
    photoFile: null as File | null,
    photoUrl: initialData?.photo || null,
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(getInitialValues());
  }, [initialData]);

  const reset = () => {
    setValues(getInitialValues());
    setErrors({});
    setLoading(false);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    loading,
    setLoading,
    reset,
  };
}
