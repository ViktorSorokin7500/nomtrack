interface InputWithUnitProps {
  id: string;
  label: string;
  name: string;
  value: string;
  unit: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputWithUnit({
  id,
  label,
  name,
  value,
  unit,
  placeholder,
  onChange,
}: InputWithUnitProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="flex">
        <input
          type="number"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          placeholder={placeholder}
        />
        <span className="inline-flex items-center px-4 py-3 rounded-r-xl border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
          {unit}
        </span>
      </div>
    </div>
  );
}
