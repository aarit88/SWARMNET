/**
 * SWARMNET — Cinematic Boot Sequence
 * =====================================
 * Activation screen: living map preview, classified terminal,
 * measured loading — no glitch, no CRT — pure intelligence.
 */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Globe, Radio } from "lucide-react";
import TacticalMapCanvas from "./TacticalMapCanvas";

interface Props { onComplete: () => void; }

const INIT_STEPS = [
  "Establishing AES-256-GCM secure channel...",
  "Resolving distributed coordinator mesh [4,029 nodes]...",
  "Synchronizing neural coordination grid...",
  "Verifying cryptographic node handshakes...",
  "Loading tactical intelligence feed...",
  "Calibrating AI prediction engine v7.2.1...",
  "All systems nominal — entering command cockpit.",
];

const EASE_C: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function BootSequence({ onComplete }: Props) {
  const [initiated, setInitiated] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [logs,      setLogs]      = useState<string[]>([]);
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    if (!initiated) return;
    let li = 0;
    const logInterval = setInterval(() => {
      if (li < INIT_STEPS.length) setLogs(p => [...p, INIT_STEPS[li++]]);
      else clearInterval(logInterval);
    }, 360);

    const progInterval = setInterval(() => {
      setProgress(p => {
        const n = p + Math.random() * 9 + 3;
        if (n >= 100) {
          clearInterval(progInterval);
          setTimeout(() => { setDone(true); setTimeout(onComplete, 700); }, 600);
          return 100;
        }
        return n;
      });
    }, 130);

    return () => { clearInterval(logInterval); clearInterval(progInterval); };
  }, [initiated, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "var(--surface-void)" }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.6, ease: EASE_C } }}
        >
          {/* Atmospheric radial bloom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(34,211,238,0.06) 0%, rgba(56,189,248,0.03) 40%, transparent 70%)",
            }}
          />

          {/* Tactical grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }}>
            <div className="w-full h-full" style={{
              backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-12 gap-6 items-center">

            {/* Left — Brand + CTA */}
            <motion.div
              className="col-span-12 md:col-span-5"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE_C }}
            >
              {/* Logo row */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center sn-glow-breathe"
                  style={{
                    background: "rgba(56,189,248,0.08)",
                    border: "1px solid rgba(56,189,248,0.3)",
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="rgba(56,189,248,0.9)" strokeWidth="1.4">
                    <line x1="8" y1="1.5" x2="8" y2="14.5" /><line x1="1.5" y1="8" x2="14.5" y2="8" />
                    <line x1="3.2" y1="3.2" x2="12.8" y2="12.8" /><line x1="12.8" y1="3.2" x2="3.2" y2="12.8" />
                  </svg>
                </div>
                <div>
                  <div
                    className="text-2xl font-extrabold tracking-[0.22em]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
                  >
                    SWARMNET
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="sn-dot sn-dot-live" />
                    <span className="sn-label" style={{ color: "var(--color-success)" }}>COORDINATION ACTIVE</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight mb-3 leading-[1.1]" style={{ color: "var(--text-primary)" }}>
                AI Emergency<br />
                <span style={{ color: "var(--intel-primary)" }}>Command Platform</span>
              </h1>

              <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: "var(--text-secondary)" }}>
                4,029 autonomous AI agents. Real-time swarm coordination.
                Zero-latency global emergency response infrastructure.
              </p>

              {/* Stats */}
              <div className="flex gap-6 mb-8">
                {[
                  { Icon: Zap,    val: "12ms",    label: "Latency"    },
                  { Icon: Shield, val: "AES-256", label: "Encryption" },
                  { Icon: Globe,  val: "Global",  label: "Coverage"   },
                  { Icon: Radio,  val: "LIVE",    label: "Feed"       },
                ].map(({ Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={12} style={{ color: "var(--text-muted)" }} />
                    <div>
                      <div className="text-[11px] font-mono font-bold" style={{ color: "var(--text-primary)" }}>{val}</div>
                      <div className="sn-label">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA / Progress */}
              {!initiated ? (
                <button
                  onClick={() => setInitiated(true)}
                  className="sn-btn-primary px-10 py-3 text-sm"
                >
                  INITIATE SWARMNET
                </button>
              ) : (
                <div className="space-y-2.5 max-w-xs">
                  <div className="flex justify-between text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                    <span>Initializing swarm coordination</span>
                    <span style={{ color: "var(--intel-primary)" }}>{Math.round(progress)}%</span>
                  </div>
                  <div className="sn-bar-track" style={{ height: 3 }}>
                    <div
                      className="sn-bar-fill"
                      style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(56,189,248,0.4)", transition: "width 0.25s ease" }}
                    />
                  </div>
                  {progress >= 100 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-mono"
                      style={{ color: "var(--color-success)" }}
                    >
                      ✓ All systems nominal — entering command cockpit
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right — Tactical Map Preview + Console */}
            <motion.div
              className="col-span-12 md:col-span-7 flex flex-col gap-4"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_C }}
            >
              {/* Live map preview */}
              <div
                className="sn-panel sn-panel-geo relative overflow-hidden sn-bracket"
                style={{ height: 280 }}
              >
                <div
                  className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-2.5"
                  style={{ background: "rgba(3,6,16,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(34,211,238,0.12)" }}
                >
                  <span className="sn-label-geo">Live Tactical Preview</span>
                  <div className="flex items-center gap-1.5">
                    <span className="sn-dot sn-dot-live" />
                    <span className="sn-label" style={{ color: "var(--color-success)" }}>FEED ACTIVE</span>
                  </div>
                </div>
                <TacticalMapCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              </div>

              {/* Console */}
              <div className="sn-panel p-5">
                <div
                  className="flex items-center justify-between pb-3 mb-3"
                  style={{ borderBottom: "1px solid var(--border-base)" }}
                >
                  <span className="sn-label-accent">INIT CONSOLE</span>
                  <span className="sn-label">[SN-X_902]</span>
                </div>
                <div className="space-y-1.5 min-h-[80px] max-h-[100px] overflow-y-auto">
                  {[
                    { t: "UPDATING COORDINATION MATRIX", s: "ACTIVE",  c: "var(--intel-primary)"  },
                    { t: "ENCRYPTING TUNNEL-77",          s: "OK",      c: "var(--color-success)"  },
                    { t: "DEPLOYING NODES SECTOR-A2",     s: "ACTIVE",  c: "var(--intel-primary)"  },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                      <span>&gt; {r.t}</span>
                      <span style={{ color: r.c }}>{r.s}</span>
                    </div>
                  ))}
                  {logs.map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-mono"
                      style={{ color: "var(--geo-primary)" }}
                    >
                      &gt; {l}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
