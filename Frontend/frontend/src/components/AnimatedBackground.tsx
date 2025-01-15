import React from "react";

export function AnimatedBackground() {
    return (
      <div className="fixed inset-0 -z-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#9333EA', stopOpacity: 0.2 }} />
            </linearGradient>
            <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="url(#grad1)">
                <animate attributeName="r" from="20" to="40" dur="5s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)">
            <animate attributeName="x" from="0" to="100" dur="20s" repeatCount="indefinite" />
            <animate attributeName="y" from="0" to="100" dur="30s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
    );
  }
  
  