/**
 * SWARMNET — SWARMS VIEW
 * =======================
 * Full swarm intelligence visualization:
 * · Large node topology with animated agent positions
 * · Communication pulse lines
 * · Agent telemetry cards
 * · Real-time sync logs
 * ADDITIVELY ENHANCED:
 *   · Live-fluctuating Node Sync SVG Graph
 *   · Dynamic Area Swarm Efficiency Chart
 *   · Neural Synchronizer subprocess console
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Wifi, Radio, Server, Check } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Canvas-based swarm topology ── */
function SwarmTopologyCanvas() {
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

    // Hub nodes
    const HUBS = [
      { id: "PRIME",  rx: 0.5,  ry: 0.5,  r: 16, color: "#38bdf8", label: "HUB-PRIME"  },
      { id: "ALPHA",  rx: 0.22, ry: 0.25, r: 11, color: "#34d399", label: "HUB-ALPHA"  },
      { id: "BETA",   rx: 0.78, ry: 0.25, r: 11, color: "#34d399", label: "HUB-BETA"   },
      { id: "GAMMA",  rx: 0.18, ry: 0.72, r: 10, color: "#fb923c", label: "HUB-GAMMA"  },
      { id: "DELTA",  rx: 0.82, ry: 0.72, r: 11, color: "#34d399", label: "HUB-DELTA"  },
      { id: "SIGMA",  rx: 0.5,  ry: 0.82, r: 9,  color: "#f87171", label: "HUB-SIGMA"  },
    ];

    const EDGES = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[3,5],[4,5],[1,3],[2,4]];

    // Micro-agents orbiting hubs
    type MicroAgent = { angle: number; speed: number; orbitR: number; hubIdx: number; color: string };
    const micro: MicroAgent[] = HUBS.flatMap((h, i) =>
      Array.from({ length: i === 0 ? 8 : 4 }, (_, j) => ({
        angle:   (j / (i === 0 ? 8 : 4)) * Math.PI * 2,
        speed:   (i === 0 ? 0.008 : 0.012) * (j % 2 === 0 ? 1 : -1),
        orbitR:  h.r + 22 + j * 5,
        hubIdx:  i,
        color:   h.color,
      }))
    );

    // Pulse state
    const pulses: { from: number; to: number; progress: number; alpha: number }[] = [];

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "rgba(3,5,14,0.92)";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(56,189,248,0.035)";
      ctx.lineWidth   = 0.5;
      for (let x = 0; x < W; x += 52) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 52) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Edges (static dashed)
      EDGES.forEach(([a, b]) => {
        const ha = HUBS[a], hb = HUBS[b];
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -(frame * 0.6);
        ctx.strokeStyle    = `rgba(56,189,248,0.10)`;
        ctx.lineWidth      = 0.8;
        ctx.beginPath();
        ctx.moveTo(ha.rx * W, ha.ry * H);
        ctx.lineTo(hb.rx * W, hb.ry * H);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Signal pulses
      if (frame % 80 === 0) {
        const e = EDGES[Math.floor(Math.random() * EDGES.length)];
        pulses.push({ from: e[0], to: e[1], progress: 0, alpha: 1 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += 0.012;
        if (p.progress >= 1) { pulses.splice(i, 1); continue; }
        const ha = HUBS[p.from], hb = HUBS[p.to];
        const x = ha.rx * W + (hb.rx * W - ha.rx * W) * p.progress;
        const y = ha.ry * H + (hb.ry * H - ha.ry * H) * p.progress;
        const a = Math.sin(p.progress * Math.PI) * 0.9;
        ctx.fillStyle   = `rgba(56,189,248,${a})`;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = "#38bdf8";
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;
      }

      // Hub rings + cores
      HUBS.forEach(hub => {
        const hx = hub.rx * W, hy = hub.ry * H;
        const breathe = 1 + Math.sin(frame * 0.025 + hub.rx * 5) * 0.08;

        // Outer glow ring
        const grd = ctx.createRadialGradient(hx, hy, hub.r * breathe, hx, hy, hub.r * breathe * 2.5);
        grd.addColorStop(0, `${hub.color}20`);
        grd.addColorStop(1, `${hub.color}00`);
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(hx, hy, hub.r * breathe * 2.5, 0, Math.PI * 2); ctx.fill();

        // Core fill
        ctx.fillStyle   = `${hub.color}18`;
        ctx.strokeStyle = hub.color;
        ctx.lineWidth   = 1.2;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = hub.color;
        ctx.beginPath(); ctx.arc(hx, hy, hub.r * breathe, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.shadowBlur  = 0;

        // Center dot
        ctx.fillStyle = hub.color;
        ctx.beginPath(); ctx.arc(hx, hy, hub.r * 0.3, 0, Math.PI * 2); ctx.fill();

        // Label
        ctx.fillStyle   = "rgba(255,255,255,0.55)";
        ctx.font        = "8px monospace";
        ctx.textAlign   = "center";
        ctx.fillText(hub.label, hx, hy + hub.r + 14);
        ctx.textAlign = "left";
      });

      // Micro agents
      micro.forEach(ma => {
        ma.angle += ma.speed;
        const hub = HUBS[ma.hubIdx];
        const x = hub.rx * W + Math.cos(ma.angle) * ma.orbitR;
        const y = hub.ry * H + Math.sin(ma.angle) * ma.orbitR;
        const a = 0.4 + Math.sin(frame * 0.06 + ma.angle) * 0.3;
        ctx.fillStyle   = `${ma.color}${Math.floor(a * 255).toString(16).padStart(2,"0")}`;
        ctx.shadowBlur  = 4;
        ctx.shadowColor = ma.color;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="w-full h-full" />;
}

/* ── Comm log data ── */
const COMM_LOGS = [
  { t: "14:22:01", msg: "AGENT-α: SYNC_INIT → HUB-PRIME",    color: "var(--intel-primary)"   },
  { t: "14:22:04", msg: "HANDSHAKE OK (HUB-04 ↔ HUB-02)",    color: "var(--text-secondary)"  },
  { t: "14:22:08", msg: "SIGMA: SCANNING_THREAT_BLOCK_82.x",  color: "var(--text-secondary)"  },
  { t: "14:22:12", msg: "⚠ PACKET_LOSS ZONE_7",               color: "var(--color-critical)"  },
  { t: "14:22:15", msg: "REROUTE VIA HUB-BETA",               color: "var(--color-warning)"   },
  { t: "14:22:19", msg: "AGENT-α: OPTIMIZATION_COMPLETE",      color: "var(--color-success)"   },
  { t: "14:22:23", msg: "NEURAL SYNC: 4,029 NODES OK",        color: "var(--intel-primary)"   },
];

export default function DashboardSwarmsView() {
  const [logs, setLogs] = useState(COMM_LOGS.slice(0, 4));

  // Dynamic SVG chart data history state
  const [syncHistory, setSyncHistory] = useState<number[]>([98.1, 98.4, 98.2, 98.5, 98.3, 98.6, 98.4, 98.7, 98.5, 98.8, 98.6, 98.4]);
  const [effHistory, setEffHistory] = useState<number[]>([92, 94, 93, 95, 94, 96, 95, 97, 96, 98, 97, 98.4]);

  useEffect(() => {
    let i = 4;
    const id = setInterval(() => {
      if (i < COMM_LOGS.length) {
        setLogs(prev => [...prev.slice(-5), COMM_LOGS[i++]]);
      } else {
        // Recycle logs
        setLogs(prev => [...prev.slice(-5), {
          t: new Date().toTimeString().slice(0, 8),
          msg: `PROCESS_OK: PING HUB-${Math.floor(Math.random()*5)+1} nominal`,
          color: "rgba(255,255,255,0.4)"
        }]);
      }
    }, 2500);

    // Live update charts
    const chartId = setInterval(() => {
      setSyncHistory(prev => {
        const next = Math.max(97.2, Math.min(99.9, prev[prev.length - 1] + (Math.random() - 0.5) * 0.4));
        return [...prev.slice(1), parseFloat(next.toFixed(1))];
      });
      setEffHistory(prev => {
        const next = Math.max(91.0, Math.min(99.9, prev[prev.length - 1] + (Math.random() - 0.5) * 0.6));
        return [...prev.slice(1), parseFloat(next.toFixed(1))];
      });
    }, 3000);

    return () => { clearInterval(id); clearInterval(chartId); };
  }, []);

  return (
    <motion.div
      className="grid grid-cols-12 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >

      {/* ── Hero: Swarm Topology ── */}
      <div className="col-span-12 lg:col-span-8">
        <div className="sn-panel sn-panel-geo relative overflow-hidden sn-bracket" style={{ height: 480 }}>
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
              <span className="sn-label-accent">Swarm Intelligence Network</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="sn-label">4,029 EDGE NODES · 6 HUBS</span>
              <div className="flex items-center gap-1.5">
                <span className="sn-dot sn-dot-live" />
                <span className="sn-label" style={{ color: "var(--color-success)" }}>SYNC</span>
              </div>
            </div>
          </div>

          <SwarmTopologyCanvas />

          {/* Cohesion badge */}
          <div
            className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded"
            style={{
              background: "rgba(3,6,16,0.82)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(56,189,248,0.16)",
            }}
          >
            <div className="sn-label mb-0.5">SWARM COHESION</div>
            <div className="text-lg font-mono font-bold" style={{ color: "var(--intel-primary)" }}>98.4%</div>
          </div>
        </div>

        {/* Dynamic Metrics Row with Live Fluctuating SVG charts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* Node Sync rate with active line graph */}
          <div className="sn-panel p-4 flex flex-col justify-between" style={{ minHeight: 155 }}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="sn-label">SYNC INDEX</span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">REALTIME</span>
              </div>
              <div className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>Active Alignment</div>
              <div className="text-xl font-mono font-bold text-white mb-2">{syncHistory[syncHistory.length - 1]}%</div>
            </div>

            {/* Glowing micro line chart */}
            <div className="w-full h-12 relative overflow-hidden bg-slate-950/45 rounded border border-white/[0.03]">
              <svg className="w-full h-full" viewBox="0 0 200 48" preserveAspectRatio="none">
                <path
                  d={syncHistory.map((val, idx) => `${idx === 0 ? "M" : "L"} ${(idx / (syncHistory.length-1)) * 200} ${40 - (val - 97) * 12}`).join(" ")}
                  fill="none"
                  stroke="var(--intel-primary)"
                  strokeWidth="1.5"
                  style={{ filter: "drop-shadow(0 0 3px var(--intel-primary))" }}
                />
              </svg>
            </div>
          </div>

          {/* Avg CPU Load card with micro performance progress */}
          <div className="sn-panel p-4 flex flex-col justify-between" style={{ minHeight: 155 }}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="sn-label">CPU LOAD</span>
                <Cpu size={12} className="text-slate-400" />
              </div>
              <div className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>Avg Orchestrator Load</div>
              <div className="text-xl font-mono font-bold text-white mb-2">42%</div>
            </div>

            <div className="space-y-1.5">
              <div className="sn-bar-track">
                <div className="sn-bar-fill" style={{ width: "42%" }} />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-white/30">
                <span>SYS PRE-ALLOC</span><span>STANDBY</span>
              </div>
            </div>
          </div>

          {/* Swarm Efficiency Area Graph */}
          <div className="sn-panel p-4 flex flex-col justify-between" style={{ minHeight: 155 }}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="sn-label">SWARM EFFICIENCY</span>
                <Radio size={11} className="text-violet-400 animate-pulse" />
              </div>
              <div className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>Node Sync Trend</div>
              <div className="text-xl font-mono font-bold text-violet-400 mb-2">{effHistory[effHistory.length - 1]}%</div>
            </div>

            {/* Glowing micro area chart */}
            <div className="w-full h-12 relative overflow-hidden bg-slate-950/45 rounded border border-white/[0.03]">
              <svg className="w-full h-full" viewBox="0 0 200 48" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={effHistory.map((val, idx) => `${idx === 0 ? "M" : "L"} ${(idx / (effHistory.length-1)) * 200} ${44 - (val - 90) * 4.5}`).join(" ") + " L 200 48 L 0 48 Z"}
                  fill="url(#effGrad)"
                />
                <path
                  d={effHistory.map((val, idx) => `${idx === 0 ? "M" : "L"} ${(idx / (effHistory.length-1)) * 200} ${44 - (val - 90) * 4.5}`).join(" ")}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Agents + Comm Logs & Neural Synchronization ── */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

        {/* Active agents */}
        <div className="sn-panel p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <span className="sn-label-accent">Active Swarm Telemetry</span>
            <span className="sn-badge sn-badge-success">4 ONLINE</span>
          </div>

          {[
            { sym: "α", name: "AGENT-ALPHA",  role: "Neural Architect",   lat: "8ms",   bg: "rgba(56,189,248,0.08)", bdr: "rgba(56,189,248,0.25)", prog: 84, cl: "sn-bar-fill",         lat_c: "var(--color-success)"  },
            { sym: "σ", name: "AGENT-SIGMA",  role: "Threat Neutralizer", lat: "42ms",  bg: "rgba(251,146,60,0.08)", bdr: "rgba(251,146,60,0.25)", prog: 12, cl: "sn-bar-fill-warning",  lat_c: "var(--color-warning)"  },
            { sym: "β", name: "AGENT-BETA",   role: "Route Planner",      lat: "11ms",  bg: "rgba(52,211,153,0.08)", bdr: "rgba(52,211,153,0.25)", prog: 67, cl: "sn-bar-fill-success",  lat_c: "var(--color-success)"  },
            { sym: "δ", name: "AGENT-DELTA",  role: "Grid Optimizer",     lat: "9ms",   bg: "rgba(56,189,248,0.08)", bdr: "rgba(56,189,248,0.25)", prog: 91, cl: "sn-bar-fill",         lat_c: "var(--color-success)"  },
          ].map(ag => (
            <div key={ag.name} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-base)" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold" style={{ background: ag.bg, border: `1px solid ${ag.bdr}`, color: "var(--intel-primary)" }}>
                    {ag.sym}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{ag.name}</div>
                    <div className="sn-label">{ag.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold" style={{ color: ag.lat_c }}>{ag.lat}</span>
              </div>
              <div className="flex justify-between sn-label mb-1">
                <span>Progress</span>
                <span style={{ color: "var(--text-secondary)" }}>{ag.prog}%</span>
              </div>
              <div className="sn-bar-track">
                <div className={ag.cl} style={{ width: `${ag.prog}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Neural Sync Subprocess Console */}
        <div className="sn-panel p-4">
          <div className="flex items-center gap-1.5 sn-label-accent mb-2.5 pb-2" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <Server size={11} style={{ color: "var(--neural-primary)" }} />
            <span>Neural Sync Processes</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "THREAD-1A", status: "SYNCED", color: "var(--color-success)" },
              { label: "THREAD-1B", status: "FLUSHING", color: "var(--color-warning)" },
              { label: "THREAD-2C", status: "SECURE_IDLE", color: "var(--intel-primary)" },
              { label: "THREAD-3D", status: "ORCHESTRATE", color: "var(--color-success)" },
            ].map(thread => (
              <div key={thread.label} className="p-2 rounded bg-slate-950/60 border border-white/[0.03] flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-400">{thread.label}</span>
                <span className="text-[8px] font-mono font-bold flex items-center gap-1" style={{ color: thread.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: thread.color }} />
                  {thread.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comm stream */}
        <div className="sn-panel p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <Terminal size={11} style={{ color: "var(--text-muted)" }} />
            <span className="sn-label-accent">Comm Stream</span>
            <span className="sn-dot sn-dot-live ml-auto" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 min-h-[90px] max-h-[140px]">
            {logs.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 text-[10px] font-mono"
              >
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>[{l.t}]</span>
                <span style={{ color: l.color, wordBreak: "break-all" }}>{l.msg}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
