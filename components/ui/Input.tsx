"use client";

type InputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  error?: string | null;
  type?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  label,
  error,
  type = "text",
}: InputProps) {
  return (
    <div className="w-full space-y-1">

      {label && (
        <label className="text-sm text-white/70">
          {label}
        </label>
      )}

      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}




