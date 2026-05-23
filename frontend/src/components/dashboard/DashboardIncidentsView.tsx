/**
 * SWARMNET — INCIDENTS VIEW
 * ==========================
 * Map-first incident intelligence:
 * · Large tactical map with incident overlays
 * · Real-time incident feed
 * · Emergency spread visualization
 * · Predictive danger zones
 * · Response unit deployment
 * ADDITIVELY ENHANCED:
 *   · Multi-City Global Monitoring Scope
 *   · Emergency Resource Balancing bar charts
 *   · Incident Replay historical timelines
 */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Flame, Zap, AlertTriangle, Navigation, Globe, RefreshCw } from "lucide-react";
import TacticalMapCanvas from "./TacticalMapCanvas";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INCIDENTS = [
  {
    id: "INC-20247-A",
    title: "Structural Fire",
    location: "Zone Delta",
    coord: "40.71°N 74.00°W",
    type: "fire",
    severity: "CRITICAL" as const,
    sev_cls: "sn-badge-critical",
    dot: "sn-dot-alert",
    time: "04:12:08 UTC",
    victims: "Est. 12 civilians",
    desc: "Multi-floor structural fire detected via thermal imaging. Swarm units 01–08 deployed. Evacuation corridor established.",
    updates: [
      { t: "04:14", text: "Units 01–08 on site",  color: "var(--intel-primary)"  },
      { t: "04:18", text: "Suppression active",    color: "var(--color-warning)"  },
      { t: "04:22", text: "Evacuation 68% done",   color: "var(--color-success)"  },
    ],
    replay: [
      { t: "T-14m", action: "Thermal anomaly detected" },
      { t: "T-10m", action: "Sub-route optimization done" },
      { t: "T-2m",  action: "Bypass valves enabled" }
    ],
    spread: 78,
    contained: 41,
  },
  {
    id: "INC-20247-B",
    title: "Power Grid Failure",
    location: "Sector G",
    coord: "51.50°N 0.12°W",
    type: "power",
    severity: "HIGH" as const,
    sev_cls: "sn-badge-warning",
    dot: "sn-dot-warn",
    time: "03:45:12 UTC",
    victims: "14,000 residents offline",
    desc: "External power grid failure affecting 14,000 residents. Swarm cell backup distribution initiated. Engineers en route.",
    updates: [
      { t: "03:48", text: "Cell backup online",   color: "var(--color-success)"  },
      { t: "03:55", text: "Engineers dispatched",  color: "var(--intel-primary)"  },
    ],
    replay: [
      { t: "T-18m", action: "Substation load trip" },
      { t: "T-8m",  action: "Orchestrator cell bypass" }
    ],
    spread: 44,
    contained: 70,
  },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  fire:  <Flame    size={13} />,
  power: <Zap      size={13} />,
  other: <AlertTriangle size={13} />,
};

export default function DashboardIncidentsView() {
  const [activeId, setActiveId] = useState("INC-20247-A");
  const active = INCIDENTS.find(i => i.id === activeId)!;

  return (
    <motion.div
      className="grid grid-cols-12 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >

      {/* ══════════════════════════════════════
          Left Column: Incident Feed & Multi-City Scope
          ══════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
        {/* Incident Feed list */}
        <div className="sn-panel p-5 flex flex-col" style={{ minHeight: 330 }}>
          <div
            className="flex items-center justify-between mb-4 pb-3"
            style={{ borderBottom: "1px solid var(--border-base)" }}
          >
            <div className="flex items-center gap-2">
              <span className="sn-dot sn-dot-alert" />
              <span className="sn-label-accent">Live Feed</span>
            </div>
            <span className="sn-badge sn-badge-critical">2 ACTIVE</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px]">
            {INCIDENTS.map(inc => (
              <button
                key={inc.id}
                onClick={() => setActiveId(inc.id)}
                className="w-full text-left p-3 rounded transition-all duration-200 group"
                style={{
                  background:  activeId === inc.id ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.02)",
                  border:      `1px solid ${activeId === inc.id ? "rgba(56,189,248,0.28)" : "var(--border-base)"}`,
                  boxShadow:   activeId === inc.id ? "0 0 15px rgba(56,189,248,0.06)" : "none",
                }}
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className={`sn-dot ${inc.dot} mt-1`} />
                    <div>
                      <div
                        className="text-[11px] font-semibold group-hover:text-[var(--intel-primary)] transition-colors"
                        style={{ color: "var(--text-primary)", lineHeight: 1.2 }}
                      >
                        {inc.title}
                      </div>
                      <div className="sn-label">{inc.location}</div>
                    </div>
                  </div>
                  <span className={`sn-badge ${inc.sev_cls} shrink-0`} style={{ fontSize: 8 }}>{inc.severity}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats bottom banner */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3" style={{ borderTop: "1px solid var(--border-base)" }}>
            {[
              { l: "RESOLVED", v: "7",    c: "var(--color-success)"  },
              { l: "AVG RESP", v: "4.1s", c: "var(--intel-primary)"  },
            ].map(s => (
              <div key={s.l} className="p-2.5 rounded bg-slate-950/60 border border-white/[0.03]">
                <div className="sn-label mb-0.5">{s.l}</div>
                <div className="text-base font-mono font-bold" style={{ color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand-new addition: Multi-City Global Monitoring Scope */}
        <div className="sn-panel p-5 flex flex-col justify-between" style={{ minHeight: 195 }}>
          <div>
            <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <div className="flex items-center gap-1.5">
                <Globe size={11} className="text-sky-400" />
                <span className="sn-label-accent">Global Operations Scope</span>
              </div>
              <span className="sn-badge sn-badge-neural">ACTIVE</span>
            </div>
            <div className="space-y-2">
              {[
                { city: "TOKYO-GRID", status: "NOMINAL",  c: "var(--color-success)"  },
                { city: "LONDON-GRID",status: "1 WARNING", c: "var(--color-warning)"  },
                { city: "BERLIN-GRID",status: "NOMINAL",  c: "var(--color-success)"  },
              ].map(item => (
                <div key={item.city} className="flex justify-between items-center text-[10px] font-mono p-1 px-2 rounded bg-slate-950/40 border border-white/[0.02]">
                  <span className="text-slate-400">{item.city}</span>
                  <span className="font-semibold" style={{ color: item.c }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] font-mono text-white/30 flex items-center gap-1 mt-3">
            <RefreshCw size={8} className="animate-spin" style={{ animationDuration: "5s" }} /> COORDINATOR FEED SYNCHRONIZED
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Center Column: Tactical Map (HERO)
          ══════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-6">
        <div
          className="sn-panel sn-panel-geo relative overflow-hidden sn-bracket flex flex-col"
          style={{ height: 540 }}
        >
          <div
            className="flex items-center justify-between px-5 py-3 z-10 relative"
            style={{
              background: "rgba(3,6,16,0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(34,211,238,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="sn-dot sn-dot-alert" />
              <span className="sn-label-geo">{active.title} — {active.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="sn-label">{active.coord}</span>
              <span className={`sn-badge ${active.sev_cls}`}>{active.severity}</span>
            </div>
          </div>

          <div className="flex-1 relative">
            <TacticalMapCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

            {/* Spread / Containment overlay panel */}
            <div
              className="absolute bottom-4 left-4 right-4 z-10 flex gap-4 p-4 rounded"
              style={{
                background: "rgba(3,6,16,0.86)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex-1">
                <div className="flex justify-between sn-label mb-1.5">
                  <span>SPREAD RADIUS</span>
                  <span style={{ color: "var(--color-critical)" }}>{active.spread}%</span>
                </div>
                <div className="sn-bar-track" style={{ height: 3 }}>
                  <div className="sn-bar-fill-critical" style={{ width: `${active.spread}%` }} />
                </div>
              </div>
              <div style={{ width: 1, background: "var(--border-base)" }} />
              <div className="flex-1">
                <div className="flex justify-between sn-label mb-1.5">
                  <span>CONTAINED</span>
                  <span style={{ color: "var(--color-success)" }}>{active.contained}%</span>
                </div>
                <div className="sn-bar-track" style={{ height: 3 }}>
                  <div className="sn-bar-fill-success" style={{ width: `${active.contained}%` }} />
                </div>
              </div>
              <div style={{ width: 1, background: "var(--border-base)" }} />
              <div className="flex items-center gap-2">
                <span className="sn-dot sn-dot-intel" />
                <span className="text-[10px] font-mono" style={{ color: "var(--intel-primary)" }}>AI ROUTING</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Right Column: Incident Detail + Resource Balancing
          ══════════════════════════════════════ */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">

        {/* Incident Detail Card (expanded with Replay history) */}
        <div className="sn-panel p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-3.5" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <span style={{ color: "var(--text-muted)" }}>{TYPE_ICON[active.type] ?? TYPE_ICON.other}</span>
            <span className="sn-label-accent">Incident Detail</span>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{active.desc}</p>

          <div className="flex flex-wrap gap-2 text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1"><Clock size={8} /> {active.time}</span>
            <span className="flex items-center gap-1"><Users size={8} /> {active.victims}</span>
            <span className="flex items-center gap-1"><MapPin size={8} /> {active.coord}</span>
          </div>

          {/* New addition: Incident Replay history timeline */}
          <div className="p-3.5 rounded bg-slate-950/45 border border-white/[0.03]">
            <div className="sn-label mb-2 text-[8px] tracking-[0.15em] text-[var(--intel-primary)]">INCIDENT REPLAY FLOW</div>
            <div className="space-y-1.5">
              {active.replay.map((rep, idx) => (
                <div key={idx} className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-white/30">{rep.t}</span>
                  <span className="text-slate-300 font-semibold">{rep.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button onClick={() => alert("Deploying unit...")} className="sn-btn-primary w-full justify-center" style={{ padding: "8px" }}>
              <Navigation size={11} /> DEPLOY UNIT
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="sn-btn-secondary text-[9px] py-1.5 justify-center">ESCALATE</button>
              <button className="sn-btn-ghost text-[9px] py-1.5 justify-center">RESOLVE</button>
            </div>
          </div>
        </div>

        {/* Response Units expanded with Dynamic Resource Balancing bar chart */}
        <div className="sn-panel p-5 flex flex-col justify-between flex-1" style={{ minHeight: 250 }}>
          <div>
            <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <span className="sn-label-accent">Resource Allocation</span>
              <span className="sn-badge sn-badge-success" style={{ fontSize: 8 }}>14 ACTIVE</span>
            </div>

            {/* Micro balancing progress chart */}
            <div className="space-y-2 mb-4">
              {[
                { name: "Aerial Drones", pct: 70, c: "var(--intel-primary)" },
                { name: "Ground Cyber",  pct: 18, c: "var(--neural-primary)" },
                { name: "Fire Engines",  pct: 92, c: "var(--color-critical)" },
                { name: "Ambulance Units", pct: 54, c: "var(--color-success)" },
              ].map(res => (
                <div key={res.name}>
                  <div className="flex justify-between text-[8px] font-mono text-[var(--text-secondary)] mb-0.5">
                    <span>{res.name}</span>
                    <span style={{ color: res.c }}>{res.pct}%</span>
                  </div>
                  <div className="sn-bar-track" style={{ height: 2 }}>
                    <div style={{ height: "100%", width: `${res.pct}%`, background: res.c, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baseline Response units queue */}
          <div className="space-y-1.5 pt-3" style={{ borderTop: "1px solid var(--border-base)" }}>
            {[
              { id: "UNIT-01", status: "ON SITE",  cls: "sn-badge-critical" },
              { id: "UNIT-02", status: "EN ROUTE", cls: "sn-badge-warning"  },
            ].map(u => (
              <div key={u.id} className="flex justify-between items-center p-2 rounded bg-slate-950/40 border border-white/[0.02]">
                <span className="text-[9px] font-mono text-white font-semibold">{u.id}</span>
                <span className={`sn-badge ${u.cls}`} style={{ fontSize: 7, padding: "1px 6px" }}>{u.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
