interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'datetime-local';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="odoo-label">
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
        className="odoo-input"
      />
    </div>
  );
}
