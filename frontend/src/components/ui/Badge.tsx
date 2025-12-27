interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'odoo-badge-success',
    warning: 'odoo-badge-warning',
    danger: 'odoo-badge-danger',
    info: 'odoo-badge-info',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`odoo-badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
