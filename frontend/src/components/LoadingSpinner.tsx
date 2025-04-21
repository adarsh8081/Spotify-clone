import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-300 border-t-green-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner; 