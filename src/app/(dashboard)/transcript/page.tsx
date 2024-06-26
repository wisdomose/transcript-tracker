"use client";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import useFetcher from "@/hooks/useFetcher";
import ApplicationService from "@/services/Application";
import { Application, Result } from "@/types";
import { Field, Input, Label, Select } from "@headlessui/react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const gradingSystem = [
  {
    marks: "70% & ABOVE",
    min: 70,
    max: 100,
    gp: "5.00",
    grade: "A",
    desc: "EXCELLENT",
    classRange: "4.50-5.00",
    classMin: 4.5,
    classMax: 5.0,
    honors: "1ST CLASS HONOURS",
  },
  {
    marks: "60-69",
    min: 60,
    max: 69,
    gp: "4.00",
    grade: "B",
    desc: "GOOD",
    classRange: "3.50-4.49",
    classMin: 3.5,
    classMax: 4.49,
    honors: "2ND CLASS HONOURS (UPPER DIVISION)",
  },
  {
    marks: "50-59",
    gp: "3.00",
    grade: "C",
    desc: "AVERAGE",
    classRange: "2.40-3.49",
    classMin: 2.4,
    classMax: 3.49,
    honors: "2ND CLASS HONOURS (LOWER DIVISION)",
  },
  {
    marks: "45-49",
    gp: "2.00",
    grade: "D",
    desc: "SATISFACTORY",
    classRange: "1.50-2.39",
    classMin: 1.5,
    classMax: 2.39,
    honors: "3RD CLASS",
  },
  {
    marks: "40-44",
    gp: "1.00",
    grade: "E",
    desc: "PASS",
    classRange: "1.00-1.49",
    classMin: 1.0,
    classMax: 1.49,
    honors: "PASS",
  },
  {
    marks: "0-39",
    gp: "0.00",
    grade: "F",
    desc: "FAIL",
    classRange: "0.00-0.99",
    classMin: 0,
    classMax: 0.99,
    honors: "FAIL",
  },
];

export default function TranscriptPage(props: {
  params: {};
  searchParams: {
    q?: string;
  };
}) {
  const defaultResult = {
    code: "",
    title: "",
    unit: 0,
    grade: 0,
  };

  const [application, setApplication] = useState<Application | null>(null);
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("1st");
  const router = useRouter();
  const { wrapper, data, loading, error } = useFetcher<boolean>(null);
  const findFetcher = useFetcher<Application>(null);

  useEffect(() => {
    if (!props.searchParams.q) return;
    const applicationService = new ApplicationService();
    findFetcher.wrapper(() =>
      applicationService.findOne(props.searchParams.q!)
    );
  }, [props.searchParams.q]);

  useEffect(() => {
    if (data) {
      toast.success("Transcript uploaded");
      router.replace("/dashboard");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (findFetcher.data) {
      console.log(findFetcher.data);
      setApplication(findFetcher.data);
    }
  }, [findFetcher.data]);

  useEffect(() => {
    if (findFetcher.error) {
      toast.error(findFetcher.error);
    }
  }, [error]);

  function checkEmptyCells(semIndex: number, shout = false) {
    try {
      if (!application) throw new Error("Initialization failed");
      const { results, session, semester } = application.semesters[semIndex];

      if (!session) throw new Error("Session of study is required");
      if (!semester) throw new Error(`Semester of ${session} is required`);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.code)
          throw new Error(
            `A course code is required for ${session} session, ${semester} semester`
          );
        else if (!result.title)
          throw new Error(
            `A course title for ${result.code} is required for ${session} session, ${semester} semester `
          );
        else if (!result.unit)
          throw new Error(`Unit for ${result.code} is required`);
        else if (result.unit < 1)
          throw new Error(`Invalid unit for ${result.code}`);
        else if (result.grade < 0 || result.grade > 5)
          throw new Error(`Invalid grade for ${result.code}`);
      }

      return false;
    } catch (error: any) {
      shout && alert(error.message);
      return true;
    }
  }

  // update cell info
  function updateCell(
    semIndex: number,
    resIndex: number,
    key: keyof Result,
    value: string | number
  ) {
    setApplication((state) => {
      if (state === null) return state;
      // @ts-ignore
      state.semesters[semIndex].results[resIndex][key] = value;
      return { ...state };
    });
  }

  function addRow(semIndex: number) {
    return () => {
      const isEmpty = checkEmptyCells(semIndex, true);
      if (isEmpty) return;
      setApplication((state) => {
        if (state === null) return state;

        state.semesters[semIndex].results = [
          ...state.semesters[semIndex].results,
          defaultResult,
        ];
        return { ...state };
      });
    };
  }

  function delRow(semIndex: number, resIndex: number) {
    return () => {
      setApplication((state) => {
        if (state === null) return state;

        const results = state.semesters[semIndex].results.filter(
          (entry, index) => index != resIndex
        );
        state.semesters[semIndex].results = [...results];
        return { ...state };
      });
    };
  }

  function updateSemesterInfo(key: "semester" | "session", semIndex: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setApplication((state) => {
        if (state === null) return state;

        state.semesters[semIndex][key] = e.target.value;
        return { ...state };
      });
    };
  }

  function updateApplication(key: keyof Application, value: any) {
    setApplication((state) => {
      if (state === null) return state;

      state[key] = value as never;
      return { ...state };
    });
  }

  function addSemester() {
    if (!application) return;
    if (application.semesters.length > 0) {
      const isEmpty = checkEmptyCells(application.semesters.length - 1, true);
      if (isEmpty) return;
    }

    if (!semester) {
      alert("A semester is required");
      return;
    }
    if (!session) {
      alert("A session is required");
      return;
    }
    setApplication((state) => {
      if (state === null) return state;

      state.semesters = [
        ...state.semesters,
        { session, semester, results: [defaultResult] },
      ];

      return { ...state };
    });

    setSession("");
    setSemester(semester === "1st" ? "2nd" : "1st");
  }

  function findGrade(application: Application) {
    let results: Result[] = [];
    application.semesters.forEach((semester) => {
      results = results.concat(semester.results);
    });

    const sumUnit =
      results.length === 0
        ? 0
        : results.map((result) => result.unit).reduce((a, b) => a + b);
    const sumGP =
      results.length === 0
        ? 0
        : results
            .map((result) => result.unit * result.grade)
            .reduce((a, b) => a + b);
    const gpa = sumGP / sumUnit;
    const grade = gradingSystem.find(
      (system) => gpa >= system.classMin && gpa <= system.classMax
    );

    return { grade, sumUnit, sumGP, gpa: gpa.toPrecision(3) };
  }

  async function saveHandler() {
    let error = false;
    if (!application) return;
    application.semesters.forEach((semester, semIndex) => {
      error = checkEmptyCells(semIndex, true);
    });

    if (error) return;
    const applicationService = new ApplicationService();
    await wrapper(() => applicationService.upload(application!));
  }

  if (findFetcher.loading)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
        <Spinner />
      </div>
    );
  if (application)
    return (
      <main className="p-24 min-w-[1024px]">
        <Link href="/" className="w-fit block mx-auto">
          <Image
            src="/logo.png"
            alt=""
            width={200}
            height={200}
            className="mx-auto w-auto h-auto"
            priority
          />
        </Link>

        <h1 className="text-center text-3xl font-medium mt-7">
          ARTHUR JARVIS UNIVERSITY
        </h1>
        <p className="text-center text-xl font-medium mt-5 mb-7">
          AKPABUYO, CROSS RIVER STATE
        </p>

        <p className="font-medium text-sm">EXAMS AND RECORDS</p>
        <p className="font-medium text-sm">AJU CAMPUS</p>

        <div className="mt-9 flex">
          <div className="">
            <p className="font-medium text-sm uppercase">
              STUDENT NAME: {application.name}
            </p>
            <p className="font-medium text-sm uppercase">
              FACULTY: {application.faculty}
            </p>
            <p className="font-medium text-sm uppercase">
              DATE OF BIRTH: {moment(application.dob).format("Do MMMM, YYYY")}
            </p>
            <p className="font-medium text-sm uppercase">
              DEPARTMENT: {application.department}
            </p>
          </div>
          <div className="ml-36">
            <p className="font-medium text-sm uppercase">
              STUDENT TRACK NUMBER: {application.track_no}
            </p>
            <p className="font-medium text-sm uppercase">
              SEX: {application.sex}
            </p>
            <p className="font-medium text-sm uppercase">
              DATE:{" "}
              {!application.approvedAt
                ? "PENDING APPROVAL"
                : moment(application.approvedAt).format("Do MMMM, YYYY")}
            </p>
            <p className="font-medium text-sm uppercase">
              YEAR OF ADMISSION: {application.yoa}
            </p>
          </div>
        </div>

        {/* semester */}
        {application.semesters.map((semester, semIndex) => (
          <div key={`semester-${semIndex + 1}`} className="mt-14">
            <div className="grid grid-cols-2">
              <p>
                SESSION:{" "}
                <Input
                  type="text"
                  name="session"
                  value={semester.session}
                  className="border border-black rounded-sm text-sm px-2 py-1"
                  onChange={updateSemesterInfo("session", semIndex)}
                />
              </p>
              <p>
                SEMESTER:{" "}
                <Input
                  type="text"
                  name="semester"
                  value={semester.semester}
                  className="border border-black rounded-sm text-sm px-2 py-1"
                  onChange={updateSemesterInfo("semester", semIndex)}
                />
              </p>
            </div>

            <table className="w-full text-sm table-auto mt-10 border-black border-b">
              <thead>
                <tr className="border-t border-black">
                  <th className="px-2 font-normal  border-black border-x">
                    S/N
                  </th>
                  <th className="px-2 font-normal border-black border-r">
                    COURSE CODE
                  </th>
                  <th className="px-2 font-normal border-black border-r">
                    COURSE TITLE
                  </th>
                  <th className="px-2 font-normal border-black border-r">
                    UNIT(CU)
                  </th>
                  <th className="px-2 font-normal border-black border-r">
                    GRADE(G)
                  </th>
                  <th className="px-2 font-normal border-black border-r">
                    GRADE POINT (CU* G)
                  </th>
                  <th className="px-2 font-normal border-black border-r">
                    GPA = (SUM CU*G/SUM (CU))
                  </th>
                </tr>
              </thead>
              <tbody>
                {semester.results.map((result, resIndex) => (
                  <tr
                    key={`semester-${semIndex + 1}-result-${resIndex + 1}`}
                    className="border-t border-black relative"
                  >
                    <td className="text-left px-2 border-black border-x">
                      {resIndex + 1}
                    </td>
                    <td className="text-left border-black border-r relative">
                      <Input
                        type="text"
                        name="code"
                        className="rounded-sm absolute inset-0 px-2"
                        value={result.code}
                        onChange={(e) =>
                          updateCell(semIndex, resIndex, "code", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-left relative border-black border-r">
                      <Input
                        type="text"
                        name="course_title"
                        className="rounded-sm absolute inset-0 px-2"
                        value={result.title}
                        onChange={(e) =>
                          updateCell(
                            semIndex,
                            resIndex,
                            "title",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="text-left relative border-black border-r">
                      <Input
                        type="number"
                        name="course_unit"
                        className="rounded-sm absolute inset-0 px-2"
                        value={result.unit ?? ""}
                        onChange={(e) =>
                          updateCell(
                            semIndex,
                            resIndex,
                            "unit",
                            e.target.valueAsNumber
                          )
                        }
                      />
                    </td>
                    <td className="text-left relative border-black border-r">
                      <Input
                        type="number"
                        name="course_grade"
                        className="rounded-sm absolute inset-0 px-2"
                        value={result.grade ?? ""}
                        max={5}
                        onChange={(e) =>
                          updateCell(
                            semIndex,
                            resIndex,
                            "grade",
                            e.target.valueAsNumber
                          )
                        }
                      />
                    </td>
                    <td className="text-left relative border-black border-r px-2">
                      {Number.isNaN(result.grade * result.unit)
                        ? ""
                        : result.grade * result.unit}
                    </td>
                    <td className="text-left relative border-black border-r"></td>

                    <td className="absolute h-full">
                      <button
                        className="absolute top-0 left-0 bottom-0 px-2 border-black border-y border-r"
                        onClick={delRow(semIndex, resIndex)}
                      >
                        <FiX className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {(() => {
                  const sumUnit = semester.results
                    .map((result) => result.unit)
                    .reduce((a, b) => a + b);
                  const sumGP = semester.results
                    .map((result) => result.unit * result.grade)
                    .reduce((a, b) => a + b);
                  const gpa = sumGP / sumUnit;
                  return (
                    <tr className="border-t border-black relative">
                      <td className="text-left px-2 border-black border-x"></td>
                      <td className="text-left px-2 border-black border-r"></td>
                      <td className="text-left px-2 border-black border-r">
                        TOTAL
                      </td>
                      <td className="text-left px-2 border-black border-r">
                        {Number.isNaN(sumUnit) ? "" : sumUnit}
                      </td>
                      <td className="text-left px-2 border-black border-r"></td>
                      <td className="text-left px-2 border-black border-r">
                        {Number.isNaN(sumGP) ? "" : sumGP}
                      </td>
                      <td className="text-left px-2 border-black border-r">
                        {Number.isNaN(gpa) ? "0" : gpa.toPrecision(3)}
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>

            <button
              className="text-sm flex gap-2 items-center border-x border-black w-full px-2 py-1 border-b rounded-b-lg hover:text-accent"
              onClick={addRow(semIndex)}
            >
              <FiPlus />
              Add a new row
            </button>
          </div>
        ))}

        {/* add a semester */}
        <div className="border p-5 rounded-lg mt-10 ">
          <h2 className="text-lg mb-2 font-medium">Add a new semester</h2>
          <form
            className="flex gap-6 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              addSemester();
            }}
          >
            <Field className="w-full">
              <Label
                htmlFor="session"
                className={"text-sm font-medium mb-2 block"}
              >
                Session <span className="text-red-500">*</span>
              </Label>
              <Input
                type="string"
                name="session"
                id="session"
                className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                placeholder="2024/2025"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </Field>

            <Field className="w-full">
              <Label
                htmlFor="semester"
                className={"text-sm font-medium mb-2 block"}
              >
                Semester <span className="text-red-500">*</span>
              </Label>
              <Select
                name="semester"
                aria-label="semester"
                className="border border-black/40 focus:border-black outline-none rounded px-3 py-2 text-sm w-full"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
              </Select>
            </Field>

            <Input
              type="submit"
              value={`Add semester`}
              className="h-fit bg-primary focus:bg-primary-accent hover:bg-primary-accent text-white rounded w-full py-2 text-sm cursor-pointer"
            />
          </form>
        </div>

        {/* summary */}
        <table className="w-full text-sm table-auto mt-10 mb-14 border-black border-b">
          <thead>
            <tr className="border-t border-black">
              <th className="px-2 font-normal  border-black border-x">
                CUMMULATIVE CREDIT UNIT
              </th>
              <th className="px-2 font-normal border-black border-r">
                CUMMULATIVE GRADE POINT
              </th>
              <th className="px-2 font-normal border-black border-r">
                CUMMULATIVE GRADE POINT AVERAGE
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-black relative">
              <td className="text-left px-2 border-black border-x">
                {findGrade(application)?.sumUnit}
              </td>
              <td className="text-left border-black border-r relative">
                {findGrade(application)?.sumGP}
              </td>

              <td className="text-left relative border-black border-r">
                {findGrade(application)?.gpa}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            DEGREE AWARDED:{" "}
            <Input
              type="text"
              name="degree"
              className="border border-black rounded-sm text-sm px-2 py-1"
              value={application.degreeAwarded}
              onChange={(e) =>
                updateApplication("degreeAwarded", e.target.value)
              }
            />
          </p>
          <p className="font-medium text-sm">
            CLASS OF PASS:{" "}
            <Input
              type="text"
              name="cap"
              className="border border-black rounded-sm text-sm px-2 py-1"
              value={findGrade(application)?.grade?.honors}
              onChange={(e) => {}}
              disabled
            />
          </p>
          <p className="font-medium text-sm">
            DATE OF GRADUATION:{" "}
            <Input
              type="date"
              name="dog"
              className="border border-black rounded-sm text-sm px-2 py-1"
              value={application.graduatedAt}
              onChange={(e) => updateApplication("graduatedAt", e.target.value)}
            />
          </p>
        </div>

        <div className="mt-14">
          <Button
            type="submit"
            // className="flex items-center gap-2 px-5 mt-14 bg-primary focus:bg-primary-accent hover:bg-primary-accent text-white rounded py-2 text-sm cursor-pointer"
            onClick={saveHandler}
            loading={loading}
            label="Save"
          />
          {/* <FiSave /> Save */}
          {/* </Button> */}
        </div>
      </main>
    );
  return null;
}
