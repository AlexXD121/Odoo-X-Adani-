import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MaintFlow - Industrial Maintenance",
  description: "Next-gen industrial maintenance and operations platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-slate-50 min-h-screen text-slate-900`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
