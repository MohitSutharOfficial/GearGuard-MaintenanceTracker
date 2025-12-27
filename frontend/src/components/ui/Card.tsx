interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white rounded border border-odoo-border shadow-odoo transition-colors ${padding ? 'p-4' : ''} ${className}`}>
      {children}
    </div>
  );
}
