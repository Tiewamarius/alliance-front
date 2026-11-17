import { useEffect, useState } from 'react';

export default function ScrollTop() {
  const [progress, setProgress] = useState(0);
  const length = 307.919;

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`scroll-top ${progress > 0.05 ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <svg className="progress-circle svg-content" height="100%" viewBox="-1 -1 102 102" width="100%">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ strokeDasharray: `${length}, ${length}`, strokeDashoffset: length * (1 - progress) }} />
      </svg>
    </div>
  );
}
