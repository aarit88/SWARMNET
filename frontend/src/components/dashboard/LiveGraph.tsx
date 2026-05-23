/**
 * SWARMNET — Live Graph Component
 * ================================
 * High-performance, canvas-animated real-time streaming graph.
 * Renders multiple telemetry metrics (predictive curves, forecasts, escalations).
 * Features:
 *   · Dynamic line shifting
 *   · Area gradient fills
 *   · Hover coordinate detection
 *   · Precision gridlines
 *   · Glowing ambient scanlines
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, Activity, Check } from "lucide-react";

interface LiveGraphProps {
  metricName?: string;
  metricColor?: string;
  height?: number;
}

export default function LiveGraph({
  metricName = "TELEMETRY DENSITY",
  metricColor = "#38bdf8",
  height = 180,
}: LiveGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<number[]>([]);
  const frameRef  = useRef(0);

  // Initialize seed values
  if (pointsRef.current.length === 0) {
    pointsRef.current = Array.from({ length: 80 }, (_, i) => 30 + Math.sin(i * 0.1) * 10 + Math.random() * 5);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let raf: number;

    const ro = new ResizeObserver(() => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;

      // Stream new values periodically
      if (f % 5 === 0) {
        const lastVal = pointsRef.current[pointsRef.current.length - 1];
        const nextVal = Math.max(10, Math.min(90, lastVal + (Math.random() - 0.5) * 6 + Math.sin(f * 0.02) * 1.5));
        pointsRef.current.push(nextVal);
        if (pointsRef.current.length > 100) {
          pointsRef.current.shift();
        }
      }

      ctx.clearRect(0, 0, W, H);

      // 1. Deep grid background
      ctx.fillStyle = "rgba(4,6,15,0.7)";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth   = 0.5;
      const stepX = W / 10;
      const stepY = H / 6;
      for (let x = 0; x < W; x += stepX) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += stepY) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // 2. Plot lines
      const pts = pointsRef.current;
      const len = pts.length;
      if (len > 1) {
        ctx.save();
        ctx.strokeStyle = metricColor;
        ctx.lineWidth   = 2;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = metricColor;

        // Path
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
          const px = (i / (len - 1)) * W;
          const py = H - (pts[i] / 100) * H * 0.85 - 10;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Area Gradient
        const areaGrad = ctx.createLinearGradient(0, 0, 0, H);
        areaGrad.addColorStop(0, `${metricColor}25`);
        areaGrad.addColorStop(1, `${metricColor}00`);
        ctx.fillStyle = areaGrad;

        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let i = 0; i < len; i++) {
          const px = (i / (len - 1)) * W;
          const py = H - (pts[i] / 100) * H * 0.85 - 10;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 3. Current value marker
      if (len > 0) {
        const lastX = W;
        const lastY = H - (pts[len - 1] / 100) * H * 0.85 - 10;

        ctx.fillStyle = metricColor;
        ctx.beginPath();
        ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing glow ring
        const rPulse = 4 + Math.sin(f * 0.1) * 3;
        ctx.strokeStyle = metricColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(lastX - 2, lastY, rPulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [metricColor]);

  return (
    <div
      className="sn-panel p-4 overflow-hidden relative"
      style={{ height }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <Activity size={12} style={{ color: metricColor }} />
          <span className="sn-label-accent" style={{ color: metricColor }}>{metricName}</span>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
          <Check size={8} /> ONLINE
        </span>
      </div>

      <div className="relative w-full h-[calc(100%-24px)] rounded border border-white/[0.03]">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
