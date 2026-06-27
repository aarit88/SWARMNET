/**
 * SWARMNET — COMMAND VIEW
 * ========================
 * Tactical map is the visual centerpiece.
 * Surrounding panels: live KPIs, AI chart, decision log.
 * Cinematic atmosphere × precision readability.
 * ADDITIVELY ENHANCED:
 *   · Satellite Scope frame layout
 *   · Live AI Reasoning Engine stream terminal
 *   · Canvas-animated Comm Spectrum Waveform
 *   · Municipal Infrastructure Failure Matrix
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Activity, Globe, Download, Zap, Radio, Server, Check } from "lucide-react";
import TacticalMapCanvas from "./TacticalMapCanvas";
import { Panel } from "../ui/Panel";
import { Badge } from "../ui/Badge";
import { StatCard } from "../ui/StatCard";

import { useTelemetryWebSocket } from "@/hooks/useTelemetryWebSocket";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Normalize lat/lng to 0-1 based on a bounding box around SF
function normalizeCoordinates(lat: number, lng: number) {
  const minLat = 37.7249;
  const maxLat = 37.8249;
  const minLng = -122.4694;
  const maxLng = -122.3694;
  return {
    y: 1 - ((lat - minLat) / (maxLat - minLat)), // flip Y for screen coords
    x: (lng - minLng) / (maxLng - minLng),
  };
}

// ── Canvas-based real-time Comm Spectrum ──
function CommSpectrumCanvas() {
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

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(56,189,248,0.03)";
      ctx.lineWidth   = 0.5;
      for (let x = 0; x < W; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 18) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Sine Wave 1 (Primary AI Link)
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth   = 1.4;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = H / 2 +
          Math.sin(x * 0.035 + frame * 0.08) * 16 * Math.sin(x * 0.005 + frame * 0.015) +
          Math.cos(x * 0.09 - frame * 0.12) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Sine Wave 2 (Secondary Neural Channel)
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth   = 0.8;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = H / 2 +
          Math.cos(x * 0.025 - frame * 0.06) * 11 * Math.sin(x * 0.004 + frame * 0.01) -
          Math.sin(x * 0.11 + frame * 0.18) * 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="w-full h-full opacity-80" />;
}

// ── Real-time simulated AI reasoning steps ──
const REASONING_STEPS = [
  "OPTIMIZATION PLAN CALIBRATED FOR SECTOR DELTA CONGESTION...",
  "ANOMALY DISPATCH: 1.2% LOAD FLUCTUATION DETECTED IN POWER-G...",
  "ROUTING EMERGENCY UNIT-02 VIA SECURE ESCAPE CORRIDOR A...",
  "AI FORECAST: PREDICTIVE DANGER GRADIENT DECREASING...",
  "ESTABLISHING AES KEYROTATION SYNC [ALL HUBS SYNCHRONIZED]...",
  "BYPASS ACTIVE FOR MUNICIPAL AQUEOUS FLOW-VALVE 4...",
  "AUTONOMOUS CORRIDOR MATRIX CONFIRMED — TARGETS LOCKED...",
  "SWARM EFFICIENCY BENCHMARK STABILIZED AT 98.4%...",
];

export default function DashboardCommandView() {
  const [activeTab, setActiveTab] = useState<"map" | "terminal" | "drone">("map");
  const { isConnected, agents } = useTelemetryWebSocket("ws://localhost:8000/ws/dashboard");
  const [timeScale, setTimeScale] = useState("72H");
  const [reasoningLogs, setReasoningLogs] = useState<string[]>(REASONING_STEPS.slice(0, 3));

  // Normalize websocket agents for the canvas
  const normalizedAgents = agents.map((agent, i) => {
    const coords = normalizeCoordinates(agent.lat, agent.lng);
    return {
      x: coords.x,
      y: coords.y,
      assignedTo: i % 4, // dummy assignment to incidents
      speed: 0, // Not needed, backend handles position
      targetX: coords.x,
      targetY: coords.y,
      trail: [],
      phase: 0,
      id: agent.id
    };
  });

  // Dynamic log streamer
  useEffect(() => {
    let index = 3;
    const interval = setInterval(() => {
      setReasoningLogs(prev => {
        const nextLog = REASONING_STEPS[index % REASONING_STEPS.length];
        index++;
        return [...prev.slice(-3), nextLog];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-12 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >

      {/* ════════════════════════════════════════
          HERO MAP — full-width top row
          ════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <Panel
          variant="geo"
          className="sn-bracket relative overflow-hidden min-h-[460px] flex-1"
        >
          {/* Satellite view bounds line HUD styling overlay */}
          <div className="absolute inset-4 pointer-events-none border border-white/[0.02] z-10">
            {/* Viewfinder crosshairs */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
            <div className="absolute top-4 left-4 text-[9px] font-mono text-white/20">SYS: REC_CAM_809</div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/20">ZOOM: 1.4X (SAT_HD)</div>
          </div>

          {/* Panel header */}
          <div
            className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-5 py-3"
            style={{
              background: "rgba(3,6,16,0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(34,211,238,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="sn-dot sn-dot-alert" />
              <span className="sn-label-geo">Live Tactical Map</span>
              <span
                className="px-2 py-0.5 text-[9px] font-mono rounded"
                style={{
                  background: "rgba(34,211,238,0.07)",
                  border: "1px solid rgba(34,211,238,0.18)",
                  color: "var(--geo-primary)",
                  letterSpacing: "0.1em",
                }}
              >
                SWARM-INTEL FEED
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="sn-label">40°42′N · 74°00′W</span>
              <div className="flex items-center gap-1.5">
                <span className="sn-dot sn-dot-live" />
                <span className="sn-label" style={{ color: "var(--color-success)" }}>LIVE</span>
              </div>
            </div>
          </div>

          {/* The map canvas */}
          <TacticalMapCanvas liveAgents={normalizedAgents} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

          {/* Incident legend overlay */}
          <div
            className="absolute bottom-3 left-4 flex flex-col gap-1.5 z-10"
            style={{
              background: "rgba(3,6,16,0.78)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              padding: "8px 12px",
            }}
          >
            {[
              { color: "var(--color-critical)", label: "CRITICAL" },
              { color: "var(--color-warning)",  label: "HIGH"     },
              { color: "#fbbf24",               label: "MEDIUM"   },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Swarm agent count badge */}
          <div
            className="absolute bottom-3 right-4 z-10 flex items-center gap-2"
            style={{
              background: "rgba(3,6,16,0.78)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(56,189,248,0.18)",
              borderRadius: 6,
              padding: "7px 12px",
            }}
          >
            <span className="sn-dot sn-dot-intel" />
            <span className="text-[10px] font-mono font-semibold" style={{ color: "var(--intel-primary)" }}>
              {agents.length > 0 ? agents.length : 14} AGENTS ACTIVE
            </span>
          </div>
        </Panel>
      </div>

      {/* ════════════════════════════════════════
          Right: KPI + Timeline & AI Reasoning
          ════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "INCIDENTS", val: "2", unit: "ACTIVE",    color: "var(--color-critical)", barW: 25,  barCls: "sn-bar-fill-critical", icon: <Shield size={13} /> },
            { label: "LATENCY",   val: "12", unit: "MS",       color: "var(--color-success)",  barW: 88,  barCls: "sn-bar-fill-success",  icon: <Zap    size={13} /> },
            { label: "STABILITY", val: "74", unit: "INDEX",    color: "var(--intel-primary)",  barW: 74,  barCls: "sn-bar-fill",          icon: <Globe  size={13} /> },
            { label: "READINESS", val: "99.8", unit: "%",      color: "var(--color-success)",  barW: 99.8,barCls: "sn-bar-fill-success",  icon: <Activity size={13} /> },
          ].map(m => (
            <StatCard key={m.label} label={m.label} value={m.val} unit={m.unit} color={m.color} barWidth={m.barW} barClass={m.barCls} icon={m.icon} />
          ))}
        </div>

        {/* Decision & AI Reasoning Dual Panel */}
        <Panel className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div
              className="flex items-center justify-between mb-4 pb-3"
              style={{ borderBottom: "1px solid var(--border-base)" }}
            >
              <span className="sn-label-accent">Decision & Reasoning Engine</span>
              <div className="flex items-center gap-1.5">
                <span className="sn-dot sn-dot-live" />
                <span className="sn-label" style={{ color: "var(--color-success)" }}>AUTONOMOUS</span>
              </div>
            </div>

            <div className="relative pl-4" style={{ borderLeft: "1px solid var(--border-base)" }}>
              {[
                {
                  time: "04:12:00",
                  title: "Critical Mitigation Enabled",
                  desc: "Units 01–14 assigned. Bypass corridor dynamic flow active.",
                  dot: "sn-dot-live", badge: "sn-badge-success", badgeLabel: "+14% EFF",
                },
                {
                  time: "03:45:12",
                  title: "Power Grid Failover",
                  desc: "Sector G sub-node failed. Swarm battery redistribution.",
                  dot: "sn-dot-alert", badge: "sn-badge-critical", badgeLabel: "CRITICAL",
                },
              ].map((ev, i) => (
                <div key={i} className="relative mb-4 group">
                  <div
                    className="absolute -left-[21px] top-[2px] w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ background: "var(--surface-raised)", border: "1px solid rgba(56,189,248,0.22)" }}
                  >
                    <span className={`sn-dot ${ev.dot}`} style={{ width: 5, height: 5 }} />
                  </div>
                  <div className="sn-label mb-0.5">{ev.time} UTC</div>
                  <div className="text-[11px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{ev.title}</div>
                  <p className="text-[10px] leading-relaxed mb-1.5" style={{ color: "var(--text-secondary)" }}>{ev.desc}</p>
                  <Badge variant={ev.badge === "sn-badge-success" ? "success" : "critical"} style={{ fontSize: 8 }}>{ev.badgeLabel}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time AI reasoning console terminal overlay */}
          <div
            className="mt-4 p-3.5 rounded border"
            style={{
              background: "rgba(3,6,16,0.9)",
              borderColor: "rgba(56,189,248,0.18)",
            }}
          >
            <div className="flex justify-between items-center sn-label mb-2 pb-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="flex items-center gap-1"><Server size={9} /> REALTIME THOUGHTS</span>
              <span style={{ color: "var(--neural-primary)" }}>COGNITIVE LINK</span>
            </div>
            <div className="space-y-1.5 max-h-[85px] overflow-y-auto">
              {reasoningLogs.map((log, index) => (
                <div key={index} className="text-[9px] font-mono text-emerald-400/90 leading-tight">
                  <span className="text-white/30">&gt;&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* ════════════════════════════════════════
          Bottom: Threat Chart + Comm Spectrum Dual Panel
          ════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <Panel className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={13} style={{ color: "var(--intel-primary)" }} />
              <span className="sn-label-accent">Temporal Escalation Vector & Comm Spectrum</span>
            </div>
            <div className="flex items-center gap-2">
              {["72H","1W","1M"].map(s => (
                <button
                  key={s}
                  onClick={() => setTimeScale(s)}
                  className="px-2.5 py-1 text-[9px] font-mono tracking-widest rounded transition-all"
                  style={{
                    background:   timeScale === s ? "rgba(56,189,248,0.1)" : "transparent",
                    color:        timeScale === s ? "var(--intel-primary)" : "var(--text-muted)",
                    border: `1px solid ${timeScale === s ? "rgba(56,189,248,0.25)" : "var(--border-base)"}`,
                  }}
                >
                  {s}
                </button>
              ))}
              <button className="sn-btn-ghost" style={{ padding: "5px 10px", fontSize: 9 }}>
                <Download size={9} /> EXPORT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Split: Escalation graph (col-span-8) */}
            <div
              className="col-span-12 md:col-span-8 relative rounded overflow-hidden sn-map-grid"
              style={{ height: 140, background: "rgba(3,5,14,0.85)", border: "1px solid var(--border-base)" }}
            >
              <div className="sn-scan-line" />
              <svg className="w-full h-full" viewBox="0 0 540 140" preserveAspectRatio="none">
                {[28,56,84,112].map(y => (
                  <line key={y} x1="0" y1={y} x2="540" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 8" />
                ))}
                <line x1="270" y1="0" x2="270" y2="140" stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="276" y="12" fill="rgba(56,189,248,0.4)" fontSize="8" fontFamily="monospace">NOW</text>

                {/* Threat escalation */}
                <path d="M20 128 L100 112 L180 88 L260 68 L320 75 L400 55 L480 44 L520 34"
                  fill="none" stroke="var(--color-critical)" strokeWidth="1.8" opacity="0.85" />
                {/* AI prediction (dashed) */}
                <path d="M20 120 Q140 100 260 82 T450 50 T520 36"
                  fill="none" stroke="var(--intel-primary)" strokeWidth="1.6"
                  strokeDasharray="6,5" strokeDashoffset="0" opacity="0.7">
                  <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="1.4s" repeatCount="indefinite" />
                </path>
                {/* Response */}
                <path d="M20 125 L100 118 L180 115 L260 100 L320 95 L400 85 L480 75 L520 62"
                  fill="none" stroke="var(--color-success)" strokeWidth="1.4" opacity="0.6" />

                {/* Axis labels */}
                {[[20,"T−72H"],[130,"T−24H"],[270,"NOW"],[400,"+24H"],[500,"+48H"]].map(([x,l]) => (
                  <text key={l} x={x} y="136" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="7" fontFamily="monospace">{l}</text>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute top-2 right-3 flex flex-col gap-1">
                {[
                  { c: "var(--color-critical)", l: "Escalation" },
                  { c: "var(--color-success)",  l: "Response"   },
                  { c: "var(--intel-primary)",  l: "AI Proj."   },
                ].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <span className="w-4 h-[1.5px] block rounded" style={{ background: c }} />
                    <span className="text-[8px] font-mono" style={{ color: "var(--text-muted)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Split: Comm Spectrum Scope (col-span-4) */}
            <div
              className="col-span-12 md:col-span-4 relative rounded overflow-hidden"
              style={{ height: 140, background: "rgba(3,5,14,0.85)", border: "1px solid var(--border-base)" }}
            >
              <div className="absolute top-2 left-3 z-10 flex items-center gap-1.5">
                <Radio size={9} className="text-sky-400 animate-pulse" />
                <span className="sn-label" style={{ fontSize: 7, color: "var(--intel-primary)" }}>COMSPEC SPECTRUM SCOPE</span>
              </div>
              <CommSpectrumCanvas />
              <div className="absolute bottom-2 right-3 text-[8px] font-mono text-white/30">AES-X_BAND_ACTIVE</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Bottom-right: AI Status */}
      <div className="col-span-12 lg:col-span-4 flex flex-col">
        <Panel className="p-5 h-full flex flex-col justify-between flex-1">
          <div>
            <span className="sn-label-accent block mb-4">AI Engine Status</span>
            <div className="space-y-3">
              {[
                { label: "Neural Prediction",  val: "99.2%",   color: "var(--color-success)", barW: 99.2, barCls: "sn-bar-fill-success"  },
                { label: "Swarm Cohesion",     val: "98.4%",   color: "var(--intel-primary)", barW: 98.4, barCls: "sn-bar-fill"           },
                { label: "Route Optimization", val: "ACTIVE",  color: "var(--color-success)", barW: null, barCls: ""                      },
                { label: "Threat Model",       val: "v7.2.1",  color: "var(--neural-primary)",barW: null, barCls: ""                      },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{m.label}</span>
                    <span className="text-[11px] font-mono font-semibold" style={{ color: m.color }}>{m.val}</span>
                  </div>
                  {m.barW && <div className="sn-bar-track"><div className={m.barCls} style={{ width: `${m.barW}%` }} /></div>}
                  {!m.barW && <div style={{ height: 2, background: "var(--border-base)", borderRadius: 1 }} />}
                </div>
              ))}
            </div>
          </div>
          <div
            className="mt-4 p-3 rounded flex items-center gap-3"
            style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)" }}
          >
            <span className="sn-dot sn-dot-intel" />
            <div>
              <div className="text-[10px] font-mono font-semibold" style={{ color: "var(--intel-primary)" }}>AUTONOMOUS MODE</div>
              <div className="sn-label">operator: AUTO_SWARM / v4</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* ════════════════════════════════════════
          Bottom Row: Municipal Infrastructure Failover Matrix
          ════════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-8 flex flex-col">
        <Panel className="p-5 flex-1">
          <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <div className="flex items-center gap-2">
              <Server size={13} style={{ color: "var(--geo-primary)" }} />
              <span className="sn-label-accent">Municipal Infrastructure & Failover Matrix</span>
            </div>
            <span className="sn-badge sn-badge-intel">GRID OVERWATCH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { id: "TRANSIT-01", desc: "Metro Subway Line-4", status: "STABLE",    val: 94, c: "var(--color-success)"  },
              { id: "POWER-G",    desc: "Delta Station Grid",  status: "DEGRADED",  val: 56, c: "var(--color-warning)"  },
              { id: "AQUEOUS-4",  desc: "Sewer Bypass Valve",  status: "CRITICAL",  val: 12, c: "var(--color-critical)" },
              { id: "TELECOM-E",  desc: "Microwave Node-E",    status: "OPTIMAL",   val: 99, c: "var(--intel-primary)"  },
            ].map(grid => (
              <div
                key={grid.id}
                className="p-3 rounded transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid var(--border-base)",
                }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-mono font-semibold text-white">{grid.id}</span>
                  <span className="text-[9px] font-bold" style={{ color: grid.c }}>{grid.status}</span>
                </div>
                <div className="text-[9px] text-[var(--text-secondary)] mb-2">{grid.desc}</div>
                <div className="flex justify-between text-[9px] font-mono mb-1 text-[var(--text-muted)]">
                  <span>FLOW / LOAD</span>
                  <span style={{ color: grid.c }}>{grid.val}%</span>
                </div>
                <div className="sn-bar-track">
                  <div
                    style={{
                      height: "100%",
                      width: `${grid.val}%`,
                      background: grid.c,
                      borderRadius: 1,
                      boxShadow: `0 0 5px ${grid.c}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Dynamic Engine Control dials */}
      <div className="col-span-12 lg:col-span-4 flex flex-col">
        <Panel className="p-5 h-full flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={12} className="text-violet-400" />
              <span className="sn-label-accent">Cohesion Control Engine</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mb-4">
              Real-time parameter dials mapping physical emergency escalation vectors to AI throttle levels.
            </p>
            <div className="space-y-2.5">
              {[
                { name: "Cognitive Damping", level: "0.24", val: "24%", c: "var(--intel-primary)" },
                { name: "Grid Throttle Index", level: "0.85", val: "85%", c: "var(--neural-primary)" },
              ].map(dial => (
                <div key={dial.name} className="flex justify-between items-center p-2 rounded" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)]">{dial.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold" style={{ color: dial.c }}>{dial.level}</span>
                    <span className="sn-badge sn-badge-neutral">{dial.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-base)" }}>
            <span className="sn-label">MUTATOR PARAMETERS</span>
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400"><Check size={10} /> ACTIVE</span>
          </div>
        </Panel>
      </div>

    </motion.div>
  );
}
