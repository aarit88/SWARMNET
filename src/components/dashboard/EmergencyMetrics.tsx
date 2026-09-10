/**
 * SWARMNET — Emergency Metrics
 * ==============================
 * Live KPI cards: response time, active dispatches, containment ratio.
 * Real-time fluctuation simulation. Updated to sn-* design system.
 */
"use client";

import { useState, useEffect } from "react";
import { TrendingDown, Zap, ShieldCheck } from "lucide-react";

export default function EmergencyMetrics() {
  const [responseTimes,    setResponseTimes]    = useState<number[]>([4.2, 4.5, 3.9, 4.1]);
  const [activeAlerts,     setActiveAlerts]     = useState<number>(3);
  const [containmentRate,  setContainmentRate]  = useState<number>(84);

  useEffect(() => {
    const id = setInterval(() => {
      setResponseTimes(prev => {
        const next = Math.max(2.5, Math.min(6.0, prev[prev.length - 1] + (Math.random() - 0.5) * 0.4));
        return [...prev.slice(1), parseFloat(next.toFixed(1))];
      });
      if (Math.random() > 0.75) {
        setActiveAlerts(prev => Math.max(1, Math.min(8, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
      setContainmentRate(prev => Math.max(70, Math.min(99, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const avg = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1);

  const cards = [
    {
      label:  "AVG RESPONSE TIME",
      icon:   <TrendingDown size={13} />,
      value:  `${avg}m`,
      sub:    "TARGET: <5.0m",
      badge:  "-12.4% vs L48H",
      badgeCls: "sn-badge-success",
      accent: "var(--color-success)",
      extra: (
        <div className="flex gap-1 h-8 items-end mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {responseTimes.map((t, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-500"
              style={{ height: `${(t / 6) * 100}%`, background: "rgba(56,189,248,0.25)" }}
              title={`${t}m`}
            />
          ))}
          <span className="sn-label ml-2 self-end">TREND</span>
        </div>
      ),
    },
    {
      label:  "ACTIVE DISPATCHES",
      icon:   <Zap size={13} />,
      value:  String(activeAlerts),
      sub:    "SWARM RATIO: 1.3",
      badge:  "HIGH LOAD",
      badgeCls: "sn-badge-warning",
      accent: "var(--color-warning)",
      extra: (
        <div className="flex justify-between mt-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <span className="sn-label">QUEUE STATUS</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--accent-primary)" }}>0 UNRESOLVED</span>
        </div>
      ),
    },
    {
      label:  "CONTAINMENT RATIO",
      icon:   <ShieldCheck size={13} />,
      value:  `${containmentRate}%`,
      sub:    "TARGET: >80%",
      badge:  "OPTIMAL",
      badgeCls: "sn-badge-accent",
      accent: "var(--accent-primary)",
      extra: (
        <div className="mt-4 pt-4 space-y-1" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="sn-bar-track">
            <div className="sn-bar-fill" style={{ width: `${containmentRate}%` }} />
          </div>
          <div className="flex justify-between sn-label">
            <span>0%</span><span>TARGET 80%</span><span>100%</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map(c => (
        <div key={c.label} className="sn-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--text-muted)" }}>{c.icon}</span>
                <span className="sn-label">{c.label}</span>
              </div>
              <span className={`sn-badge ${c.badgeCls}`}>{c.badge}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="sn-value-xl" style={{ color: c.accent }}>{c.value}</span>
              <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>{c.sub}</span>
            </div>
          </div>
          {c.extra}
        </div>
      ))}
    </div>
  );
}
