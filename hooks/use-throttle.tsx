import { useState, useEffect } from "react";

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
    }, limit);

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}
