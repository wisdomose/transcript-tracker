"use client";
import Button from "@/components/Button";
import useFetcher from "@/hooks/useFetcher";
import useInput from "@/hooks/useInput";
import UserService, { LoginResponse } from "@/services/User";
import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
import { FiUnlock } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Home() {
  const { wrapper, data, loading, error } = useFetcher<LoginResponse>(null);
  const [email, emailOpts] = useInput("");
  const [password, passwordOpts] = useInput("");
  const router = useRouter();

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userService = new UserService();
    await wrapper(() => userService.login({ email, password }));
  };

  useEffect(() => {
    if (data) {
      router.replace("/dashboard");
      toast.success("Login sucessful")
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <main className="p-5 py-10 md:p-24 md:py-24">
      <Link href="/">
        <Image
          src="/logo.png"
          alt=""
          width={200}
          height={200}
          className="mx-auto w-auto h-auto"
          priority
        />
      </Link>

      <div className="c max-w-sm mx-auto mt-12">
        <form
          onSubmit={login}
          className="border border-black/30 py-8 px-8 rounded flex flex-col justify-center items-center"
        >
          <FiUnlock className="size-10" />
          <h1 className="text-xl mt-2 mb-6">Login</h1>

          <Field className="w-full mb-3">
            <Label htmlFor="email" className={"text-sm font-medium mb-2 block"}>
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              placeholder="JohnDoe@email.com"
              {...emailOpts}
              required
            />
          </Field>

          <Field className="w-full mb-6">
            <Label
              htmlFor="password"
              className={"text-sm font-medium mb-2 block"}
            >
              Password
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              {...passwordOpts}
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              placeholder="********"
              required
            />
          </Field>

          <Button type="submit" label="Login" loading={loading} block />
        </form>

        <p className="text-center mt-4 text-sm">
          don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-accent hover:underline focus:underline"
          >
            signup
          </Link>
        </p>
      </div>
    </main>
  );
}
