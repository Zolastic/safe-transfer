import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Safe Transfer",
  description: "Share your secrets securely.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] text-slate-800">
        <TRPCReactProvider>
          {children}
          <SiteFooter />
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
