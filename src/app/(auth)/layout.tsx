"use client";
import Spinner from "@/components/Spinner";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
      setLoaded(true);
    });
  }, []);

  if (loaded) return <>{children}</>;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
      <Spinner />
    </div>
  );
}
