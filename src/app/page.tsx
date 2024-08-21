import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center flex-col justify-center text-sm lg:flex">
          <h1 className="text-4xl font-bold tracking-tight pt-10 pb-5">
            Unlock Your Digital World Securely.
          </h1>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
