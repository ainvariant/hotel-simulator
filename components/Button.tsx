import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isDarkMode, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-4 py-2 uppercase tracking-widest transition-all duration-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold";
  
  let variantStyles = "";

  if (isDarkMode) {
    // Dark Mode Styles - Improved Contrast
    if (variant === 'primary') {
      // Brighter red background or brighter text
      variantStyles = "bg-red-800 border-red-600 text-white hover:bg-red-700 hover:border-red-500";
    } else if (variant === 'secondary') {
      variantStyles = "bg-transparent border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-200";
    } else {
      variantStyles = "bg-red-950 border-red-800 text-red-400 hover:bg-red-900 hover:text-white";
    }
  } else {
    // Light Mode Styles
    if (variant === 'primary') {
      variantStyles = "bg-red-900 border-red-900 text-white hover:bg-white hover:text-red-900";
    } else if (variant === 'secondary') {
      variantStyles = "bg-transparent border-red-900 text-red-900 hover:bg-red-50";
    } else {
      variantStyles = "bg-red-100 border-red-200 text-red-900 hover:bg-red-200";
    }
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};