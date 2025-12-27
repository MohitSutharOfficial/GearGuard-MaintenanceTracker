interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  form?: string;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  form
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variantClasses = {
    primary: 'bg-[#714B67] text-white hover:bg-[#8B5E7F] shadow-sm hover:shadow focus:ring-[#714B67]',
    secondary: 'bg-white text-odoo-gray-700 border border-odoo-border hover:bg-odoo-gray-50 focus:ring-[#714B67]',
    danger: 'bg-odoo-danger text-white hover:bg-red-700 shadow-sm hover:shadow focus:ring-odoo-danger',
    success: 'bg-odoo-success text-white hover:bg-teal-700 shadow-sm hover:shadow focus:ring-odoo-success'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      form={form}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
