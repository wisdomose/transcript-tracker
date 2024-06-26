import { overrideTailwindClasses } from "tailwind-override";

export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={overrideTailwindClasses(
        `w-14 h-14 rounded-full bg-transparent border-2 border-white border-b-primary animate-spin ${className}`
      )}
    ></div>
  );
}
