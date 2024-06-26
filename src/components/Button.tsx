type Props = {
  label: string;
  type?: "button" | "submit";
  block?: boolean;
  size?: "sm" | "md" | "lg";
  danger?: boolean;
  variant?: "filled" | "outline";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  label,
  type = "button",
  block,
  size,
  danger = false,
  variant = "filled",
  onClick,
  loading = false,
  disabled = false,
}: Props) {
  const className = (function () {
    let className = "relative  rounded py-2 px-5 text-sm cursor-pointer";
    className += block ? " w-full" : " w-fit"; // block
    className += loading ? " text-transparent" : " text-white";
    className += danger
      ? " bg-red-500 focus:bg-red-700 hover:bg-red-700"
      : " bg-primary focus:bg-primary-accent hover:bg-primary-accent";

    return className;
  })();

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square h-[50%]">
          <div className="aspect-square h-full w-full rounded-full bg-transparent border-2 border-white border-b-primary animate-spin"></div>
        </div>
      )}
      {label}
    </button>
  );
}
