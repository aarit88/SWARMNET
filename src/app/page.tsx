/**
 * SWARMNET — Dashboard Root Page
 * ================================
 * Cinematic shell: living background, boot sequence,
 * navbar, status strip, view switcher.
 */
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LivingBackground       from "@/components/dashboard/LivingBackground";
import BootSequence           from "@/components/dashboard/BootSequence";
import Navbar                 from "@/components/layout/Navbar";
import DashboardCommandView   from "@/components/dashboard/DashboardCommandView";
import DashboardSwarmsView    from "@/components/dashboard/DashboardSwarmsView";
import DashboardIncidentsView from "@/components/dashboard/DashboardIncidentsView";
import DashboardNetworkView   from "@/components/dashboard/DashboardNetworkView";
import DashboardAnalyticsView from "@/components/dashboard/DashboardAnalyticsView";

type View = "boot" | "command" | "swarms" | "incidents" | "network" | "analytics";

export default function Home() {
  const [view, setView] = useState<View>("boot");

  return (
    <>
      {/* Cinematic ambient background — always behind */}
      <LivingBackground />

      {/* Deep radial atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(56,189,248,0.05) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Boot overlay */}
      <AnimatePresence>
        {view === "boot" && (
          <div style={{ position: "relative", zIndex: 50 }}>
            <BootSequence onComplete={() => setView("command")} />
          </div>
        )}
      </AnimatePresence>

      {/* Main dashboard shell */}
      {view !== "boot" && (
        <div className="relative min-h-screen flex flex-col" style={{ zIndex: 10 }}>
          <Navbar currentView={view} setCurrentView={(v) => setView(v as View)} />

          <main className="flex-1 pt-14">
            <div className="max-w-screen-2xl mx-auto px-5 py-5">

              {/* Status strip */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center gap-6 mb-5 pb-4"
                style={{ borderBottom: "1px solid rgba(34,211,238,0.08)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="sn-dot sn-dot-live" />
                  <span className="sn-label" style={{ color: "var(--color-success)" }}>ALL SYSTEMS NOMINAL</span>
                </div>
                {[
                  { l: "INCIDENTS", v: "2 CRITICAL",  c: "var(--color-critical)"  },
                  { l: "LATENCY",   v: "12ms",         c: "var(--intel-primary)"   },
                  { l: "UPTIME",    v: "99.94%",        c: "var(--color-success)"   },
                  { l: "AI MODE",   v: "AUTONOMOUS",    c: "var(--neural-primary)"  },
                  { l: "NODES",     v: "4,029 LIVE",    c: "var(--intel-primary)"   },
                ].map(s => (
                  <div key={s.l} className="flex items-center gap-2">
                    <span className="sn-label">{s.l}</span>
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: s.c }}>{s.v}</span>
                  </div>
                ))}
                <div className="ml-auto hidden md:flex items-center gap-2">
                  <span className="sn-label">UTC</span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
                    {new Date().toISOString().replace("T", " ").slice(0, 19)}
                  </span>
                </div>
              </motion.div>

              {/* View switcher */}
              <AnimatePresence mode="wait">
                {view === "command"   && <motion.div key="cmd"  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}><DashboardCommandView /></motion.div>}
                {view === "swarms"    && <motion.div key="sw"   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}><DashboardSwarmsView /></motion.div>}
                {view === "incidents" && <motion.div key="inc"  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}><DashboardIncidentsView /></motion.div>}
                {view === "network"   && <motion.div key="net"  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}><DashboardNetworkView /></motion.div>}
                {view === "analytics" && <motion.div key="an"   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}><DashboardAnalyticsView /></motion.div>}
              </AnimatePresence>

            </div>
          </main>

          {/* Footer */}
          <footer
            className="shrink-0 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4"
            style={{
              borderTop: "1px solid rgba(34,211,238,0.07)",
              background: "rgba(3,5,14,0.7)",
              backdropFilter: "blur(16px)",
              zIndex: 10,
            }}
          >
            <span className="sn-label">SWARMNET © 2035 · AI EMERGENCY COORDINATION PLATFORM</span>
            <div className="flex items-center gap-5">
              <span className="sn-label">KERNEL v4.0.2</span>
              <span className="sn-label">AES-256-GCM</span>
              <div className="flex items-center gap-1.5">
                <span className="sn-dot sn-dot-live" />
                <span className="sn-label" style={{ color: "var(--color-success)" }}>SECURE CHANNEL</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
