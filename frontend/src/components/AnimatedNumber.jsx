import React, { useEffect, useState } from "react";

export default function AnimatedNumber({ value, duration = 800 }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
    const startValue = typeof displayValue === "number" ? displayValue : parseFloat(displayValue) || 0;
    
    if (numValue === startValue) return;

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = Math.round(startValue + (numValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}
