import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accented?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  accented = false,
  hoverable = false,
  ...props
}) => {
  const baseStyle = 'bg-[#16213e] rounded-2xl border border-white/5 shadow-2xl p-6 overflow-hidden relative';
  const borderStyle = accented ? 'border-[#c9a84c]/30 shadow-[#c9a84c]/5' : '';
  const hoverStyle = hoverable ? 'hover:border-[#c9a84c]/30 hover:shadow-[#c9a84c]/10 transition-all duration-300 transform hover:-translate-y-0.5' : '';

  return (
    <div
      className={`${baseStyle} ${borderStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
