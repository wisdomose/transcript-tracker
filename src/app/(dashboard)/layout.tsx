"use client";
import Spinner from "@/components/Spinner";
import UserService from "@/services/User";
import { useStore } from "@/store/user";
import { User } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        const userService = new UserService();
        const profile = await userService.profile();
        setUser(profile as unknown as User);
        setLoaded(true);
      } else router.replace("/");
    });
  }, []);

  if (loaded) return <>{children}</>;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
      <Spinner />
    </div>
  );
}
