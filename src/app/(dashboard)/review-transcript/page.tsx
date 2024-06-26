"use client";
import { APPLICATION_STATUS, Application, Result } from "@/types";
import { Button } from "@headlessui/react";
import {
  Document,
  Page,
  View,
  Image,
  StyleSheet,
  Text,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { Timestamp } from "firebase-admin/firestore";
import { serverTimestamp } from "firebase/firestore";
import moment from "moment";
// import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

export default function ReviewTranscriptPage() {
  const [application, setApplication] = useState<Application>({
    id: "",
    status: APPLICATION_STATUS["CONFIRMED"],
    isSoftCopy: true,
    // @ts-ignore
    timestamp: serverTimestamp(),
    name: "John Doe",
    faculty: "Science and Technology",
    department: "Computer Science",
    dob: "2000-05-15",
    track_no: "CS2024/001",
    sex: "Male",
    approvedAt: "2024-05-01",
    yoa: "2020",
    degreeAwarded: "Bachelor of Science",
    classOfPass: "First Class",
    graduatedAt: "2024-05-25",
    semesters: [
      {
        session: "2020/2021",
        semester: "First Semester",
        results: [
          {
            code: "CSC101",
            title: "Introduction to Computer Science",
            unit: 3,
            grade: 4,
          },
          { code: "MTH101", title: "Calculus I", unit: 3, grade: 3 },
          {
            code: "PHY101",
            title: "Physics for Computer Science I",
            unit: 3,
            grade: 4,
          },
          {
            code: "ENG101",
            title: "Communication Skills I",
            unit: 2,
            grade: 5,
          },
          { code: "GST101", title: "Use of Library", unit: 2, grade: 3 },
        ],
      },
      {
        session: "2020/2021",
        semester: "Second Semester",
        results: [
          {
            code: "CSC102",
            title: "Introduction to Programming",
            unit: 3,
            grade: 5,
          },
          { code: "MTH102", title: "Calculus II", unit: 3, grade: 3 },
          {
            code: "PHY102",
            title: "Physics for Computer Science II",
            unit: 3,
            grade: 4,
          },
          {
            code: "ENG102",
            title: "Communication Skills II",
            unit: 2,
            grade: 4,
          },
          { code: "GST102", title: "Philosophy and Logic", unit: 2, grade: 3 },
        ],
      },
      {
        session: "2021/2022",
        semester: "First Semester",
        results: [
          {
            code: "CSC201",
            title: "Data Structures and Algorithms",
            unit: 3,
            grade: 4,
          },
          { code: "MTH201", title: "Discrete Mathematics", unit: 3, grade: 4 },
          { code: "CSC202", title: "Computer Architecture", unit: 3, grade: 4 },
          {
            code: "STA201",
            title: "Statistics for Computer Science",
            unit: 3,
            grade: 4,
          },
          {
            code: "GST201",
            title: "Entrepreneurship Studies",
            unit: 2,
            grade: 3,
          },
        ],
      },
      {
        session: "2021/2022",
        semester: "Second Semester",
        results: [
          { code: "CSC203", title: "Operating Systems", unit: 3, grade: 5 },
          {
            code: "CSC204",
            title: "Database Management Systems",
            unit: 3,
            grade: 4,
          },
          { code: "MTH202", title: "Linear Algebra", unit: 3, grade: 3 },
          {
            code: "CSC205",
            title: "Object Oriented Programming",
            unit: 3,
            grade: 5,
          },
          {
            code: "GST202",
            title: "Peace and Conflict Resolution",
            unit: 2,
            grade: 4,
          },
        ],
      },
      {
        session: "2022/2023",
        semester: "First Semester",
        results: [
          { code: "CSC301", title: "Software Engineering", unit: 3, grade: 5 },
          { code: "CSC302", title: "Computer Networks", unit: 3, grade: 4 },
          { code: "CSC303", title: "Web Technologies", unit: 3, grade: 5 },
          { code: "CSC304", title: "Theory of Computation", unit: 3, grade: 4 },
          { code: "ELE301", title: "Digital Logic Design", unit: 2, grade: 3 },
        ],
      },
      {
        session: "2022/2023",
        semester: "Second Semester",
        results: [
          {
            code: "CSC305",
            title: "Artificial Intelligence",
            unit: 3,
            grade: 5,
          },
          { code: "CSC306", title: "Mobile Computing", unit: 3, grade: 4 },
          { code: "CSC307", title: "Compiler Construction", unit: 3, grade: 4 },
          { code: "CSC308", title: "Cryptography", unit: 3, grade: 5 },
          { code: "CSC309", title: "Computer Graphics", unit: 3, grade: 4 },
        ],
      },
      {
        session: "2023/2024",
        semester: "First Semester",
        results: [
          { code: "CSC401", title: "Machine Learning", unit: 3, grade: 5 },
          { code: "CSC402", title: "Cloud Computing", unit: 3, grade: 4 },
          { code: "CSC403", title: "Big Data Analytics", unit: 3, grade: 4 },
          { code: "CSC404", title: "Cybersecurity", unit: 3, grade: 4 },
          { code: "CSC405", title: "Project Management", unit: 2, grade: 4 },
        ],
      },
      {
        session: "2023/2024",
        semester: "Second Semester",
        results: [
          { code: "CSC406", title: "Final Year Project", unit: 6, grade: 5 },
          {
            code: "CSC407",
            title: "Professional Ethics in Computing",
            unit: 2,
            grade: 4,
          },
          {
            code: "CSC408",
            title: "Advanced Topics in Computer Science",
            unit: 3,
            grade: 5,
          },
        ],
      },
    ],
  });

  // calculate result

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

  Font.register({
    family: "times new roman",
    src: "/Times New Roman Regular.ttf",
    fontWeight: "normal",
  });
  Font.register({
    family: "times new roman",
    src: "/times new roman bold.ttf",
    fontWeight: "bold",
  });
  Font.register({
    family: "open sans",
    src: "/OpenSans-Bold.ttf",
    fontWeight: "bold",
  });
  Font.register({
    family: "open sans",
    src: "/OpenSans-Regular.ttf",
    fontWeight: "normal",
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      paddingHorizontal: 80,
      paddingVertical: 70,
      fontFamily: "open sans",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    div: {
      flexDirection: "column",
      display: "flex",
    },
    header__image: {
      width: 150,
      height: "auto",
      objectFit: "contain",
      marginHorizontal: "auto",
    },
    h1: {
      textAlign: "center",
      fontSize: 20,
      marginTop: 4,
      fontFamily: "times new roman",
      fontWeight: "bold",
      color: "#002060",
    },
    h2: {
      textAlign: "center",
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 2,
      fontFamily: "times new roman",
    },
    p: {
      fontFamily: "open sans",
      fontSize: 9,
    },
    caps: {
      textTransform: "uppercase",
    },
    bold: {
      fontWeight: "bold",
    },
    table: {
      borderLeft: "0.5px solid black",
      borderTop: "0.5px solid black",
    },
    table__row: {
      borderBottom: "0.5px solid black",
      display: "flex",
      flexDirection: "row",
      minHeight: 16,
    },
    table__head: {
      fontFamily: "open sans",
      fontSize: 9,
      borderRight: "0.5px solid black",
      width: "100%",
      paddingHorizontal: 4,
      paddingVertical: 1,
      height: "100%",
    },
    table__cell: {
      fontFamily: "open sans",
      fontSize: 9,
      borderRight: "0.5px solid black",
      width: "100%",
      paddingHorizontal: 4,
      paddingVertical: 1,
      textAlign: "center",
    },
    course__title: {
      textAlign: "left",
    },
  });

  return (
    <>
      <PDFViewer className="min-h-screen w-screen" showToolbar={true}>
        <Document style={{ width: "100%", backgroundColor: "#ffffff" }}>
          <Page size="A4" style={styles.page}>
            <View style={{ ...styles.div, marginBottom: 14 }} fixed>
              <Image src="/logo.png" style={styles.header__image} />

              <Text style={styles.h1} fixed>
                ARTHUR JARVIS UNIVERSITY
              </Text>
              <Text style={styles.h2} fixed>
                AKPABUYO, CROSS RIVER STATE
              </Text>
            </View>

            <Text
              style={{
                ...styles.p,
                ...styles.bold,
                paddingHorizontal: 4,
                marginTop: 14,
              }}
            >
              EXAMS AND RECORDS
            </Text>
            <Text style={{ ...styles.p, ...styles.bold, paddingHorizontal: 4 }}>
              AJU CAMPU
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 32,
                marginVertical: 14,
                paddingHorizontal: 4,
              }}
              fixed
            >
              <View style={{}}>
                <Text style={{ ...styles.p, ...styles.bold, ...styles.caps }}>
                  STUDENT NAME: {application.name}
                </Text>
                <Text
                  style={{ ...styles.p, ...styles.bold, ...styles.caps }}
                  fixed
                >
                  DATE: {moment(application.approvedAt).format("Do MMMM, YYYY")}
                </Text>
                <Text style={{ ...styles.p, ...styles.bold, ...styles.caps }}>
                  FACULTY: {application.faculty}
                </Text>
                <Text style={{ ...styles.p, ...styles.bold, ...styles.caps }}>
                  DEPARTMENT: {application.department}
                </Text>
              </View>
              <View style={{}}>
                <Text
                  style={{ ...styles.p, ...styles.bold, ...styles.caps }}
                  fixed
                >
                  STUDENT TRACK NUMBER: {application.track_no}
                </Text>
                <Text style={{ ...styles.p, ...styles.bold, ...styles.caps }}>
                  SEX: {application.sex}
                </Text>
                <Text style={{ ...styles.p, ...styles.bold, ...styles.caps }}>
                  DATE OF BIRTH:{" "}
                  {moment(application.dob).format("Do MMMM, YYYY")}
                </Text>
                <Text style={{ ...styles.p, ...styles.bold, ...styles.caps }}>
                  YEAR OF ADMISSION: {application.yoa}
                </Text>
              </View>
            </View>

            {/* section */}
            {application.semesters.map((semester, semIndex) => (
              <View wrap={false} key={`semester-${semIndex + 1}`}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginVertical: 16,
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ ...styles.p, ...styles.bold, width: "80%" }}>
                    SESSION: {semester.session}
                  </Text>
                  <Text
                    style={{
                      ...styles.p,
                      ...styles.bold,
                      ...styles.caps,
                      width: "100%",
                    }}
                  >
                    SEMESTER: {semester.semester}
                  </Text>
                </View>

                <View style={styles.table}>
                  {/* thead */}
                  <View style={styles.table__row}>
                    <Text style={styles.table__head}>S/N</Text>
                    <Text style={styles.table__head}>COURSE CODE</Text>
                    <Text style={styles.table__head}>COURSE TITLE</Text>
                    <Text style={styles.table__head}>UNIT(CU)</Text>
                    <Text style={styles.table__head}>GRADE(G)</Text>
                    <Text style={styles.table__head}>GRADE POINT(CU* G)</Text>
                    <Text style={styles.table__head}>
                      GPA = (SUM CU*G/SUM (CU))
                    </Text>
                  </View>
                  {/* tbody */}
                  {semester.results.map((result, resIndex) => (
                    <View
                      style={styles.table__row}
                      key={`semester-${semIndex + 1}-result-${resIndex + 1}`}
                    >
                      <Text style={styles.table__cell}>{resIndex + 1}</Text>
                      <Text style={styles.table__cell}>{result.code}</Text>
                      <Text
                        style={{
                          ...styles.table__cell,
                          ...styles.course__title,
                        }}
                      >
                        {result.title}
                      </Text>
                      <Text style={styles.table__cell}>{result.unit}</Text>
                      <Text style={styles.table__cell}>{result.grade}</Text>
                      <Text style={styles.table__cell}>
                        {Number.isNaN(result.grade * result.unit)
                          ? ""
                          : result.grade * result.unit}
                      </Text>
                      <Text style={styles.table__cell}></Text>
                    </View>
                  ))}
                  {/* total */}
                  {(() => {
                    const sumUnit =
                      semester.results.length === 0
                        ? 0
                        : semester.results
                            .map((result) => result.unit)
                            .reduce((a, b) => a + b);
                    const sumGP =
                      semester.results.length === 0
                        ? 0
                        : semester.results
                            .map((result) => result.unit * result.grade)
                            .reduce((a, b) => a + b);
                    const gpa = sumGP / sumUnit;

                    return (
                      <View style={styles.table__row}>
                        <Text style={styles.table__cell}></Text>
                        <Text style={styles.table__cell}></Text>
                        <Text style={styles.table__cell}>TOTAL</Text>
                        <Text style={styles.table__cell}>
                          {Number.isNaN(sumUnit) ? "" : sumUnit}
                        </Text>
                        <Text style={styles.table__cell}></Text>
                        <Text style={styles.table__cell}>
                          {Number.isNaN(sumGP) ? "" : sumGP}
                        </Text>
                        <Text style={styles.table__cell}>
                          {(Number.isNaN(gpa) ? 0 : gpa).toPrecision(3)}
                        </Text>
                      </View>
                    );
                  })()}
                </View>
              </View>
            ))}

            {/* summary section */}
            <View wrap={false}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingHorizontal: 4,
                  marginVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    ...styles.p,
                    ...styles.bold,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  SUMMARY
                </Text>
              </View>

              <View style={styles.table}>
                {/* thead */}
                <View style={styles.table__row}>
                  <Text style={styles.table__head}>
                    CUMMULATIVE CREDIT UNIT
                  </Text>
                  <Text style={styles.table__head}>
                    CUMMULATIVE GRADE POINT
                  </Text>
                  <Text style={styles.table__head}>
                    CUMMULATIVE GRADE POINT AVERAGE
                  </Text>
                </View>
                {/* tbody */}
                <View style={styles.table__row}>
                  <Text style={styles.table__cell}>
                    {sumUnit.toPrecision(3)}
                  </Text>
                  <Text style={styles.table__cell}>{sumGP.toPrecision(3)}</Text>
                  <Text style={styles.table__cell}>
                    {(Number.isNaN(gpa) ? 0 : gpa).toPrecision(3)}
                  </Text>
                </View>
              </View>
            </View>

            {/* footnote */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 32,
                marginTop: 12,
                paddingHorizontal: 4,
              }}
            >
              <View style={{}}>
                <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                  <Text style={{ ...styles.p, ...styles.bold }} fixed>
                    DEGREE AWARDED:{" "}
                  </Text>
                  <Text
                    style={{
                      ...styles.p,
                      fontWeight: "normal",
                      ...styles.caps,
                    }}
                  >
                    {application.degreeAwarded}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                  <Text style={{ ...styles.p, ...styles.bold }} fixed>
                    CLASS OF PASS:{" "}
                  </Text>
                  <Text
                    style={{
                      ...styles.p,
                      fontWeight: "normal",
                      ...styles.caps,
                    }}
                  >
                    {grade?.honors}
                  </Text>
                </View>
              </View>
              <View style={{}}>
                <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                  <Text style={{ ...styles.p, ...styles.bold }} fixed>
                    DATE OF GRADUATION:{" "}
                  </Text>
                  <Text
                    style={{
                      ...styles.p,
                      fontWeight: "normal",
                      ...styles.caps,
                    }}
                  >
                    {moment(application.graduatedAt).format("Do MMMM, YYYY")}
                  </Text>
                </View>
              </View>
            </View>

            {/* grading system */}
            <View wrap={false}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginVertical: 16,
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    ...styles.p,
                    ...styles.bold,
                    width: "100%",
                  }}
                >
                  NOTES ON GRADING SYSTEM
                </Text>
              </View>

              <View style={styles.table}>
                {/* thead */}
                <View style={styles.table__row}>
                  <Text style={styles.table__head}>MARKS</Text>
                  <Text style={styles.table__head}>GRADE POINT</Text>
                  <Text style={styles.table__head}>LETTER GRADE</Text>
                  <Text style={styles.table__head}>DESCRIPTION</Text>
                  <Text style={styles.table__head}>CLASS RANGE</Text>
                  <Text style={styles.table__head}>HONOURS</Text>
                </View>
                {/* tbody */}
                {gradingSystem.map((system) => (
                  <View style={styles.table__row} key={system.desc}>
                    <Text style={styles.table__cell}>{system.marks}</Text>
                    <Text style={styles.table__cell}>{system.gp}</Text>
                    <Text style={styles.table__cell}>{system.grade}</Text>
                    <Text style={styles.table__cell}>{system.desc}</Text>
                    <Text style={styles.table__cell}>{system.classRange}</Text>
                    <Text
                      style={{ ...styles.table__cell, ...styles.course__title }}
                    >
                      {system.honors}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* sinage */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 28,
                gap: 60,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "70%",
                  gap: 4,
                }}
              >
                <Text style={{ flexShrink: 0, ...styles.p }}>SIGNED BY:</Text>
                <View style={{ flexGrow: 1 }}>
                  <View
                    style={{
                      ...styles.p,
                      paddingBottom: 4,
                      borderBottom: "0.5px solid black",
                      borderStyle: "dashed",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.p,
                        alignSelf: "center",
                      }}
                    >
                      (NAME OF REGISTRA)
                    </Text>
                  </View>

                  <Text
                    style={{
                      ...styles.p,
                      alignSelf: "center",
                      width: "auto",
                      marginTop: 2,
                    }}
                  >
                    THE REGISTRA
                  </Text>
                </View>
              </View>
              <View style={{ width: "70%", paddingTop: 16 }}>
                <View
                  style={{
                    ...styles.p,
                    paddingBottom: 4,
                    borderBottom: "0.5px solid black",
                    borderStyle: "dashed",
                  }}
                ></View>
                <Text
                  style={{ ...styles.p, textAlign: "center", marginTop: 2 }}
                >
                  (NAME OF EXAMS AND RECORDS)
                </Text>
                <Text style={{ ...styles.p, textAlign: "center" }}>
                  EXAMS AND RECORD
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}
