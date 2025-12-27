interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

export default function TextArea({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 4,
  required = false,
  className = ''
}: TextAreaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="odoo-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="odoo-input resize-none"
      />
    </div>
  );
}
