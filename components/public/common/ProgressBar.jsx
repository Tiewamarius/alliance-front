import { useEffect, useRef, useState } from 'react';

export default function ProgressBar({ label, value }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setWidth(value);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="progress" ref={ref}>
      <div className="meta">{label}</div>
      <div className="progress-bar" style={{ width: `${width}%`, transition: 'width 1.2s ease' }}>
        <span>{width}%</span>
      </div>
    </div>
  );
}
