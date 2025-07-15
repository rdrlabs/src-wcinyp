'use client';

interface LostStethoscopeProps {
  className?: string;
}

export function LostStethoscope({ className = '' }: LostStethoscopeProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="200" cy="150" r="120" fill="currentColor" opacity="0.05" />
      
      {/* Stethoscope */}
      <g className="stethoscope">
        {/* Ear pieces */}
        <path
          d="M120 80 Q120 60 140 60 Q160 60 160 80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M240 80 Q240 60 260 60 Q280 60 280 80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Tubes */}
        <path
          d="M140 80 C140 120 180 140 200 180"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M260 80 C260 120 220 140 200 180"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Chest piece */}
        <circle cx="200" cy="190" r="20" fill="currentColor" />
        <circle cx="200" cy="190" r="15" fill="white" />
      </g>
      
      {/* Question marks */}
      <g className="question-marks">
        <text x="100" y="150" fontSize="24" fill="currentColor" opacity="0.3">?</text>
        <text x="280" y="120" fontSize="32" fill="currentColor" opacity="0.4">?</text>
        <text x="150" y="200" fontSize="20" fill="currentColor" opacity="0.3">?</text>
        <text x="250" y="180" fontSize="28" fill="currentColor" opacity="0.5">?</text>
      </g>
      
      {/* 404 text */}
      <text 
        x="200" 
        y="260" 
        fontSize="48" 
        fontWeight="bold" 
        fill="currentColor" 
        textAnchor="middle"
        opacity="0.2"
      >
        404
      </text>
    </svg>
  );
}