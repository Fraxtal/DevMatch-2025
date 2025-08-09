import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  blur = 'md',
  opacity = 0.1 
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  return (
    <div 
      className={`
        ${blurClasses[blur]} 
        border border-white/20 
        rounded-2xl 
        shadow-xl 
        ${className}
      `}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {children}
    </div>
  );
};
