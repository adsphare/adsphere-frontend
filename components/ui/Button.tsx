import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({
  children,
  loading,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Loading..." : children}
    </button>
  );
}