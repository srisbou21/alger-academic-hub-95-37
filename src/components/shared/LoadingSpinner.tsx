import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({ message = "Chargement...", size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
};