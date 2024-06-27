"use client";
import Button from "@/components/Button";
import useFetcher from "@/hooks/useFetcher";
import useInput from "@/hooks/useInput";
import UserService, { SignUpResponse } from "@/services/User";
import { Field, Input, Label, Select } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

export default function SignupPage() {
  const { wrapper, data, loading, error } = useFetcher<SignUpResponse>(null);
  const [fname, fnameOpts] = useInput("");
  const [lname, lnameOpts] = useInput("");
  const [sex, sexOpts, setSex] = useInput("");
  const [dob, dobOpts] = useInput("");
  const [trackNo, trackNoOpts] = useInput("");
  const [faculty, facultyOpts] = useInput("");
  const [dept, deptOpts] = useInput("");
  const [email, emailOpts] = useInput("");
  const [password, passwordOpts] = useInput("");
  const router = useRouter();

  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userService = new UserService();
    await wrapper(() =>
      userService.signUp({
        displayName: `${lname} ${fname}`,
        sex,
        dob,
        trackNo,
        faculty,
        dept,
        email,
        password,
      })
    );
  };

  useEffect(() => {
    if (data) {
      router.replace("/");
      toast.success("Signup complete");
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

      <div className="max-w-md mx-auto mt-12">
        <h1 className="font-medium text-4xl mb-1">Signup</h1>
        <p className="text-sm">
          create an account and get access to all the features
        </p>

        <form onSubmit={signup} className="flex flex-col gap-x-6 gap-y-4 mt-10">
          <div className="flex gap-6">
            <Field className="w-full">
              <Label
                htmlFor="lname"
                className={"text-sm font-medium mb-2 block"}
              >
                Last name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="lname"
                id="lname"
                className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                placeholder="John"
                {...lnameOpts}
              />
            </Field>

            <Field className="w-full">
              <Label
                htmlFor="fname"
                className={"text-sm font-medium mb-2 block"}
              >
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="fname"
                id="fname"
                className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                placeholder="Doe"
                {...fnameOpts}
              />
            </Field>
          </div>

          <div className="flex gap-6">
            <Field className="w-full">
              <Label
                htmlFor="lname"
                className={"text-sm font-medium mb-2 block"}
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="lname"
                id="lname"
                className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                placeholder="johndoe@email.com"
                {...emailOpts}
              />
            </Field>

            {/* select */}
            <Field className="w-full">
              <Label
                htmlFor="gender"
                className={"text-sm font-medium mb-2 block"}
              >
                Gender <span className="text-red-500">*</span>
              </Label>

              <Select
                name="gender"
                id="gender"
                aria-label="gender"
                className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                onChange={(e) => {
                  e.preventDefault();
                  setSex(e.target.value);
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </Field>
          </div>

          <Field className="w-full">
            <Label htmlFor="dob" className={"text-sm font-medium mb-2 block"}>
              DOB <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              name="dob"
              id="dob"
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              {...dobOpts}
            />
          </Field>

          <Field className="w-full">
            <Label
              htmlFor="track-no"
              className={"text-sm font-medium mb-2 block"}
            >
              Track No <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="track-no"
              id="track-no"
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              placeholder=""
              {...trackNoOpts}
            />
          </Field>

          <Field className="w-full">
            <Label
              htmlFor="faculty"
              className={"text-sm font-medium mb-2 block"}
            >
              Faculty <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="faculty"
              id="faculty"
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              placeholder=""
              {...facultyOpts}
            />
          </Field>

          <Field className="w-full">
            <Label htmlFor="dept" className={"text-sm font-medium mb-2 block"}>
              Department <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="dept"
              id="dept"
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              placeholder=""
              {...deptOpts}
            />
          </Field>

          <Field className="w-full">
            <Label
              htmlFor="password"
              className={"text-sm font-medium mb-2 block"}
            >
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
              placeholder="*******"
              {...passwordOpts}
            />
          </Field>

          <Button type="submit" label="Signup" loading={loading} block />

          {/* <Input
            type="submit"
            value="Login"
            className="bg-primary focus:bg-primary-accent hover:bg-primary-accent text-white rounded w-full py-2 text-sm cursor-pointer"
          /> */}
        </form>

        <p className="text-center mt-4 text-sm">
          already have an account?{" "}
          <Link
            href="/"
            className="text-accent hover:underline focus:underline"
          >
            login
          </Link>
        </p>
      </div>
    </main>
  );
}
