interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  required = false,
  disabled = false,
  className = ''
}: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label className="odoo-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="odoo-input disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
