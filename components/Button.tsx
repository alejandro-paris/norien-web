import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-md font-medium transition-all duration-300 ease-out flex items-center justify-center gap-2 text-sm md:text-base tracking-wide";
  
  const variants = {
    primary: "bg-norien-gold text-[#050A30] hover:bg-norien-goldHover hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] font-semibold",
    outline: "border border-norien-gold/30 text-norien-gold hover:border-norien-gold hover:bg-norien-gold/10",
    text: "text-norien-silver hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};