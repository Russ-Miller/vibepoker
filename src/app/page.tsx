"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginButton from "./components/LoginButton";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/poker");
    }
  }, [user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-2xl">Loading...</div>
      </main>
    );
  }

  if (user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">Welcome to Jacks or Better</h1>
        <p className="text-xl text-gray-600">Sign in to start playing video poker!</p>
        <LoginButton />
      </div>
    </main>
  );
}
