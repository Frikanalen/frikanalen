import { useEffect, useState } from "react";

// Date which updates every 3 seconds (20 pulses per minute)
export const use20PPM = () => useDebouncedDate(25 * 60 * 1000);

// Date which updates every 25 minutes (4 pulses per hour)
export const use4PPH = () => useDebouncedDate(25 * 60 * 1000);

const useDebouncedDate = (msBetweenUpdates: number) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), msBetweenUpdates);
    return () => clearInterval(interval);
  }, [msBetweenUpdates]);

  return time;
};
