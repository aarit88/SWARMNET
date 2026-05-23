/**
 * SWARMNET — Cinematic Living Background
 * ========================================
 * Multi-layer atmospheric canvas:
 *   · Neural wave field (sine-based ambient motion)
 *   · Particle network with mouse reactivity
 *   · Geographic pulse waves radiating from center
 *   · Slow radar atmosphere
 *   · Volumetric depth fog
 */
"use client";

import { useEffect, useRef } from "react";

export default function LivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -999, y: -999, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf: number;
    let frame = 0;

    // ── Particles
    const N = 52;
    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; phase: number; speed: number;
    };
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      r: 0.6 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.01,
    }));

    // ── Geo pulse origins
    const GEO_ORIGINS = [
      { x: 0.5, y: 0.5 },   // center
      { x: 0.2, y: 0.3 },
      { x: 0.8, y: 0.7 },
    ];
    let geoPulseR = [0, 60, 160];

    const onMove  = (e: MouseEvent) => { mouse.current.tx = e.clientX; mouse.current.ty = e.clientY; };
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const CONNECT = 155;
    const MOUSE_R = 220;

    const render = () => {
      frame++;

      // ── Full clear + base fill
      ctx.fillStyle = "#04060f";
      ctx.fillRect(0, 0, W, H);

      // ── Volumetric depth gradient (atmospheric fog)
      const fog = ctx.createRadialGradient(W * 0.5, H * 0.85, 0, W * 0.5, H * 0.5, H * 0.9);
      fog.addColorStop(0, "rgba(10,20,60,0.18)");
      fog.addColorStop(0.5, "rgba(4,8,28,0.10)");
      fog.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H);

      // ── Neural wave field (sine mesh across whole background)
      const waveAmp  = 1.2;
      const waveFreq = 0.014;
      const wavePrgs = frame * 0.012;
      ctx.strokeStyle = "rgba(56,189,248,0.045)";
      ctx.lineWidth   = 0.7;
      for (let row = 0; row < H; row += 55) {
        ctx.beginPath();
        for (let x = 0; x < W; x += 4) {
          const y = row + Math.sin(x * waveFreq + wavePrgs + row * 0.04) * waveAmp * 14;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // ── Tactical fine grid
      ctx.strokeStyle = "rgba(34,211,238,0.025)";
      ctx.lineWidth   = 0.5;
      const gs = 72;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // ── Coarse grid
      ctx.strokeStyle = "rgba(34,211,238,0.05)";
      ctx.lineWidth   = 0.6;
      const cgs = 216;
      for (let x = 0; x < W; x += cgs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += cgs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // ── Geographic pulse waves
      geoPulseR = geoPulseR.map((r, i) => {
        const origin = GEO_ORIGINS[i];
        const nr = r + 0.55;
        const maxR = Math.max(W, H) * 0.6;
        const a = Math.max(0, 0.08 * (1 - nr / maxR));
        ctx.strokeStyle = `rgba(34,211,238,${a})`;
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.arc(origin.x * W, origin.y * H, nr, 0, Math.PI * 2);
        ctx.stroke();
        return nr > maxR ? 0 : nr;
      });

      // ── Slow atmospheric radar sweep from center
      const sweepAngle = (frame * 0.003) % (Math.PI * 2);
      const sweepR = Math.max(W, H) * 0.65;
      ctx.save();
      ctx.translate(W * 0.5, H * 0.5);
      ctx.rotate(sweepAngle);
      const sg = ctx.createLinearGradient(0, 0, sweepR, 0);
      sg.addColorStop(0, "rgba(34,211,238,0.00)");
      sg.addColorStop(0.5, "rgba(34,211,238,0.035)");
      sg.addColorStop(1, "rgba(34,211,238,0.00)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, sweepR, -0.3, 0);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.restore();

      // ── Mouse lerp
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;

      // ── Connections
      ctx.lineWidth = 0.35;
      for (let i = 0; i < N; i++) {
        const a = particles[i];
        for (let j = i + 1; j < N; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECT) {
            ctx.strokeStyle = `rgba(56,189,248,${(1 - d / CONNECT) * 0.06})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (m.x > 0) {
          const md = Math.hypot(a.x - m.x, a.y - m.y);
          if (md < MOUSE_R) {
            ctx.strokeStyle = `rgba(56,189,248,${(1 - md / MOUSE_R) * 0.14})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }

      // ── Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.phase += p.speed;
        const a = 0.10 + Math.sin(p.phase) * 0.09;
        ctx.fillStyle = `rgba(56,189,248,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }

      // ── Ambient corner glow (cinematic vignette accent)
      const cg = ctx.createRadialGradient(W, H, 0, W, H, H * 0.7);
      cg.addColorStop(0, "rgba(56,189,248,0.03)");
      cg.addColorStop(1, "transparent");
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
