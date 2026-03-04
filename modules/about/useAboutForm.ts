import { useState, useEffect } from "react";

type AboutInitialData = {
  description?: string;
};

export function useAboutForm(initialData?: AboutInitialData) {
  const getInitialValues = () => ({
    description: initialData?.description || "",
  });

  const [values, setValues] = useState(getInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues({
      description: initialData?.description || "",
    });
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
