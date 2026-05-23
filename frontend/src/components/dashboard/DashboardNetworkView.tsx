/**
 * SWARMNET — NETWORK VIEW
 * ========================
 * Canvas-animated network topology with:
 * · Signal propagation pulses
 * · Node health matrix
 * · Latency charts
 * · Alert log
 * ADDITIVELY ENHANCED:
 *   · Real-Time SVG Latency Jitter & Spectrum Graph
 *   · Dynamic Node Phase Synchronization indicators
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Server, AlertCircle, CheckCircle, Wifi, Activity, Check } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Canvas topology ── */
function NetworkTopologyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let raf: number;
    let frame = 0;

    const ro = new ResizeObserver(() => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    const NODES = [
      { rx: 0.5,  ry: 0.5,  r: 20, color: "#38bdf8", label: "HUB-PRIME",  status: "active",   load: 84, lat: 8  },
      { rx: 0.22, ry: 0.18, r: 13, color: "#34d399", label: "HUB-ALPHA",  status: "active",   load: 62, lat: 14 },
      { rx: 0.78, ry: 0.18, r: 13, color: "#34d399", label: "HUB-BETA",   status: "active",   load: 71, lat: 11 },
      { rx: 0.14, ry: 0.72, r: 12, color: "#fb923c", label: "HUB-GAMMA",  status: "degraded", load: 38, lat: 42 },
      { rx: 0.86, ry: 0.72, r: 13, color: "#34d399", label: "HUB-DELTA",  status: "active",   load: 55, lat: 9  },
      { rx: 0.5,  ry: 0.84, r: 11, color: "#f87171", label: "HUB-SIGMA",  status: "critical", load: 96, lat: 127},
    ];

    const EDGES = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[3,5],[4,5]];

    // Signal pulses
    const pulses: { from: number; to: number; t: number }[] = [];

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "rgba(3,5,14,0.92)";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(56,189,248,0.03)";
      ctx.lineWidth   = 0.5;
      for (let x = 0; x < W; x += 52) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 52) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Edges
      EDGES.forEach(([a, b]) => {
        const na = NODES[a], nb = NODES[b];
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -(frame * 0.5);
        ctx.strokeStyle    = "rgba(56,189,248,0.10)";
        ctx.lineWidth      = 0.8;
        ctx.beginPath();
        ctx.moveTo(na.rx * W, na.ry * H);
        ctx.lineTo(nb.rx * W, nb.ry * H);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Spawn pulses
      if (frame % 60 === 0) {
        const e = EDGES[Math.floor(Math.random() * EDGES.length)];
        pulses.push({ from: e[0], to: e[1], t: 0 });
      }

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 0.014;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const na = NODES[p.from], nb = NODES[p.to];
        const x  = na.rx * W + (nb.rx * W - na.rx * W) * p.t;
        const y  = na.ry * H + (nb.ry * H - na.ry * H) * p.t;
        const a  = Math.sin(p.t * Math.PI);
        ctx.fillStyle   = `rgba(56,189,248,${a * 0.85})`;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = "#38bdf8";
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;
      }

      // Nodes
      NODES.forEach(n => {
        const nx = n.rx * W, ny = n.ry * H;
        const brt = 1 + Math.sin(frame * 0.02 + n.rx * 8) * 0.08;

        // Outer aura
        const aura = ctx.createRadialGradient(nx, ny, n.r, nx, ny, n.r * 3);
        aura.addColorStop(0, `${n.color}20`);
        aura.addColorStop(1, `${n.color}00`);
        ctx.fillStyle = aura;
        ctx.beginPath(); ctx.arc(nx, ny, n.r * 3, 0, Math.PI * 2); ctx.fill();

        // Core
        ctx.fillStyle   = `${n.color}14`;
        ctx.strokeStyle = n.color;
        ctx.lineWidth   = n.status === "critical" ? 1.8 : 1.2;
        ctx.shadowBlur  = n.status === "critical" ? 18 : 10;
        ctx.shadowColor = n.color;
        ctx.beginPath(); ctx.arc(nx, ny, n.r * brt, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;

        // Center
        ctx.fillStyle = n.color;
        ctx.beginPath(); ctx.arc(nx, ny, n.r * 0.32, 0, Math.PI * 2); ctx.fill();

        // Load arc
        const arcStart = -Math.PI / 2;
        const arcEnd   = arcStart + (n.load / 100) * Math.PI * 2;
        ctx.strokeStyle = n.color;
        ctx.lineWidth   = 2;
        ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.arc(nx, ny, n.r + 6, arcStart, arcEnd); ctx.stroke();
        ctx.globalAlpha = 1;

        // Labels
        ctx.fillStyle  = "rgba(255,255,255,0.55)";
        ctx.font       = "8px monospace";
        ctx.textAlign  = "center";
        ctx.fillText(n.label, nx, ny + n.r + 13);
        ctx.fillStyle  = `${n.color}99`;
        ctx.fillText(`${n.lat}ms`, nx, ny + n.r + 23);
        ctx.textAlign  = "left";
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}

/* ── Static node data for the health matrix ── */
const NODES_DATA = [
  { label: "HUB-PRIME",  status: "ACTIVE",   load: 84,  lat: "8ms",   color: "#38bdf8" },
  { label: "HUB-ALPHA",  status: "ACTIVE",   load: 62,  lat: "14ms",  color: "#34d399" },
  { label: "HUB-BETA",   status: "ACTIVE",   load: 71,  lat: "11ms",  color: "#34d399" },
  { label: "HUB-GAMMA",  status: "DEGRADED", load: 38,  lat: "42ms",  color: "#fb923c" },
  { label: "HUB-DELTA",  status: "ACTIVE",   load: 55,  lat: "9ms",   color: "#34d399" },
  { label: "HUB-SIGMA",  status: "CRITICAL", load: 96,  lat: "127ms", color: "#f87171" },
];

export default function DashboardNetworkView() {
  const [latencyHistory, setLatencyHistory] = useState<number[]>([12, 14, 11, 15, 13, 17, 14, 18, 16, 15, 16, 17]);

  // Telemetry fluctuation stream
  useEffect(() => {
    const id = setInterval(() => {
      setLatencyHistory(prev => {
        const next = Math.max(8, Math.min(26, prev[prev.length - 1] + (Math.random() - 0.5) * 3));
        return [...prev.slice(1), parseFloat(next.toFixed(1))];
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-12 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >

      {/* ── Main: Canvas Topology ── */}
      <div className="col-span-12 lg:col-span-8">
        <div
          className="sn-panel sn-panel-geo relative overflow-hidden sn-bracket"
          style={{ height: 420 }}
        >
          <div
            className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-5 py-3"
            style={{
              background: "rgba(3,6,16,0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(56,189,248,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="sn-dot sn-dot-intel" />
              <span className="sn-label-accent">Network Mesh Topology</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex gap-4">
                {[
                  { dot: "sn-dot-live",  label: "Active"   },
                  { dot: "sn-dot-warn",  label: "Degraded" },
                  { dot: "sn-dot-alert", label: "Critical"  },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className={`sn-dot ${l.dot}`} style={{ animationPlayState: "running" }} />
                    <span className="sn-label">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NetworkTopologyCanvas />
        </div>

        {/* Node health matrix (expanded with dynamic Phase Sync blink indicators) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {NODES_DATA.map(n => {
            const isDegraded = n.status === "DEGRADED";
            const isCritical = n.status === "CRITICAL";
            return (
              <div key={n.label} className="sn-panel p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{n.label}</span>
                    <span
                      className="sn-badge"
                      style={{
                        color: n.color,
                        background: `${n.color}14`,
                        border: `1px solid ${n.color}35`,
                        fontSize: 8,
                      }}
                    >
                      {n.status}
                    </span>
                  </div>
                  <div className="flex justify-between sn-label mb-1.5">
                    <span>Load {n.load}%</span>
                    <span style={{ color: n.color }}>{n.lat}</span>
                  </div>
                  <div className="sn-bar-track">
                    <div style={{ height: "100%", width: `${n.load}%`, background: n.color, borderRadius: 1, transition: "width 0.6s ease" }} />
                  </div>
                </div>

                {/* Animated micro Phase Sync status */}
                <div className="flex justify-between items-center mt-3 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                  <span className="sn-label" style={{ fontSize: 7, color: "var(--text-muted)" }}>PHASE SYNC</span>
                  <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: isCritical ? "var(--color-critical)" : isDegraded ? "var(--color-warning)" : "var(--color-success)" }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? "bg-red-400 animate-ping" : isDegraded ? "bg-orange-400 animate-pulse" : "bg-emerald-400"}`} />
                    {isCritical ? "MISALIGNED" : isDegraded ? "ALIGNING" : "LOCKED"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right: Health Summary & Latency Spectrum Alerts ── */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

        {/* Health summary (expanded with real-time SVG Latency Jitter graph) */}
        <div className="sn-panel p-5 flex flex-col justify-between" style={{ minHeight: 250 }}>
          <div>
            <div className="flex items-center gap-2 mb-3.5 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <Activity size={12} style={{ color: "var(--intel-primary)" }} />
              <span className="sn-label-accent">Network Health & Jitter Spectrum</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Uptime", val: "99.94%", c: "var(--color-success)" },
                { label: "Latency", val: `${latencyHistory[latencyHistory.length-1].toFixed(1)}ms`, c: "var(--intel-primary)" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded bg-slate-950/50 border border-white/[0.02]">
                  <span className="sn-label mb-0.5">{s.label}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: s.c }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic real-time latency spectrum chart */}
          <div className="w-full h-14 relative overflow-hidden bg-slate-950/60 rounded border border-white/[0.03]">
            <div className="absolute top-1.5 left-2 text-[7px] font-mono text-white/30">JITTER VECTOR CHART</div>
            <svg className="w-full h-full" viewBox="0 0 200 56" preserveAspectRatio="none">
              <path
                d={latencyHistory.map((val, idx) => `${idx === 0 ? "M" : "L"} ${(idx / (latencyHistory.length-1)) * 200} ${50 - (val - 8) * 2.2}`).join(" ")}
                fill="none"
                stroke="var(--intel-primary)"
                strokeWidth="1.5"
                style={{ filter: "drop-shadow(0 0 2px var(--intel-primary))" }}
              />
            </svg>
          </div>
        </div>

        {/* Alert log */}
        <div className="sn-panel p-5 flex-1">
          <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <AlertCircle size={12} style={{ color: "var(--color-warning)" }} />
            <span className="sn-label-accent">Alert Log</span>
          </div>
          <div className="space-y-2.5 max-h-[145px] overflow-y-auto">
            {[
              { t: "04:12", msg: "HUB-SIGMA load > 90%",          type: "critical", Icon: AlertCircle  },
              { t: "03:45", msg: "HUB-GAMMA degraded, rerouting", type: "warning",  Icon: AlertCircle  },
              { t: "03:21", msg: "HUB-ALPHA recovered",            type: "success",  Icon: CheckCircle  },
              { t: "02:58", msg: "TUN-0042 established",           type: "info",     Icon: Wifi         },
            ].map((a, i) => {
              const C: Record<string, string> = {
                critical: "var(--color-critical)", warning: "var(--color-warning)",
                success:  "var(--color-success)",  info:    "var(--intel-primary)",
              };
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2.5 rounded"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-base)" }}
                >
                  <a.Icon size={10} style={{ color: C[a.type], flexShrink: 0, marginTop: 1 }} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono leading-tight text-white/80">{a.msg}</div>
                    <div className="sn-label mt-0.5" style={{ fontSize: 8 }}>{a.t} UTC</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-base)" }}>
            <span className="sn-label">MESH DIAGNOSTICS</span>
            <button className="sn-btn-secondary text-[9px] py-1.5 px-3 gap-1">
              <Server size={9} /> RUN SCAN
            </button>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
