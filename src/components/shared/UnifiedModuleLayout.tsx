import React from 'react';

interface UnifiedModuleLayoutProps {
  children: React.ReactNode;
}

export const UnifiedModuleLayout = ({ children }: UnifiedModuleLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-none">
        {children}
      </div>
    </div>
  );
};