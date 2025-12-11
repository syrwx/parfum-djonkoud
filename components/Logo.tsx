import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto fill-current text-amber-500">
        {/* Abstract Smoke Shape */}
        <path d="M50 90C30 90 20 70 30 60C40 50 30 40 50 20C70 40 60 50 70 60C80 70 70 90 50 90Z" opacity="0.8" />
        <path d="M45 85C25 85 25 65 35 55C45 45 35 35 45 15C65 35 55 45 65 55C75 65 75 85 45 85Z" fill="#D4AF37" />
        {/* African Symbol (Stylized Adinkra/Bogolan element) */}
        <circle cx="50" cy="55" r="5" fill="#000" />
        <path d="M40 55L60 55" stroke="#000" strokeWidth="2" />
        <path d="M50 45L50 65" stroke="#000" strokeWidth="2" />
      </svg>
      <div className="flex flex-col">
        <span className="font-serif text-xl tracking-[0.2em] font-bold text-amber-500">DJONKOUD</span>
        <span className="text-[0.6rem] tracking-[0.4em] text-amber-200 uppercase text-center">Parfum</span>
      </div>
    </div>
  );
};

export default Logo;