// import axios from "axios";
import {
  APPLICATION_STATUS,
  Application,
  COLLECTION,
  ROLES,
  Student,
} from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  or,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import UserService from "./User";

export default class ApplicationService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    // this.profile = this.profile.bind(this);
    // this.signUp = this.signUp.bind(this);
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.count = this.count.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.upload = this.upload.bind(this);
    this.findOne = this.findOne.bind(this);
    // this.assignToHostel = this.assignToHostel.bind(this);
    // this.approve = this.approve.bind(this);
    // this.countUnapproved = this.countUnapproved.bind(this);
  }

  async create(params: Pick<Application, "isSoftCopy" | "yoa">) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userService = new UserService();
        const profile = (await userService.profile()) as Student;

        const userCol = collection(this.db, COLLECTION.USER);
        const userDoc = doc(userCol, this.auth.currentUser.uid);

        let application: Application = {
          name: profile.displayName,
          status: APPLICATION_STATUS["PENDING"],
          faculty: profile.faculty,
          department: profile.dept,
          dob: profile.dob,
          track_no: profile.trackNo,
          sex: profile.sex,
          approvedAt: "",
          ...params,
          degreeAwarded: "",
          classOfPass: "",
          graduatedAt: "",
          semesters: [],
          // @ts-ignore
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(this.db, COLLECTION.APPLICATION), {
          owner: userDoc,
          ...application,
        });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findOne(id: string) {
    return new Promise<Application>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const applicationRef = doc(this.db, COLLECTION.APPLICATION, id);

        const querySnapshot = await getDoc(applicationRef);

        if (querySnapshot.exists()) {
          const application = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
          } as Application;
          resolve(application);
        } else throw new Error("No application found");
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAll() {
    return new Promise<Application[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userService = new UserService();
        const profile = await userService.profile();

        // default is fetching as student
        let q = query(collection(this.db, COLLECTION.APPLICATION));
        const applicationCol = collection(this.db, COLLECTION.APPLICATION);

        if (profile.role === ROLES["RECORD_OFFICER"]) {
          q = query(
            applicationCol,
            or(
              where("status", "in", [
                APPLICATION_STATUS["CONFIRMED"],
                APPLICATION_STATUS["ERROR"],
                APPLICATION_STATUS["APPROVED"],
              ])
            )
          );
        } else if (profile.role === ROLES["REGISTRA"]) {
          q = query(applicationCol);
        }

        const querySnapshot = await getDocs(q);
        const applications: Application[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          applications.push({ id: doc.id, ...data } as Application);
        });

        resolve(applications);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async count() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userService = new UserService();
        const profile = await userService.profile();

        // default is fetching as student
        const userRef = doc(
          this.db,
          COLLECTION.USER,
          this.auth.currentUser.uid
        );
        const applicationCol = collection(this.db, COLLECTION.APPLICATION);
        let q = query(applicationCol, where("owner", "==", userRef));

        if (profile.role === ROLES["RECORD_OFFICER"]) {
          q = query(
            applicationCol,
            or(
              where("status", "in", [
                APPLICATION_STATUS["APPROVED"],
                APPLICATION_STATUS["CONFIRMED"],
                APPLICATION_STATUS["ERROR"],
              ])
            )
          );
        } else if (profile.role === ROLES["REGISTRA"]) {
          q = query(applicationCol);
        }

        const querySnapshot = await getCountFromServer(q);
        const count = querySnapshot.data().count;
        resolve(count);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async updateStatus(
    params: Pick<Application, "status" | "id"> & { errorDesc?: string }
  ) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const applicationRef = doc(this.db, COLLECTION.APPLICATION, params.id);
        
        const application = {
          status: params.status,
          errorDesc: params.errorDesc,
        };
        if (!params.errorDesc) delete application.errorDesc;
        
        await updateDoc(applicationRef, application);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async upload(params: Partial<Application> & { id: string }) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const applicationRef = doc(this.db, COLLECTION.APPLICATION, params.id);
        await updateDoc(applicationRef, {
          ...params,
          status: APPLICATION_STATUS["FILLED"],
        });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
