
import { useState, useEffect } from "react";

type ContactInitialData = {
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  isAvailable?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showWhatsapp?: boolean;
  showAddress?: boolean;
  showAvailability?: boolean;
};

export function useContactForm(initialData?: ContactInitialData) {
  const getInitialValues = () => ({
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    whatsapp: initialData?.whatsapp ?? "",
    address: initialData?.address ?? "",

    isAvailable: initialData?.isAvailable ?? false,

    showEmail: initialData?.showEmail ?? true,
    showPhone: initialData?.showPhone ?? true,
    showWhatsapp: initialData?.showWhatsapp ?? true,
    showAddress: initialData?.showAddress ?? false,
    showAvailability: initialData?.showAvailability ?? true,
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
