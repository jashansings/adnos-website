import { useEffect, useState, type CSSProperties } from 'react';

interface EmojiProps {
  id: number;
  emoji: string;
  style: CSSProperties;
}

export default function FloatingEmojis() {
  const [emojis, setEmojis] = useState<EmojiProps[]>([]);

  useEffect(() => {
    const items = [
      { emoji: '🎥', depth: 1, duration: 25, delay: 0, size: 32, top: 80, left: -10, dx: 100, dy: -20, dr: 45 },
      { emoji: '🎬', depth: 2, duration: 35, delay: 5, size: 24, top: 20, left: 110, dx: -100, dy: 50, dr: -90 },
      { emoji: '🚀', depth: 3, duration: 30, delay: 10, size: 40, top: 110, left: 20, dx: 50, dy: -100, dr: 180 },
      { emoji: '👾', depth: 1, duration: 40, delay: 15, size: 28, top: 90, left: 90, dx: -80, dy: -80, dr: 360 },
      { emoji: '✨', depth: 2, duration: 28, delay: 2, size: 20, top: -10, left: -5, dx: 120, dy: 100, dr: -45 },
    ];

    const generated = items.map((item, i) => ({
      id: i,
      emoji: item.emoji,
      style: {
        '--drift-x': `${item.dx}vw`,
        '--drift-y': `${item.dy}vh`,
        '--drift-rotate': `${item.dr}deg`,
        '--duration': `${item.duration}s`,
        '--delay': `${item.delay}s`,
        '--size': `${item.size}px`,
        top: `${item.top}%`,
        left: `${item.left}%`,
      } as CSSProperties,
    }));

    setEmojis(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
      {emojis.map((e) => (
        <span key={e.id} className="floating-emoji" style={e.style}>
          {e.emoji}
        </span>
      ))}
    </div>
  );
}
