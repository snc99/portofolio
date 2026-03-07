"use client";

import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/auth.client";
import Loading from "@/components/custom-ui/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.me();
        setIsChecking(false);
      } catch {
        window.location.href = "/auth/login";
      }
    };

    checkAuth();
  }, []);

  if (isChecking) return <Loading />;

  return <>{children}</>;
}
