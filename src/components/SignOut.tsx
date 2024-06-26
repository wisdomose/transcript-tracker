"use client";
import { getAuth, signOut } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";

export default function SignOut() {
  async function logout() {
    const auth = getAuth();
    await signOut(auth);
  }
  return (
    <button
      onClick={logout}
      className="border border-primary focus:bg-primary hover:bg-primary text-primary focus:text-white hover:text-white rounded py-2 px-5 text-sm cursor-pointer"
    >
      <FiLogOut />
    </button>
  );
}
