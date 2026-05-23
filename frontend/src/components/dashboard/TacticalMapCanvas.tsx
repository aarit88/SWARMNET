/**
 * SWARMNET — Tactical Map Canvas
 * ================================
 * The visual centerpiece of the intelligence platform.
 * Canvas-rendered city grid with:
 *   · City block topology (street grid)
 *   · Live incident zones (pulsing danger rings)
 *   · Swarm agent positions (animated moving nodes)
 *   · AI route paths (flowing dashed lines)
 *   · Predictive danger expansion zones
 *   · Radar sweep overlay
 *   · Coordinate HUD labels
 *   · Signal propagation pulses
 *   · INTERACTIVE HUD OVERLAYS (Grid, Thermal, Corridors, Weather)
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, Eye, ShieldAlert, CloudRain } from "lucide-react";

interface Incident {
  id: string;
  x: number;
  y: number;
  severity: "critical" | "high" | "medium";
  label: string;
}

interface SwarmAgent {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  trail: { x: number; y: number }[];
  assignedTo: number; // incident index
  phase: number;
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
  incidentFilter?: string | null;
}

export default function TacticalMapCanvas({ className = "", style, incidentFilter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const frameRef  = useRef(0);

  // HUD Interactive States
  const [gridActive, setGridActive] = useState(true);
  const [thermalActive, setThermalActive] = useState(false);
  const [corridorActive, setCorridorActive] = useState(true);
  const [weatherActive, setWeatherActive] = useState(false);

  // Ref mirror to access inside requestAnimationFrame without re-binding useEffect
  const stateRef = useRef({ gridActive, thermalActive, corridorActive, weatherActive });
  useEffect(() => {
    stateRef.current = { gridActive, thermalActive, corridorActive, weatherActive };
  }, [gridActive, thermalActive, corridorActive, weatherActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    // ── Incident data (relative 0–1 coords)
    const INCIDENTS: Incident[] = [
      { id: "INC-A", x: 0.28, y: 0.38, severity: "critical", label: "STRUCTURAL FIRE" },
      { id: "INC-B", x: 0.62, y: 0.55, severity: "high",     label: "POWER FAILURE"   },
      { id: "INC-C", x: 0.44, y: 0.70, severity: "medium",   label: "FLOOD ZONE"      },
      { id: "INC-D", x: 0.75, y: 0.28, severity: "high",     label: "HAZMAT SPILL"    },
    ];

    const SEV_COLOR: Record<string, string> = {
      critical: "#f87171",
      high:     "#fb923c",
      medium:   "#fbbf24",
    };

    // ── Swarm agents
    const AGENTS: SwarmAgent[] = Array.from({ length: 14 }, (_, i) => {
      const target = INCIDENTS[i % INCIDENTS.length];
      return {
        x:        Math.random(),
        y:        Math.random(),
        targetX:  target.x + (Math.random() - 0.5) * 0.08,
        targetY:  target.y + (Math.random() - 0.5) * 0.08,
        speed:    0.0008 + Math.random() * 0.0012,
        trail:    [],
        assignedTo: i % INCIDENTS.length,
        phase:    Math.random() * Math.PI * 2,
      };
    });

    // ── City block layout (column, row, w, h) in 0-1 space
    const CITY_BLOCKS = [
      [0.06, 0.08, 0.14, 0.16],  [0.24, 0.08, 0.18, 0.12],  [0.48, 0.06, 0.20, 0.18],
      [0.72, 0.08, 0.12, 0.14],  [0.86, 0.08, 0.10, 0.16],
      [0.06, 0.30, 0.10, 0.20],  [0.20, 0.28, 0.16, 0.14],  [0.40, 0.32, 0.14, 0.18],
      [0.58, 0.30, 0.18, 0.12],  [0.80, 0.28, 0.16, 0.16],
      [0.06, 0.58, 0.18, 0.14],  [0.28, 0.56, 0.20, 0.18],  [0.52, 0.60, 0.16, 0.16],
      [0.72, 0.56, 0.14, 0.20],  [0.90, 0.56, 0.08, 0.14],
      [0.06, 0.80, 0.14, 0.14],  [0.26, 0.80, 0.22, 0.12],  [0.54, 0.78, 0.18, 0.16],
      [0.78, 0.80, 0.16, 0.14],
    ];

    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;
      const { gridActive: gAct, thermalActive: tAct, corridorActive: cAct, weatherActive: wAct } = stateRef.current;
      ctx.clearRect(0, 0, W, H);

      // ────────────────────────────────────────────
      // 1. Deep base (Surveillance thermal vs cyber cyan base)
      ctx.fillStyle = tAct ? "#180603" : "#030610";
      ctx.fillRect(0, 0, W, H);

      // 2. Vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.8);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, tAct ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // 3. City blocks — subtle district fills
      CITY_BLOCKS.forEach(([bx, by, bw, bh]) => {
        const x = bx*W, y = by*H, w = bw*W, h = bh*H;
        ctx.fillStyle   = tAct ? "rgba(220,38,38,0.06)" : "rgba(8,14,34,0.9)";
        ctx.strokeStyle = tAct ? "rgba(220,38,38,0.16)" : "rgba(34,211,238,0.08)";
        ctx.lineWidth   = 0.8;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      });

      // 4. Fine street networks
      if (gAct) {
        ctx.strokeStyle = tAct ? "rgba(220,38,38,0.05)" : "rgba(34,211,238,0.06)";
        ctx.lineWidth   = 0.6;
        const gridStep = 60;
        for (let x = 0; x < W; x += gridStep) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += gridStep) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      }

      // Major roads (brighter)
      ctx.strokeStyle = tAct ? "rgba(220,38,38,0.18)" : "rgba(34,211,238,0.14)";
      ctx.lineWidth   = 1.2;
      [0.25, 0.5, 0.75].forEach(pct => {
        ctx.beginPath(); ctx.moveTo(pct*W, 0); ctx.lineTo(pct*W, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, pct*H); ctx.lineTo(W, pct*H); ctx.stroke();
      });

      // 5. Radar sweep
      const radarAngle = (f * 0.004) % (Math.PI * 2);
      const radarR = Math.max(W, H) * 0.75;

      ctx.save();
      ctx.translate(W * 0.5, H * 0.5);
      ctx.rotate(radarAngle);
      const sweepGrad = ctx.createLinearGradient(0, 0, radarR, 0);
      sweepGrad.addColorStop(0, "transparent");
      sweepGrad.addColorStop(0.6, tAct ? "rgba(239,68,68,0.03)" : "rgba(34,211,238,0.04)");
      sweepGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radarR, -0.25, 0);
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // 6. Thermal Hotspots & Heat Signatures (only in thermal mode)
      if (tAct) {
        ctx.save();
        const pulse = 1 + Math.sin(f * 0.01) * 0.1;
        // Draw 3 primary surveillance hubs representing active thermal anomalies
        const hotspots = [
          { x: 0.35, y: 0.42, r: 80, color: "rgba(239,68,68,0.22)" },
          { x: 0.65, y: 0.60, r: 60, color: "rgba(245,158,11,0.18)" },
          { x: 0.70, y: 0.35, r: 90, color: "rgba(239,68,68,0.15)" },
        ];
        hotspots.forEach(h => {
          const hG = ctx.createRadialGradient(h.x*W, h.y*H, 0, h.x*W, h.y*H, h.r * pulse);
          hG.addColorStop(0, h.color);
          hG.addColorStop(0.5, "rgba(239,68,68,0.05)");
          hG.addColorStop(1, "transparent");
          ctx.fillStyle = hG;
          ctx.beginPath();
          ctx.arc(h.x*W, h.y*H, h.r * pulse, 0, Math.PI*2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 7. Evacuation Corridors (Corridor Active)
      if (cAct) {
        ctx.save();
        ctx.strokeStyle = "rgba(52,211,153,0.32)";
        ctx.lineWidth   = 3;
        ctx.setLineDash([12, 10]);
        ctx.lineDashOffset = -(f * 1.2);
        ctx.shadowBlur  = 8;
        ctx.shadowColor = "rgba(52,211,153,0.5)";

        // Route A (Diagonal evacuation Corridor Northwest-Southeast)
        ctx.beginPath();
        ctx.moveTo(0.08 * W, 0.08 * H);
        ctx.bezierCurveTo(0.3 * W, 0.4 * H, 0.7 * W, 0.6 * H, 0.92 * W, 0.92 * H);
        ctx.stroke();

        // Route B (East-West express evacuation conduit)
        ctx.beginPath();
        ctx.moveTo(0.04 * W, 0.5 * H);
        ctx.lineTo(0.96 * W, 0.5 * H);
        ctx.stroke();

        ctx.restore();
        ctx.setLineDash([]);
      }

      // 8. Danger zones (predictive spread)
      INCIDENTS.forEach(inc => {
        const ix = inc.x * W, iy = inc.y * H;
        const color = SEV_COLOR[inc.severity];
        const breathe = 0.88 + Math.sin(f * 0.015 + inc.x * 5) * 0.12;
        const r = (inc.severity === "critical" ? 72 : inc.severity === "high" ? 56 : 42) * breathe;

        // Outer danger zone
        const zGrad = ctx.createRadialGradient(ix, iy, r * 0.3, ix, iy, r);
        zGrad.addColorStop(0, `${color}22`);
        zGrad.addColorStop(1, `${color}00`);
        ctx.fillStyle = zGrad;
        ctx.beginPath();
        ctx.arc(ix, iy, r, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.strokeStyle = `${color}35`;
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.arc(ix, iy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 9. Agent route paths (flowing dashes)
      AGENTS.forEach(ag => {
        const inc = INCIDENTS[ag.assignedTo];
        const ax = ag.x * W, ay = ag.y * H;
        const ix = inc.x * W, iy = inc.y * H;
        const dist = Math.hypot(ax - ix, ay - iy);
        if (dist > 20) {
          const alpha = Math.min(0.5, 30 / dist);
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -(f * 0.8);
          ctx.strokeStyle    = tAct ? `rgba(239,68,68,${alpha * 0.6})` : `rgba(56,189,248,${alpha * 0.7})`;
          ctx.lineWidth      = 0.8;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          // Bezier path
          const mx = (ax + ix) / 2 + (ay - iy) * 0.15;
          const my = (ay + iy) / 2 - (ix - ax) * 0.15;
          ctx.quadraticCurveTo(mx, my, ix, iy);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 10. Move and draw agents
      AGENTS.forEach(ag => {
        const inc = INCIDENTS[ag.assignedTo];
        ag.targetX = inc.x + Math.sin(f * 0.008 + ag.phase) * 0.06;
        ag.targetY = inc.y + Math.cos(f * 0.008 + ag.phase) * 0.06;

        ag.x += (ag.targetX - ag.x) * ag.speed * 60;
        ag.y += (ag.targetY - ag.y) * ag.speed * 60;

        ag.trail.push({ x: ag.x * W, y: ag.y * H });
        if (ag.trail.length > 18) ag.trail.shift();

        // Trail
        ag.trail.forEach((pt, i) => {
          const a = (i / ag.trail.length) * 0.25;
          ctx.fillStyle = tAct ? `rgba(239,68,68,${a})` : `rgba(56,189,248,${a})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Agent dot
        const ax = ag.x * W, ay = ag.y * H;
        const ap = 0.5 + Math.sin(f * 0.04 + ag.phase) * 0.35;
        ctx.fillStyle   = tAct ? `rgba(239,68,68,${ap})` : `rgba(56,189,248,${ap})`;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = tAct ? "rgba(239,68,68,0.7)" : "rgba(56,189,248,0.7)";
        ctx.beginPath();
        ctx.arc(ax, ay, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 11. Incident markers
      INCIDENTS.forEach((inc, i) => {
        const ix = inc.x * W, iy = inc.y * H;
        const color = SEV_COLOR[inc.severity];
        const pulse1 = 12 + Math.sin(f * 0.04 + i) * 4;
        const pulse2 = 24 + Math.sin(f * 0.03 + i + 1) * 6;

        // Pulse rings
        ctx.strokeStyle = `${color}40`;
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.arc(ix, iy, pulse1, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = `${color}20`;
        ctx.beginPath(); ctx.arc(ix, iy, pulse2, 0, Math.PI * 2); ctx.stroke();

        // Core
        ctx.shadowBlur  = 10;
        ctx.shadowColor = color;
        ctx.fillStyle   = color;
        ctx.beginPath(); ctx.arc(ix, iy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;

        // Inner white dot
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(ix, iy, 1.8, 0, Math.PI * 2); ctx.fill();

        // Cross-hair lines
        ctx.strokeStyle = `${color}50`;
        ctx.lineWidth   = 0.6;
        ctx.beginPath(); ctx.moveTo(ix - 12, iy); ctx.lineTo(ix - 6, iy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ix + 6,  iy); ctx.lineTo(ix + 12, iy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ix, iy - 12); ctx.lineTo(ix, iy - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ix, iy + 6);  ctx.lineTo(ix, iy + 12); ctx.stroke();

        // Label
        ctx.fillStyle   = "rgba(255,255,255,0.75)";
        ctx.font        = "bold 8px monospace";
        ctx.fillText(inc.id, ix + 8, iy - 8);
      });

      // 12. Communication pulse lines between agents
      if (f % 3 === 0) {
        for (let i = 0; i < AGENTS.length; i++) {
          for (let j = i + 1; j < AGENTS.length; j++) {
            if (AGENTS[i].assignedTo === AGENTS[j].assignedTo) {
              const d = Math.hypot((AGENTS[i].x - AGENTS[j].x) * W, (AGENTS[i].y - AGENTS[j].y) * H);
              if (d < 100) {
                const a = (1 - d / 100) * 0.12;
                ctx.strokeStyle = tAct ? `rgba(239,68,68,${a})` : `rgba(56,189,248,${a})`;
                ctx.lineWidth   = 0.4;
                ctx.beginPath();
                ctx.moveTo(AGENTS[i].x * W, AGENTS[i].y * H);
                ctx.lineTo(AGENTS[j].x * W, AGENTS[j].y * H);
                ctx.stroke();
              }
            }
          }
        }
      }

      // 13. Weather overlays (Rain effect)
      if (wAct) {
        ctx.save();
        ctx.strokeStyle = tAct ? "rgba(239,68,68,0.24)" : "rgba(34,211,238,0.3)";
        ctx.lineWidth   = 0.8;
        // Pseudo-random rain storm rendering using frame index offsets
        for (let k = 0; k < 60; k++) {
          const rx = ((k * 179 + f * 5.5) % W);
          const ry = ((k * 311 + f * 11) % H);
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 5, ry + 15);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 14. HUD overlays
      // Top-left coordinate
      ctx.fillStyle = tAct ? "rgba(220,38,38,0.55)" : "rgba(34,211,238,0.45)";
      ctx.font      = "8px monospace";
      ctx.fillText(`40°42'N 74°00'W`, 12, 18);
      ctx.fillText(`GRID REF: SN-09-DELTA`, 12, 30);
      if (wAct) {
        ctx.fillStyle = "rgba(56,189,248,0.75)";
        ctx.fillText(`WIND: 18KT NW / PRECIP HIGH`, 12, 42);
      }

      // Bottom scan line
      const scanY = ((f * 1.2) % H);
      const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(0.5, tAct ? "rgba(220,38,38,0.18)" : "rgba(34,211,238,0.18)");
      scanGrad.addColorStop(1, "transparent");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 2, W, 4);

      // Active node count
      ctx.fillStyle = tAct ? "rgba(220,38,38,0.55)" : "rgba(34,211,238,0.38)";
      ctx.font      = "8px monospace";
      ctx.fillText(`SWARM: 14 ACTIVE`, W - 115, H - 30);
      ctx.fillText(`INTEL: REALTIME`, W - 115, H - 20);
      ctx.fillText(`MODE: ${tAct ? "THERMAL" : "TACTICAL"}`, W - 115, H - 10);

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-full" style={style}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${className}`}
      />

      {/* Floating HUD Toggle Strip */}
      <div
        className="absolute top-12 right-4 z-20 flex gap-2 p-1.5 rounded-md"
        style={{
          background: "rgba(3,6,16,0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {[
          { label: "GRID", act: gridActive, set: setGridActive, Icon: Grid },
          { label: "THM",  act: thermalActive, set: setThermalActive, Icon: Eye },
          { label: "CRD",  act: corridorActive, set: setCorridorActive, Icon: ShieldAlert },
          { label: "WTH",  act: weatherActive, set: setWeatherActive, Icon: CloudRain },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => item.set(!item.act)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider rounded transition-all duration-200"
            style={{
              background: item.act ? "rgba(56,189,248,0.12)" : "transparent",
              color: item.act
                ? "var(--intel-primary)"
                : "var(--text-muted)",
              border: `1px solid ${item.act ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.03)"}`,
            }}
            title={item.label === "THM" ? "Thermal Satellite Feed" : item.label === "CRD" ? "Evacuation Corridors" : item.label === "WTH" ? "Weather Front Overlay" : "Street Grid Map"}
          >
            <item.Icon size={10} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
