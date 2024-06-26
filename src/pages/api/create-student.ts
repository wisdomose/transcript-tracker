import { COLLECTION, ROLES } from "@/types";
import * as admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { firebaseConfig } from "@/lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(200).send("API up and running");
    const serviceAccountPath = path.resolve("./public/service.json");
    // const {
    //   displayName = "test iyoriobhe wisdom",
    //   sex = "",
    //   dob = "2024-06-25",
    //   trackNo = "17/184145016TR",
    //   faculty = "physical science",
    //   dept = "computer science",
    //   email = "student@gmail.com",
    //   password = "password",
    // } = req.body;
    const { displayName, email, sex, dob, trackNo, dept, faculty, password } =
      req.body;

    const admin2 =
      admin.apps.length > 0
        ? admin.app("admin")
        : admin.initializeApp(
            {
              // TODO: don't put this in production level code
              credential: admin.credential.cert(serviceAccountPath),
            },
            "admin"
          );

    initializeClientApp(firebaseConfig);
    const db = getFirestore();

    try {
      if (process.env.NODE_ENV === "development") {
        // connectStorageEmulator(storage, "localhost", 9199);
        connectFirestoreEmulator(db, "localhost", 8080);
        // connectAuthEmulator(auth, "http://localhost:9099");
      }
    } catch {}

    const userRecord = await getAuth(admin2).createUser({
      emailVerified: false,
      disabled: false,
      email,
      password,
      displayName,
    });

    const doc = {
      userId: userRecord.uid,
      role: ROLES["STUDENT"],
      displayName,
      email,
      sex,
      dob,
      trackNo,
      dept,
      faculty,
      timestamp: serverTimestamp(),
    };

    const result = await addDoc(collection(db, COLLECTION.USER), doc);

    res.status(200).json(doc);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}
