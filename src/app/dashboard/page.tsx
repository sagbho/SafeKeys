"use client";
import DashboardHeader from "@/components/dashboard-header";
import { useUser } from "@clerk/nextjs";
import React from "react";

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tighter p-10">
        Hello, {user.firstName}!
      </h1>

      {/* Statistics Charts
        Count of passwords
        Count of services
      */}
    </>
  );
}
