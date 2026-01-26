import { useEffect } from 'react';

export default function Hotkey() {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        document.body.classList.toggle('oops');
        e.preventDefault();
        e.stopPropagation(); // Prevent other Enter handlers
      }
    };

    // Capture phase ensures it runs first
    document.addEventListener('keydown', handler, true);
    
    return () => document.removeEventListener('keydown', handler, true);
  }, []);

  return null; // No UI
}
