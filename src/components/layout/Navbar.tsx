/**
 * SWARMNET — Navbar (Cinematic Fusion)
 * ======================================
 * Authoritative header with live telemetry strip,
 * tactical identity, sharp nav tabs.
 */
"use client";

import { Settings, Radio, User, Shield } from "lucide-react";
import { Badge } from "../ui/Badge";

interface NavbarProps {
  currentView: string;
  setCurrentView: (v: string) => void;
}

const TABS = [
  { id: "command",   label: "COMMAND"   },
  { id: "swarms",    label: "SWARMS"    },
  { id: "incidents", label: "INCIDENTS" },
  { id: "network",   label: "NETWORK"   },
  { id: "analytics", label: "ANALYTICS" },
];

export default function Navbar({ currentView, setCurrentView }: NavbarProps) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-14"
      style={{
        background: "rgba(4,6,15,0.94)",
        backdropFilter: "blur(28px) saturate(180%)",
        borderBottom: "1px solid rgba(34,211,238,0.10)",
        boxShadow: "0 1px 0 rgba(34,211,238,0.04), 0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center gap-8">

        {/* ── Brand ── */}
        <button
          onClick={() => setCurrentView("boot")}
          className="flex items-center gap-3 shrink-0 group"
        >
          {/* Swarm icon */}
          <div
            className="w-7 h-7 rounded flex items-center justify-center relative sn-glow-breathe"
            style={{
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.28)",
            }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="rgba(56,189,248,0.9)" strokeWidth="1.5">
              <line x1="8" y1="1.5" x2="8" y2="14.5" />
              <line x1="1.5" y1="8" x2="14.5" y2="8" />
              <line x1="3.2" y1="3.2" x2="12.8" y2="12.8" />
              <line x1="12.8" y1="3.2" x2="3.2" y2="12.8" />
            </svg>
          </div>
          <div>
            <span
              className="text-sm font-extrabold tracking-[0.22em] group-hover:text-[var(--intel-primary)] transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
            >
              SWARMNET
            </span>
          </div>
          <Badge variant="geo" className="hidden sm:flex items-center gap-1">
            <Shield size={8} />
            CLASSIFIED
          </Badge>
        </button>

        {/* ── Nav tabs ── */}
        <nav className="flex items-center gap-0.5">
          {TABS.map((tab) => {
            const active = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className="relative px-5 py-1.5 text-[11px] font-mono tracking-[0.15em] transition-all duration-200"
                style={{
                  color: active ? "var(--intel-primary)" : "var(--text-muted)",
                  background: active ? "rgba(56,189,248,0.05)" : "transparent",
                  borderRadius: 6,
                }}
              >
                {tab.label}
                {active && (
                  <span
                    className="absolute bottom-0 inset-x-3 h-[2px] rounded-full"
                    style={{ background: "var(--intel-primary)", boxShadow: "0 0 8px var(--intel-primary)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Live telemetry strip ── */}
        <div className="hidden lg:flex items-center gap-5 ml-4">
          {[
            { dot: "sn-dot-alert",  label: "2 CRITICAL",      color: "var(--color-critical)"  },
            { dot: "sn-dot-intel",  label: "4,029 NODES",     color: "var(--intel-primary)"   },
            { dot: "sn-dot-live",   label: "NOMINAL",         color: "var(--color-success)"   },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`sn-dot ${s.dot}`} />
              <span className="text-[9px] font-mono font-semibold tracking-widest" style={{ color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Right cluster ── */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {/* UTC clock */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded font-mono text-[10px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-base)",
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
            }}
          >
            UTC {new Date().toISOString().slice(11, 19)}
          </div>

          <div style={{ width: 1, height: 16, background: "var(--border-base)" }} />

          {[
            { Icon: Radio,    label: "Telemetry" },
            { Icon: Settings, label: "Settings"  },
            { Icon: User,     label: "Profile"   },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              title={label}
              className="transition-colors duration-150 p-1"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--intel-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
