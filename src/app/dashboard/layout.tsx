import DashboardHeader from "@/components/dashboard-header";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardHeader />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 w-full max-w-5xl items-center flex-col justify-center text-sm lg:flex">
            {children}
            <Toaster />
          </div>
        </main>
      </body>
    </html>
  );
}
