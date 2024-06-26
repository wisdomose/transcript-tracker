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
  if (req.method !== "POST") return res.status(200).send("API up and running");
  const { email = "recordofficer@aju.com", displayName = "Record officer" } =
    req.body;
  try {
    const serviceAccountPath = path.resolve("./public/service.json");
    console.log(serviceAccountPath, process.env);
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

    const app = initializeClientApp(firebaseConfig);
    const db = getFirestore(app);

    try {
      if (process.env.NODE_ENV === "development") {
        // connectStorageEmulator(storage, "localhost", 9199);
        connectFirestoreEmulator(db, "localhost", 8080);
        // connectAuthEmulator(auth, "http://localhost:9099");
      }
    } catch {}

    const userRecord = await getAuth(admin2).createUser({
      email,
      password: "password",
      displayName,
      emailVerified: false,
      disabled: false,
    });

    const doc = {
      userId: userRecord.uid,
      role: ROLES["RECORD_OFFICER"],
      email,
      displayName,
      timestamp: serverTimestamp(),
    };

    const result = await addDoc(collection(db, COLLECTION.USER), doc);

    res.status(200).json(doc);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}
