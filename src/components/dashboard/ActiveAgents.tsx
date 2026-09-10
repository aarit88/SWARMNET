/**
 * SWARMNET — Active Agents Telemetry Panel
 * =========================================
 * Displays real-time status, resource metrics, task logs,
 * and system controls for the AI swarm agents.
 * Updated to use the refined sn-* design system.
 */
"use client";

import { useState } from "react";

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  symbol: string;
  status: "active" | "idle" | "standby" | "offline";
  tasksCompleted: number;
  cpuUsage: number;
  memoryUsage: number;
  lastActive: string;
}

const STATUS_MAP: Record<string, { badge: string; dot: string }> = {
  active:  { badge: "sn-badge-success", dot: "sn-dot-live"   },
  idle:    { badge: "sn-badge-warning", dot: "sn-dot-warn"   },
  standby: { badge: "sn-badge-accent",  dot: "sn-dot-accent" },
  offline: { badge: "sn-badge-neutral", dot: "sn-dot-muted"  },
};

export default function ActiveAgents() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: "incident-agent", symbol: "I",
      name: "Incident Agent",   role: "Anomaly Detection & Classification",
      status: "active",  tasksCompleted: 34, cpuUsage: 42, memoryUsage: 68, lastActive: "Just now",
    },
    {
      id: "traffic-agent", symbol: "T",
      name: "Traffic Agent",    role: "Emergency Corridor Optimization",
      status: "active",  tasksCompleted: 21, cpuUsage: 56, memoryUsage: 74, lastActive: "Just now",
    },
    {
      id: "hospital-agent", symbol: "H",
      name: "Hospital Agent",   role: "Capacity Management & Patient Routing",
      status: "standby", tasksCompleted: 15, cpuUsage: 12, memoryUsage: 45, lastActive: "2m ago",
    },
    {
      id: "alert-agent", symbol: "A",
      name: "Alert Agent",      role: "Public Broadcast & Siren Geofencing",
      status: "idle",    tasksCompleted: 8,  cpuUsage: 5,  memoryUsage: 32, lastActive: "5m ago",
    },
  ]);

  const toggle = (id: string) => {
    setAgents(prev => prev.map(ag => {
      if (ag.id !== id) return ag;
      const next = ag.status === "active" ? "offline" : "active";
      return { ...ag, status: next as AgentStatus["status"], cpuUsage: next === "active" ? 35 : 0, memoryUsage: next === "active" ? 50 : 0 };
    }));
  };

  return (
    <div className="sn-panel flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--border-base)" }}
      >
        <div className="flex items-center gap-2">
          <span className="sn-dot sn-dot-live" />
          <span className="sn-label-accent">Active Swarm Telemetry</span>
        </div>
        <span className="sn-label">SWARM_SIZE: 4 // ORCHESTRATOR ONLINE</span>
      </div>

      {/* List */}
      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {agents.map(ag => {
          const sm = STATUS_MAP[ag.status];
          const isOffline = ag.status === "offline";
          return (
            <div
              key={ag.id}
              className="p-4 rounded transition-all duration-200"
              style={{
                background: ag.status === "active" ? "rgba(56,189,248,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${ag.status === "active" ? "var(--border-accent)" : "var(--border-subtle)"}`,
              }}
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0"
                    style={{
                      background: "rgba(56,189,248,0.08)",
                      border: "1px solid rgba(56,189,248,0.18)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    {ag.symbol}
                  </div>
                  <div>
                    <div className="text-[11px] font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
                      {ag.name.toUpperCase()}
                    </div>
                    <div className="sn-label">{ag.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`sn-badge ${sm.badge}`}>{ag.status.toUpperCase()}</span>
                  <button
                    onClick={() => toggle(ag.id)}
                    className={ag.status === "active" ? "sn-btn-ghost" : "sn-btn-secondary"}
                    style={{ padding: "4px 10px", fontSize: 9 }}
                  >
                    {ag.status === "active" ? "TERMINATE" : "BOOT"}
                  </button>
                </div>
              </div>

              {/* Metrics */}
              {!isOffline ? (
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3"
                  style={{ borderTop: "1px solid var(--border-subtle)" }}
                >
                  {[
                    { label: "TASKS DONE", val: String(ag.tasksCompleted), bar: null },
                    { label: "CPU LOAD",   val: `${ag.cpuUsage}%`,         bar: ag.cpuUsage        },
                    { label: "RAM USAGE",  val: `${ag.memoryUsage}%`,      bar: ag.memoryUsage     },
                    { label: "HEARTBEAT",  val: "ONLINE",                  bar: null               },
                  ].map(({ label, val, bar }) => (
                    <div key={label}>
                      <div className="sn-label mb-1">{label}</div>
                      <div className="text-[11px] font-mono font-semibold" style={{ color: label === "HEARTBEAT" ? "var(--color-success)" : "var(--text-primary)" }}>
                        {val}
                      </div>
                      {bar !== null && (
                        <div className="sn-bar-track mt-1.5">
                          <div className="sn-bar-fill" style={{ width: `${bar}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-3 text-center sn-label" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  SERVICE OFFLINE — TELEMETRY LOST
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
