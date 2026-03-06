"use client";

import FloatingToggle from "@/components/landing/FloatingToggle";
import { ThemeProvider } from "@/components/landing/ThemeContext";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
      <FloatingToggle />
    </ThemeProvider>
  );
}
