import React from "react";

export function AnimatedBackground() {
    return (
      <div className="fixed inset-0 -z-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.7 }}>
                <animate attributeName="stop-color" values="#3B82F6; #8B5CF6; #EC4899; #3B82F6" dur="20s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.7 }}>
                <animate attributeName="stop-color" values="#8B5CF6; #EC4899; #3B82F6; #8B5CF6" dur="20s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 0.7 }}>
                <animate attributeName="stop-color" values="#EC4899; #3B82F6; #8B5CF6; #EC4899" dur="20s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" filter="url(#glow)">
            <animate attributeName="opacity" values="0.7;0.9;0.7" dur="10s" repeatCount="indefinite" />
          </rect>
          <g filter="url(#glow)">
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="url(#grad1)" strokeWidth="2">
              <animate attributeName="r" values="30%;40%;30%" dur="15s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
    );
  }
  
  