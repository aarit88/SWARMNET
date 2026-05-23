/**
 * SWARMNET — Live Incident Response Feed
 * ========================================
 * Streams active incidents, classifications, dispatch plans,
 * and state updates in real-time.
 */

"use client";

import { useState, useEffect } from "react";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  location: string;
  status: "active" | "mitigated" | "dispatching";
  dispatchedAgents: string[];
  timestamp: string;
}

export default function IncidentFeed() {
  const [filter, setFilter] = useState<string>("all");
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "inc-104",
      title: "Commercial Fire — 3rd Alarm",
      severity: "critical",
      location: "Main St & 4th Avenue",
      status: "active",
      dispatchedAgents: ["incident-agent", "alert-agent"],
      timestamp: "1m ago",
    },
    {
      id: "inc-103",
      title: "Vehicle Multi-Collision",
      severity: "high",
      location: "I-95 South, Marker 142",
      status: "dispatching",
      dispatchedAgents: ["traffic-agent"],
      timestamp: "5m ago",
    },
    {
      id: "inc-102",
      title: "Power Substation Anomaly",
      severity: "medium",
      location: "East Industrial Park",
      status: "mitigated",
      dispatchedAgents: ["incident-agent"],
      timestamp: "14m ago",
    },
    {
      id: "inc-101",
      title: "Water Main Pressure Drop",
      severity: "low",
      location: "Westside Grid Area 4",
      status: "mitigated",
      dispatchedAgents: [],
      timestamp: "28m ago",
    },
  ]);

  // Stream mock incident events periodically
  useEffect(() => {
    const mockEvents = [
      {
        id: `inc-${Math.floor(Math.random() * 900) + 200}`,
        title: "Gas Leak Reported",
        severity: "high" as const,
        location: "Broadway Commercial Corridor",
        status: "dispatching" as const,
        dispatchedAgents: ["incident-agent", "alert-agent"],
        timestamp: "Just now",
      },
      {
        id: `inc-${Math.floor(Math.random() * 900) + 200}`,
        title: "Traffic Intersection Blockage",
        severity: "medium" as const,
        location: "5th Ave & 23rd St",
        status: "active" as const,
        dispatchedAgents: ["traffic-agent"],
        timestamp: "Just now",
      },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const nextEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        setIncidents((prev) => [nextEvent, ...prev.slice(0, 5)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === "all") return true;
    return inc.severity === filter;
  });

  return (
    <div className="glass-card flex flex-col h-full bg-[var(--bg-secondary)]/30">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full pulse-dot" />
          <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--accent-cyan)]">
            Incident Event Feed
          </h2>
        </div>
        <div className="flex gap-2">
          {["all", "critical", "high", "medium"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase transition-colors ${
                filter === lvl
                  ? "bg-[var(--accent-cyan)]/25 text-[var(--accent-cyan)] border-[var(--accent-cyan)]/50"
                  : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Stream */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[400px]">
        {filteredIncidents.map((incident) => {
          const isCritical = incident.severity === "critical";
          const isHigh = incident.severity === "high";
          const isMedium = incident.severity === "medium";

          return (
            <div
              key={incident.id}
              className="p-4 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all flex gap-4"
            >
              {/* Severity Side Bar */}
              <div
                className={`w-1 rounded-full ${
                  isCritical
                    ? "bg-[var(--accent-red)]"
                    : isHigh
                    ? "bg-[var(--accent-amber)]"
                    : isMedium
                    ? "bg-[var(--accent-blue)]"
                    : "bg-[var(--text-muted)]"
                }`}
              />

              {/* Core Information */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs font-bold truncate uppercase tracking-wide">
                    {incident.title}
                  </h3>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] whitespace-nowrap ml-2">
                    {incident.timestamp}
                  </span>
                </div>

                <div className="text-[11px] text-[var(--text-secondary)] font-mono flex items-center gap-1.5 mb-2">
                  <svg
                    className="w-3.5 h-3.5 text-[var(--text-muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{incident.location}</span>
                </div>

                {/* Dispatch Details */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]/40">
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">
                    DISPATCH:
                  </span>
                  {incident.dispatchedAgents.length > 0 ? (
                    incident.dispatchedAgents.map((agent) => (
                      <span
                        key={agent}
                        className="text-[9px] font-mono bg-slate-900 border border-[var(--border-subtle)] rounded px-1.5 py-0.5 text-[var(--accent-cyan)]"
                      >
                        {agent.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] font-mono text-[var(--text-muted)] italic">
                      No active dispatches
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end justify-between">
                <span className="text-[9px] font-mono text-[var(--text-muted)]">
                  #{incident.id}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    incident.status === "active"
                      ? "bg-[var(--accent-red)]/10 text-[var(--accent-red)]"
                      : incident.status === "dispatching"
                      ? "bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]"
                      : "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                  }`}
                >
                  {incident.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
