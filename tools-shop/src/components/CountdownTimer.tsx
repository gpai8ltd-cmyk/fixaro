'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

const timeLabels: Record<keyof TimeLeft, string> = {
  days: 'дни',
  hours: 'часа',
  minutes: 'мин',
  seconds: 'сек',
};

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateTimeLeft(): TimeLeft {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // CRITICAL: Cleanup on unmount to prevent memory leaks
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3 md:gap-4 justify-center">
      {(Object.entries(timeLeft) as [keyof TimeLeft, number][]).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px] md:min-w-[60px]">
            <span className="text-xl md:text-2xl font-bold text-white tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1">{timeLabels[unit]}</p>
        </div>
      ))}
    </div>
  );
}
