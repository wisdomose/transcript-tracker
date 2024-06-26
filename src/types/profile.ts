import { FieldValue } from "firebase/firestore";

export enum ROLES {
  REGISTRA = "REGISTRA",
  STUDENT = "STUDENT",
  RECORD_OFFICER = "RECORD_OFFICER",
}

export type Registra = {
  userId: string;
  role: ROLES;
  email: any;
  displayName: any;
  timestamp: FieldValue;
};

export type RecordOfficer = {
  userId: string;
  role: ROLES;
  email: any;
  displayName: any;
  timestamp: FieldValue;
};

export type Student = {
  userId: string;
  role: ROLES;
  displayName: any;
  email: any;
  sex: any;
  dob: any;
  trackNo: any;
  dept: any;
  faculty: any;
  timestamp: FieldValue;
};

export type User = RecordOfficer | Registra | Student;
