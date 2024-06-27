import { COLLECTION, Student, User } from "@/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export type LoginResponse = {};
export type SignUpResponse = Student;
export type SignageResponse = { registra: string; recordOfficer: string }

export default class UserService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.login = this.login.bind(this);
    this.profile = this.profile.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signage = this.signage.bind(this);
  }

  // user, student and record officer
  async login({ email, password }: { email: string; password: string }) {
    return new Promise<LoginResponse>(async (resolve, reject) => {
      await signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          resolve(userCredential.user);
        })
        .catch((error) => {
          reject(error.code);
          // const errorCode = error.code;
          // const errorMessage = error.message;
        });
    });
  }

  // only students can signup
  async signUp(
    params: Pick<
      Student,
      "displayName" | "email" | "sex" | "dob" | "trackNo" | "dept" | "faculty"
    > & { password: string }
  ) {
    return new Promise<SignUpResponse>(async (resolve, reject) => {
      try {
        if (this.auth.currentUser)
          throw new Error("You cannot perform this operation");

        const result = await axios({
          url: `/api/create-student`,
          method: "POST",
          data: params,
        });
        resolve(result.data);
      } catch (error: any) {
        reject(error.code);
      }
    });
  }

  async profile() {
    return new Promise<User>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const q = query(
          collection(this.db, COLLECTION.USER),
          where("userId", "==", this.auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const profile = {
            id: doc.id,
            ...doc.data(),
          };

          resolve(profile as unknown as User);
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async signage() {
    return new Promise<SignageResponse>(
      async (resolve, reject) => {
        try {
          if (!this.auth.currentUser)
            throw new Error("You need to be logged in");
          const registraQuery = query(
            collection(this.db, COLLECTION.USER),
            where("email", "==", "registra@aju.com")
          );
          const recordOfficerQuery = query(
            collection(this.db, COLLECTION.USER),
            where("email", "==", "recordofficer@aju.com")
          );

          const registraQuerySnapshot = await getDocs(registraQuery);
          const recordOfficerQuerySnapshot = await getDocs(recordOfficerQuery);

          let result = { registra: "", recordOfficer: "" };
          if (!registraQuerySnapshot.empty) {
            const doc = registraQuerySnapshot.docs[0];
            result.registra = doc.data().displayName;
          }
          if (!recordOfficerQuerySnapshot.empty) {
            const doc = recordOfficerQuerySnapshot.docs[0];
            result.recordOfficer = doc.data().displayName;
          }
          resolve(result);
        } catch (error: any) {
          reject(error.message);
        }
      }
    );
  }
}
