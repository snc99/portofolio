import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/landing/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Muhamad Irvan Sandy",
  description: "Portfolio website of Muhamad Irvan Sandy.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
