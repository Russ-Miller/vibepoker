"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import Image from 'next/image';

export default function SignInWithGoogle() {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Image
        src="/google.svg"
        alt="Google Logo"
        width={20}
        height={20}
      />
      Sign in with Google
    </button>
  );
}
