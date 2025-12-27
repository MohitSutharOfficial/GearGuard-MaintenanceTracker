interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'datetime-local';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-odoo-gray-800 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-odoo-border rounded-lg bg-white text-odoo-gray-800 placeholder-odoo-gray-400 focus:outline-none focus:ring-2 focus:ring-odoo-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
