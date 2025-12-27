interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`odoo-card ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}
