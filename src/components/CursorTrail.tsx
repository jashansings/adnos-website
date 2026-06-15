import { useEffect, useRef } from 'react';

const TRAIL_COUNT = 15;

export default function CursorTrail() {
  const trailsRef = useRef<{ x: number; y: number; el: HTMLDivElement | null }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0, el: null }))
  );
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Optional: Glitch effect on high velocity
      const velocity = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
      if (velocity > 85) {
        document.body.classList.add('glitch-active');
        setTimeout(() => document.body.classList.remove('glitch-active'), 120);
        trailsRef.current.forEach(t => {
          if (t.el) t.el.style.backgroundColor = Math.random() > 0.5 ? '#ff003c' : '#003cff';
        });
      } else {
        trailsRef.current.forEach(t => {
          if (t.el) t.el.style.backgroundColor = '#fff';
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateCursor = () => {
      trailsRef.current.forEach((trail, index) => {
        const targetX = index === 0 ? mouseRef.current.x : trailsRef.current[index - 1].x;
        const targetY = index === 0 ? mouseRef.current.y : trailsRef.current[index - 1].y;

        trail.x += (targetX - trail.x) * 0.45;
        trail.y += (targetY - trail.y) * 0.45;

        if (trail.el) {
          trail.el.style.left = `${trail.x}px`;
          trail.el.style.top = `${trail.y}px`;

          const size = 18 - index * 1.1;
          trail.el.style.width = `${Math.max(2, size)}px`;
          trail.el.style.height = `${Math.max(2, size)}px`;

          const drag = 1 - index / TRAIL_COUNT;
          trail.el.style.transform = `translate(-50%, -50%) scale(${1 + drag * 0.5})`;
        }
      });

      requestAnimationFrame(updateCursor);
    };

    const requestId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => {
            trailsRef.current[i].el = el;
          }}
          className="cursor-trail"
        />
      ))}
    </>
  );
}
