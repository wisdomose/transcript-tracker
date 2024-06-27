"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Textarea,
} from "@headlessui/react";
import { FormEvent, useEffect, useState } from "react";
import { FiDownload, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import useFetcher from "@/hooks/useFetcher";
import ApplicationService from "@/services/Application";
import Button from "@/components/Button";
import { APPLICATION_STATUS, Application, ROLES } from "@/types";
import { useStore } from "@/store/user";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./PDF";
import useInput from "@/hooks/useInput";
import UserService, { SignageResponse } from "@/services/User";

export function Approve({ application }: { application: Application }) {
  const status: APPLICATION_STATUS = APPLICATION_STATUS["APPROVED"];
  const user = useStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { wrapper, data, loading, error } = useFetcher<boolean>(null);
  const [errorDesc, setErrorDesc] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setHasError(false);
      setDownloaded(false);
      setErrorDesc("");
    }
  }, [isOpen]);

  const actionHandler = async () => {
    const applicationService = new ApplicationService();
    await wrapper(() =>
      applicationService.updateStatus({
        id: application.id,
        status: status,
      })
    );
  };

  const errorHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const applicationService = new ApplicationService();
    await wrapper(() =>
      applicationService.updateStatus({
        id: application.id,
        status: APPLICATION_STATUS["ERROR"],
        errorDesc,
      })
    );
  };

  async function downloadURI(uri: string | null, name: string) {
    if (!uri) return;
    const link = document.createElement("a");
    link.href = uri;
    link.download = name;
    link.click();
  }

  useEffect(() => {
    if (data) {
      toast.success(
        hasError ? "Application has been reviewed" : "Application Approved"
      );
      window.location.reload();
    }
  }, [data, hasError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (user?.role != ROLES["REGISTRA"]) return null;
  return (
    <>
      <button onClick={() => setIsOpen(true)}>approve</button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/10 backdrop-blur flex w-screen items-center justify-center p-4">
          <button className="absolute top-10 right-10">
            <FiX className="size-10" />
          </button>
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 w-[80vw]">
            {!hasError && (
              <div className="text-4xl border w-20 h-20 flex items-center justify-center rounded-full text-primary-accent border-primary-accent mx-auto">
                {downloaded ? "2" : "1"}
              </div>
            )}

            {hasError ? (
              <p>
                Write a brief description on why you are rejecting this
                application
              </p>
            ) : (
              <p className="text-center max-w-[35ch] mx-auto">
                {downloaded
                  ? "Make sure you have properly read the transcript before approving"
                  : "Download and review the transcript before approval"}
              </p>
            )}

            {downloaded ? (
              <>
                {hasError ? (
                  <form className="" onSubmit={errorHandler}>
                    <Field className="w-full mb-3">
                      <Textarea
                        id="desc"
                        className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full min-h-40"
                        value={errorDesc}
                        onChange={(e) => setErrorDesc(e.target.value)}
                      ></Textarea>
                    </Field>
                    <Button
                      type="submit"
                      label="Submit"
                      block
                      loading={loading}
                    />
                  </form>
                ) : (
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <Button
                      label="Approve"
                      onClick={actionHandler}
                      loading={loading}
                    />

                    <Button
                      label="Reject"
                      onClick={() => setHasError(true)}
                      danger
                      loading={loading}
                    />
                  </div>
                )}
              </>
            ) : (
              <div>
                <BlobProvider document={<PDF application={application} />}>
                  {(params) => (
                    <>
                      {params.error ? (
                        <>an error occured</>
                      ) : (
                        <button
                          className="flex items-center gap-2 relative bg-primary focus:bg-primary-accent hover:bg-primary-accent rounded py-2 px-5 text-sm cursor-pointer w-fit text-white mx-auto"
                          onClick={() => {
                            downloadURI(
                              params.url,
                              application.track_no + "-" + application.name
                            );
                            setDownloaded(true);
                          }}
                        >
                          <FiDownload />
                          {params.loading
                            ? "Loading..."
                            : "Download transcript"}
                        </button>
                      )}
                    </>
                  )}
                </BlobProvider>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export function Confirm({ application }: { application: Application }) {
  const status: APPLICATION_STATUS = APPLICATION_STATUS["CONFIRMED"];
  const user = useStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const { wrapper, data, loading, error } = useFetcher<boolean>(null);

  const actionHandler = async () => {
    const applicationService = new ApplicationService();
    await wrapper(() =>
      applicationService.updateStatus({
        id: application.id,
        status,
      })
    );
  };

  useEffect(() => {
    if (data) {
      toast.success("Application confirmed");
      window.location.reload();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (user?.role != ROLES["REGISTRA"]) return null;
  return (
    <>
      <button onClick={() => setIsOpen(true)}>confirm</button>

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
            <Row label={"Name"} value={application.name} />
            <Row label={"Track number"} value={application.track_no} />
            <Row label={"Sex"} value={application.sex} />
            <Row label={"Faculty"} value={application.faculty} />
            <Row label={"Department"} value={application.department} />
            <Row label={"year of admission"} value={application.yoa} />
            <div className="mt-2"></div>
            <Button
              label="Confirm"
              onClick={actionHandler}
              loading={loading}
              block
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export function Send({ application }: { application: Application }) {
  const status: APPLICATION_STATUS = APPLICATION_STATUS["SENT"];
  const user = useStore((state) => state.user);
  const [email, emailOpts] = useInput("");
  const [isOpen, setIsOpen] = useState(false);
  const { wrapper, data, loading, error } = useFetcher<boolean>(null);
  const signageFetcher = useFetcher<SignageResponse>(null);

  const actionHandler = async () => {
    const applicationService = new ApplicationService();
    await wrapper(() =>
      applicationService.updateStatus({
        id: application.id,
        status,
      })
    );
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await actionHandler();
  };

  async function downloadURI(uri: string | null, name: string) {
    if (!uri) return;
    const link = document.createElement("a");
    link.href = uri;
    link.download = name;
    link.click();
  }

  useEffect(() => {
    const userService = new UserService();
    signageFetcher.wrapper(() => userService.signage());
  }, []);

  useEffect(() => {
    if (data) {
      toast.success("Transcript sent");
      window.location.reload();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (user?.role != ROLES["RECORD_OFFICER"]) return null;

  return (
    <>
      <button onClick={() => setIsOpen(true)}>send</button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/10 backdrop-blur flex w-screen items-center justify-center p-4">
          <button className="absolute top-10 right-10">
            <FiX className="size-10" />
          </button>
          <DialogPanel className="max-w-xl space-y-4 border bg-white p-12">
            <DialogTitle className={"font-semibold"}>
              {application.isSoftCopy
                ? "Enter the email of the recieving school"
                : "Download for courier"}
            </DialogTitle>
            {application.isSoftCopy ? (
              <form onSubmit={submitHandler} className="w-full min-w-[400px]">
                <Field className="w-full mb-3">
                  <Label
                    htmlFor="email"
                    className={"text-sm font-medium mb-2 block"}
                  >
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

                <Button label="Send" type="submit" loading={loading} block />
              </form>
            ) : signageFetcher.loading ? (
              <>loading...</>
            ) : signageFetcher.data ? (
              <div>
                <BlobProvider
                  document={
                    <PDF
                      application={application}
                      signage={signageFetcher.data}
                    />
                  }
                >
                  {(params) => (
                    <>
                      {params.error ? (
                        <>an error occured</>
                      ) : (
                        <button
                          className="flex items-center gap-2 relative bg-primary focus:bg-primary-accent hover:bg-primary-accent rounded py-2 px-5 text-sm cursor-pointer w-fit text-white mx-auto"
                          onClick={async () => {
                            await downloadURI(
                              params.url,
                              application.track_no +
                                "-" +
                                application.name +
                                "-approved"
                            );
                            actionHandler();
                          }}
                        >
                          <FiDownload />
                          {params.loading
                            ? "Loading..."
                            : "Download transcript"}
                        </button>
                      )}
                    </>
                  )}
                </BlobProvider>
              </div>
            ) : (
              <p></p>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-14 border-b py-2">
      <div className="place-self-start font-semibold">{label}</div>
      <div className="place-self-end">{value}</div>
    </div>
  );
}
