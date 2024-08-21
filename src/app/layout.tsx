import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import InitializeUser from "@/utils/initialize";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafeKeys",
  description: "Unlock your digital world securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <InitializeUser />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
