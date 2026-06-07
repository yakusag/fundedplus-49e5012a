import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "FundedPlus — Get Funded. Trade Bigger.",
  description: "Pass our trading challenge and trade up to $200K of our capital. Keep up to 90% of profits.",
  openGraph: {
    title: "FundedPlus — Get Funded. Trade Bigger.",
    description: "Pass our trading challenge and trade up to $200K of our capital. Keep up to 90% of profits.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FundedPlus — Get Funded. Trade Bigger.",
    description: "Pass our trading challenge and trade up to $200K of our capital. Keep up to 90% of profits.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#0a1530" />
        </head>
        <body>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
