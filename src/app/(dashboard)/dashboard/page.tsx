"use client";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FiInfo, FiUser, FiX } from "react-icons/fi";
import useInput from "@/hooks/useInput";
import { Field, Input, Label, Select } from "@headlessui/react";
import { toast } from "react-toastify";
import useFetcher from "@/hooks/useFetcher";
import ApplicationService from "@/services/Application";
import Button from "@/components/Button";
import { APPLICATION_STATUS, Application, ROLES } from "@/types";
import SignOut from "@/components/SignOut";
import { useStore } from "@/store/user";
import { Approve, Confirm, Send } from "@/components/Actions";

const desc: Record<APPLICATION_STATUS, string> = {
  PENDING: "This application is yet to be confirmed by the registra",
  CONFIRMED:
    "Your application has been confirmed by the registra and is being fulfilled",
  FILLED: "The record officer has submitted your application for review",
  APPROVED: "The registra has approved your application",
  SENT: "Your application is on it's way to the recieving institution",
  ERROR: "There was an error in the application",
};

export default function DashboardPage() {
  const { wrapper, data, loading, error } = useFetcher<boolean>(null);
  const countFetcher = useFetcher<number>(0);
  const findAllFetcher = useFetcher<Application[]>([]);
  let [isOpen, setIsOpen] = useState(false);
  const [yoa, yoaOpts, setYOA] = useInput("");
  const [isSoftCopy, isSoftCopyOpts, setIsSoftCopy] = useInput("yes");
  const user = useStore((state) => state.user);

  const createApplication = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const applicationService = new ApplicationService();
    await wrapper(() =>
      applicationService.create({
        yoa,
        isSoftCopy: isSoftCopy === "yes",
      })
    );
  };

  useEffect(() => {
    if (data) {
      toast.success("Application submitted");
      setYOA("");
      setIsSoftCopy("yes");
      setIsOpen(false);
      window.location.reload();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // count
    const applicationService = new ApplicationService();
    countFetcher.wrapper(() => applicationService.count());

    // find all
    findAllFetcher.wrapper(() => applicationService.findAll());
  }, []);

  return (
    <main className="px-5 py-10 md:px-12 lg:px-24 md:pb-24 md:pt-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-12">
        <Link href="/" className="w-fit block">
          <Image
            src="/logo.png"
            alt=""
            width={150}
            height={150}
            className="mx-auto w-auto h-auto"
            priority
          />
        </Link>

        <div className="flex items-center max-md:justify-end gap-4 flex-wrap">
          {user?.role === ROLES["STUDENT"] && (
            <Button
              label="Apply for your transcript"
              onClick={() => setIsOpen(true)}
              className="w-full md:w-fit"
            />
          )}
          <SignOut />

          <div className="flex items-center gap-2">
            <FiUser className="size-4 shrink-0" />
            <p className="text-sm">{user?.displayName}</p>

            {/* <p className="rounded-full px-4 py-1 text-xs font-bold text-blue-700 bg-blue-100">
              {user?.role}
            </p> */}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/10 backdrop-blur flex w-screen items-center justify-center p-4">
            <button className="absolute top-10 right-10">
              <FiX className="size-10" />
            </button>
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
              <DialogTitle className="font-medium text-2xl mb-4">
                Apply for transcript
              </DialogTitle>
              <form
                onSubmit={createApplication}
                className="flex flex-col gap-x-6 gap-y-4 mt-10"
              >
                <Field className="w-full">
                  <Label
                    htmlFor="yoa"
                    className={"text-sm font-medium mb-2 block"}
                  >
                    Year of admission <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="yoa"
                    id="yoa"
                    className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                    placeholder="2024"
                    {...yoaOpts}
                    required
                  />
                </Field>

                <Field className="w-full">
                  <Label
                    htmlFor="soft-copy"
                    className={"text-sm font-medium mb-2 block"}
                  >
                    Send as soft copy? <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    name="soft-copy"
                    aria-label="soft-copy"
                    className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                    onChange={(e) => {
                      e.preventDefault();
                      setIsSoftCopy(e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </Field>

                <Button type="submit" label="Submit" loading={loading} block />
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="bg-blue-50/50 w-fit rounded-2xl py-5 px-10">
          <p className="">total applications</p>
          <p className="text-3xl font-bold">{countFetcher.data}</p>
        </div>

        {findAllFetcher.loading ? (
          <p className="text-center mt-10">fetching applications</p>
        ) : findAllFetcher.error ? (
          <p className="text-center mt-10">
            we encountered an error fetching applications
            <br />
            {findAllFetcher.error}
          </p>
        ) : findAllFetcher.data.length === 0 ? (
          <p className="text-center mt-10">
            {user?.role === ROLES["STUDENT"]
              ? "You haven't made an application"
              : "No applications at the moment"}
          </p>
        ) : findAllFetcher.data.length > 0 ? (
          <div className="overflow-auto">
            <table className="w-full table-auto mt-10">
              <thead>
                <tr className="">
                  <th className="py-2 text-left px-2 whitespace-nowrap">Application date</th>
                  <th className="py-2 px-2 text-left">Faculty</th>
                  <th className="py-2 px-2 text-left">Department</th>
                  <th className="py-2 px-2 text-left">Status</th>
                  <th className="py-2 px-2 text-left whitespace-nowrap">Delivery format</th>
                  <th className="py-2 text-right pr-2"></th>
                </tr>
              </thead>
              <tbody>
                {findAllFetcher.data.map(({ status, ...entry }) => (
                  <tr key={entry.id} className="odd:bg-blue-50/50">
                    <td className="text-left py-2 px-2 whitespace-nowrap">
                      {moment(new Date(entry.timestamp.toDate())).format(
                        "Do MMMM, YYYY"
                      )}
                    </td>
                    <td className="text-left py-2 px-2">{entry.faculty}</td>
                    <td className="text-left py-2 px-2">{entry.department}</td>
                    <td className="text-left py-2 px-2">
                      <Popover className="group">
                        <div className="flex gap-1">
                          {status === APPLICATION_STATUS["ERROR"] &&
                          user?.role === ROLES["STUDENT"]
                            ? "INPROGRESS"
                            : status}
                          <PopoverButton className="flex items-center gap-2 mb-2 outline-none hover:text-accent">
                            <FiInfo className="size-3" />
                          </PopoverButton>
                        </div>
                        <PopoverPanel
                          anchor="top"
                          className="!max-w-[20ch] text-xs bg-gray-100 p-2 rounded"
                        >
                          {status === APPLICATION_STATUS["ERROR"] &&
                          user?.role === ROLES["STUDENT"]
                            ? "Your application is being worked on"
                            : status === APPLICATION_STATUS["ERROR"]
                            ? entry.errorDesc ?? desc[status]
                            : desc[status]}
                        </PopoverPanel>
                      </Popover>
                    </td>
                    <td className="text-left py-2 px-2">
                      {entry.isSoftCopy ? "softcopy" : "hardcopy"}
                    </td>
                    <td className="text-right py-2 pr-2">
                      {status === APPLICATION_STATUS["PENDING"] ? (
                        <Confirm application={{ status, ...entry }} />
                      ) : status === APPLICATION_STATUS["CONFIRMED"] &&
                        user?.role === ROLES["RECORD_OFFICER"] ? (
                        <Link href={`/transcript?q=${entry.id}`}>
                          data entry
                        </Link>
                      ) : status === APPLICATION_STATUS["FILLED"] ? (
                        <Approve application={{ status, ...entry }} />
                      ) : status === APPLICATION_STATUS["APPROVED"] ? (
                        <Send application={{ status, ...entry }} />
                      ) : status === APPLICATION_STATUS["ERROR"] &&
                        user?.role === ROLES["RECORD_OFFICER"] ? (
                        <Link href={`/transcript?q=${entry.id}`}>
                          {status === APPLICATION_STATUS["ERROR"]
                            ? "fix up"
                            : "data entry"}
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </main>
  );
}
