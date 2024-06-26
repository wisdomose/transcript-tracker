import { APPLICATION_STATUS } from "@/types";
import { Timestamp, serverTimestamp } from "firebase/firestore";

const application = {
  id: "",
  status: APPLICATION_STATUS["CONFIRMED"],
  isSoftCopy: true,
  timestamp: serverTimestamp() as Timestamp,
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
};

export default application;
