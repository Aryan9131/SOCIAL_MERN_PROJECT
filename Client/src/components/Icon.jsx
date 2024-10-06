import React from 'react';

const SocialMediaIcon = () => (
  <svg width="50" height="50" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b5998', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8bc34a', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="256" cy="256" r="256" fill="url(#grad1)" />
    <circle cx="100" cy="100" r="50" fill="white" />
    <circle cx="412" cy="100" r="50" fill="white" />
    <circle cx="256" cy="412" r="50" fill="white" />
    <line x1="256" y1="256" x2="100" y2="100" stroke="white" strokeWidth="10" />
    <line x1="256" y1="256" x2="412" y2="100" stroke="white" strokeWidth="10" />
    <line x1="256" y1="256" x2="256" y2="412" stroke="white" strokeWidth="10" />
    <path d="M206 206 h100 a50 50 0 0 1 50 50 v50 a50 50 0 0 1 -50 50 h-50 l-50 50 v-50 h-50 a50 50 0 0 1 -50 -50 v-50 a50 50 0 0 1 50 -50 z" fill="white" />
  </svg>
);

export default SocialMediaIcon;
