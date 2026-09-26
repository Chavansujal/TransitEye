import React, { useEffect, useRef } from "react";

export default function Organic3DVisual({ theme = "dark" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth || 400;
      const h = parent.clientHeight || 400;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const isDark = theme === "dark";

    const render = () => {
      time += 0.015;
      const dpr = window.devicePixelRatio || 1;
      const width = (canvas.width || 400) / dpr;
      const height = (canvas.height || 400) / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.28;

      // Draw floating particle ring
      for (let i = 0; i < 28; i++) {
        const pAngle = time * 0.4 + (i * Math.PI) / 14;
        const pr = baseRadius * (1.2 + Math.sin(time + i * 0.5) * 0.15);
        const px = centerX + Math.cos(pAngle) * pr * 1.1;
        const py = centerY + Math.sin(pAngle * 1.4) * (pr * 0.6);
        const pSize = 1.5 + Math.sin(time * 2 + i) * 1.2;

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, pSize), 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? (i % 2 === 0 ? "rgba(132, 204, 22, 0.7)" : "rgba(163, 230, 53, 0.5)")
          : (i % 2 === 0 ? "rgba(77, 124, 15, 0.75)" : "rgba(101, 163, 13, 0.55)");
        ctx.shadowColor = isDark ? "#84cc16" : "#4d7c0f";
        ctx.shadowBlur = isDark ? 8 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw 3D Ribbed Torus / Twisted Ribbon
      const numRings = 90;

      for (let i = 0; i < numRings; i++) {
        const u = (i / numRings) * Math.PI * 2;
        const twist = u * 2 + time * 0.8;

        const R = baseRadius;
        const r = baseRadius * 0.35 * (1 + 0.15 * Math.sin(u * 3 + time));

        const cx = centerX + R * Math.cos(u) + Math.sin(u * 2 + time) * 18;
        const cy = centerY + R * Math.sin(u) * 0.55 + Math.cos(u * 3 + time) * 12;

        const depth = Math.sin(u + time * 0.5);
        const scale = 0.85 + depth * 0.3;
        const opacity = isDark ? (0.45 + depth * 0.5) : (0.55 + depth * 0.4);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.rotate(u * 0.5 + time * 0.2);

        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(1, r), Math.max(0.5, r * 0.4), twist, 0, Math.PI * 2);

        const grad = ctx.createLinearGradient(-r, -r, r, r);
        if (isDark) {
          grad.addColorStop(0, `rgba(163, 230, 53, ${Math.min(1, opacity * 0.95)})`);
          grad.addColorStop(0.4, `rgba(132, 204, 22, ${Math.min(1, opacity)})`);
          grad.addColorStop(0.75, `rgba(77, 124, 15, ${Math.min(1, opacity * 0.85)})`);
          grad.addColorStop(1, `rgba(20, 40, 10, ${Math.min(1, opacity * 0.4)})`);
        } else {
          grad.addColorStop(0, `rgba(101, 163, 13, ${Math.min(1, opacity * 0.95)})`);
          grad.addColorStop(0.4, `rgba(77, 124, 15, ${Math.min(1, opacity)})`);
          grad.addColorStop(0.75, `rgba(54, 83, 20, ${Math.min(1, opacity * 0.85)})`);
          grad.addColorStop(1, `rgba(20, 40, 10, ${Math.min(1, opacity * 0.5)})`);
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3 + Math.sin(u * 5 + time) * 1.2;
        ctx.stroke();

        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.ellipse(0, 0, Math.max(1, r * 0.85), Math.max(0.5, r * 0.3), twist, 0, Math.PI * 0.8);
          ctx.strokeStyle = isDark ? `rgba(220, 255, 180, ${Math.min(1, opacity * 0.9)})` : `rgba(255, 255, 255, ${Math.min(1, opacity * 0.95)})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        ctx.restore();
      }

      // Center Core Badge
      ctx.beginPath();
      ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#84cc16" : "#4d7c0f";
      ctx.shadowColor = isDark ? "#84cc16" : "#4d7c0f";
      ctx.shadowBlur = isDark ? 12 : 5;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore(); // Crucial: Restore canvas scale transform on every frame!

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [theme]);

  return (
    <div className="w-full h-full min-h-[350px] relative flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
      <div className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none -z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
        theme === "dark" ? "bg-lime-500/15" : "bg-lime-600/10"
      }`} />
    </div>
  );
}
