/**
 * SWARMNET — ANALYTICS VIEW
 * ==========================
 * State-of-the-art predictive analytics cockpit.
 * Loaded with the complete suite of visual forecasting tools:
 *   · LiveGraph components for response-times and synchronizations
 *   · Crisis Progression Analytics
 *   · Resource Utilization Matrix
 *   · Interactive Heatmap
 *   · AI Forecast escalation charts
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldAlert, BarChart2, Zap, Server, Activity, ArrowUpRight } from "lucide-react";
import LiveGraph from "./LiveGraph";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DashboardAnalyticsView() {
  const [progRate, setProgRate] = useState(74);

  useEffect(() => {
    const id = setInterval(() => {
      setProgRate(p => Math.max(60, Math.min(99, p + (Math.random() - 0.5) * 1.5)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-12 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >

      {/* ── Top row: Dynamic Telemetry LiveGraphs ── */}
      <div className="col-span-12 md:col-span-4">
        <LiveGraph metricName="Response-Time Vector" metricColor="#38bdf8" height={190} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <LiveGraph metricName="Node Synchronization Jitter" metricColor="#a78bfa" height={190} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <LiveGraph metricName="Resource Load Distribution" metricColor="#34d399" height={190} />
      </div>

      {/* ── Middle: AI Forecast & Crisis Progression ── */}
      <div className="col-span-12 lg:col-span-8">
        <div className="sn-panel p-5 flex flex-col justify-between" style={{ minHeight: 280 }}>
          <div>
            <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={13} style={{ color: "var(--intel-primary)" }} />
                <span className="sn-label-accent">AI Forecast & Threat Escalation Curve</span>
              </div>
              <span className="sn-badge sn-badge-critical">HIGH MITIGATION ACTIVE</span>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-4">
              Real-time progression vector overlaying historical curves against predictive neural network forecast parameters.
            </p>

            <div
              className="relative rounded overflow-hidden sn-map-grid"
              style={{ height: 130, background: "rgba(3,5,14,0.85)", border: "1px solid var(--border-base)" }}
            >
              <div className="sn-scan-line" />
              <svg className="w-full h-full" viewBox="0 0 740 130" preserveAspectRatio="none">
                {[26,52,78,104].map(y => (
                  <line key={y} x1="0" y1={y} x2="740" y2={y} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 8" />
                ))}
                <line x1="370" y1="0" x2="370" y2="130" stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="376" y="12" fill="rgba(56,189,248,0.4)" fontSize="8" fontFamily="monospace">NOW</text>

                {/* Simulated threat expansion curves */}
                <path d="M20 115 L140 100 L260 76 L370 56 L460 62 L580 44 L660 32 L720 22"
                  fill="none" stroke="var(--color-critical)" strokeWidth="1.8" opacity="0.85" />
                <path d="M20 100 Q200 80 370 65 T600 35 T720 20"
                  fill="none" stroke="var(--intel-primary)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.7">
                  <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: "1px solid var(--border-base)" }}>
            <span className="sn-label">MUTATED VECTOR ANALYSIS</span>
            <span className="text-[10px] font-mono text-[var(--intel-primary)]">CRIT_THRESHOLD: 88.2%</span>
          </div>
        </div>
      </div>

      {/* Crisis Progression details */}
      <div className="col-span-12 lg:col-span-4">
        <div className="sn-panel p-5 h-full flex flex-col justify-between" style={{ minHeight: 280 }}>
          <div>
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
              <div className="flex items-center gap-2">
                <ShieldAlert size={12} className="text-orange-400" />
                <span className="sn-label-accent">Progression Index</span>
              </div>
              <span className="sn-badge sn-badge-warning">EVALUATING</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between sn-label mb-1.5">
                  <span>CRISIS MITIGATION RATE</span>
                  <span style={{ color: "var(--color-success)" }}>{progRate.toFixed(1)}%</span>
                </div>
                <div className="sn-bar-track">
                  <div className="sn-bar-fill-success" style={{ width: `${progRate}%`, transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between sn-label mb-1.5">
                  <span>PREDICTIVE ESCALATION VECTOR</span>
                  <span style={{ color: "var(--color-critical)" }}>24.2%</span>
                </div>
                <div className="sn-bar-track">
                  <div className="sn-bar-fill-critical" style={{ width: "24.2%" }} />
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-3.5 rounded mt-4"
            style={{
              background: "rgba(167,139,250,0.06)",
              border: "1px solid rgba(167,139,250,0.18)",
            }}
          >
            <div className="text-[10px] font-mono font-bold text-violet-400 mb-1">COGNITIVE DEVIATION STATUS</div>
            <div className="text-[9px] font-mono text-[var(--text-secondary)] leading-relaxed">
              Deviation parameter within delta-limit (0.04% bias). Swarm optimization functioning optimally.
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: Heatmap & Resource matrix ── */}
      <div className="col-span-12 lg:col-span-8">
        <div className="sn-panel p-5">
          <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-base)" }}>
            <div className="flex items-center gap-2">
              <BarChart2 size={13} style={{ color: "var(--geo-primary)" }} />
              <span className="sn-label-accent">Resource Allocation & Multi-grid Balance</span>
            </div>
            <span className="sn-badge sn-badge-geo">OVERLAPPED MATRIX</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { id: "AERIAL-DRONES", num: "420", desc: "Thermal Scanner", load: 74, status: "STANDBY" },
              { id: "CYBER-SHIELDS", num: "18",  desc: "Mesh Protects",   load: 35, status: "ARMED"   },
              { id: "FIRE-SUPPRESS", num: "8",   desc: "Suppression B",   load: 92, status: "BUSY"    },
              { id: "MED-ROUTERS",   num: "110", desc: "Grid Ambulance",  load: 54, status: "ACTIVE"  },
            ].map(matrix => (
              <div
                key={matrix.id}
                className="p-3 rounded"
                style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-base)" }}
              >
                <div className="flex justify-between items-center mb-1 text-[10px] font-mono font-semibold text-white">
                  <span>{matrix.id}</span>
                  <span className="text-[9px] font-bold text-sky-400">{matrix.num}</span>
                </div>
                <div className="text-[9px] text-[var(--text-secondary)] mb-2">{matrix.desc}</div>
                <div className="flex justify-between text-[8px] font-mono mb-1 text-[var(--text-muted)]">
                  <span>ALLOCATED</span>
                  <span>{matrix.load}%</span>
                </div>
                <div className="sn-bar-track">
                  <div className="sn-bar-fill" style={{ width: `${matrix.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="sn-panel p-5 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="sn-label-accent">Operational Diagnostics</span>
              <ArrowUpRight size={12} className="text-emerald-400" />
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
              Diagnostic parameter streams tracking core database indexes, response vectors, and hardware buffer queues.
            </p>
          </div>
          <div className="mt-4 pt-3 flex justify-between items-center" style={{ borderTop: "1px solid var(--border-base)" }}>
            <span className="sn-label">DIAG STATS</span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">100% HEALTH</span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
