/**
 * SWARMNET — Live Emergency Map (High-Fidelity Mockup)
 * ====================================================
 * A futuristic tactical emergency response map.
 * Visualizes mock incident locations, agent positions, and routing corridors
 * using SVG overlays, scanning radar effects, and interactive telemetry.
 */

"use client";

import { useState, useEffect } from "react";

interface MapMarker {
  id: string;
  type: "incident" | "agent";
  name: string;
  lat: number; // Y coordinate mock (0-100)
  lng: number; // X coordinate mock (0-100)
  status: "critical" | "warning" | "active" | "idle";
  details?: string;
}

export default function LiveMap() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [radarPing, setRadarPing] = useState({ x: 50, y: 50, active: false });

  // Initial mock markers
  const [markers, setMarkers] = useState<MapMarker[]>([
    {
      id: "inc-001",
      type: "incident",
      name: "Commercial Structure Fire",
      lat: 38,
      lng: 45,
      status: "critical",
      details: "Main St. Commercial Zone. 3 active alarms. Dispatching alert_agent.",
    },
    {
      id: "inc-002",
      type: "incident",
      name: "Multiple Vehicle Collision",
      lat: 65,
      lng: 28,
      status: "warning",
      details: "I-95 Southbound. 4 vehicles involved. Traffic routing active.",
    },
    {
      id: "agt-001",
      type: "agent",
      name: "INCIDENT_AGENT_01",
      lat: 42,
      lng: 48,
      status: "active",
      details: "Analyzing fire containment vectors and structural integrity.",
    },
    {
      id: "agt-002",
      type: "agent",
      name: "TRAFFIC_AGENT_02",
      lat: 60,
      lng: 32,
      status: "active",
      details: "Modifying regional signal cycles. Clearing path on expressways.",
    },
    {
      id: "agt-003",
      type: "agent",
      name: "HOSPITAL_AGENT_01",
      lat: 25,
      lng: 70,
      status: "idle",
      details: "Standing by. Hospital capacities operating at 72%.",
    },
  ]);

  // Periodic simulated movement / telemetry update
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate minor coordinate drift for agents
      setMarkers((prev) =>
        prev.map((m) => {
          if (m.type === "agent" && m.status === "active") {
            const deltaX = (Math.random() - 0.5) * 1.5;
            const deltaY = (Math.random() - 0.5) * 1.5;
            return {
              ...m,
              lat: Math.min(Math.max(m.lat + deltaY, 10), 90),
              lng: Math.min(Math.max(m.lng + deltaX, 10), 90),
            };
          }
          return m;
        })
      );

      // Trigger radar sweep at a random incident
      const incidents = markers.filter((m) => m.type === "incident");
      if (incidents.length > 0 && Math.random() > 0.4) {
        const randomInc = incidents[Math.floor(Math.random() * incidents.length)];
        setRadarPing({ x: randomInc.lng, y: randomInc.lat, active: true });
        setTimeout(() => {
          setRadarPing((p) => ({ ...p, active: false }));
        }, 1000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [markers]);

  return (
    <div className="glass-card flex flex-col h-[500px] overflow-hidden relative">
      {/* Tactical Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full pulse-dot" />
          <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--accent-cyan)]">
            Live Emergency Map
          </h2>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">
          TACTICAL OVERVIEW // GRID 40.7128° N, 74.0060° W
        </span>
      </div>

      {/* Map Viewport */}
      <div className="flex-1 bg-[#040613] relative overflow-hidden grid-bg">
        {/* Dynamic Scan Line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="w-full h-[2px] bg-[var(--accent-cyan)]/25 blur-[1px] absolute"
            style={{
              animation: "scan 6s linear infinite",
            }}
          />
        </div>

        {/* Tactical SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Simulated connecting routes between agents and incidents */}
          <line
            x1="45%"
            y1="38%"
            x2={`${markers.find((m) => m.id === "agt-001")?.lng}%`}
            y2={`${markers.find((m) => m.id === "agt-001")?.lat}%`}
            stroke="var(--accent-cyan)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-40"
          />
          <line
            x1="28%"
            y1="65%"
            x2={`${markers.find((m) => m.id === "agt-002")?.lng}%`}
            y2={`${markers.find((m) => m.id === "agt-002")?.lat}%`}
            stroke="var(--accent-amber)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-40"
          />

          {/* Radar Sweep Effect */}
          {radarPing.active && (
            <circle
              cx={`${radarPing.x}%`}
              cy={`${radarPing.y}%`}
              r="40"
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth="1"
              className="animate-ping opacity-75"
            />
          )}
        </svg>

        {/* Interactive Markers */}
        {markers.map((marker) => {
          const isSelected = selectedMarker?.id === marker.id;
          const isIncident = marker.type === "incident";

          return (
            <button
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus:outline-none z-10"
              style={{ top: `${marker.lat}%`, left: `${marker.lng}%` }}
            >
              <div className="relative group">
                {/* Visual indicator */}
                {isIncident ? (
                  /* Incident Marker (Triangle/Pulse) */
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <span
                      className={`absolute w-8 h-8 rounded-full opacity-35 animate-ping ${
                        marker.status === "critical"
                          ? "bg-[var(--accent-red)]"
                          : "bg-[var(--accent-amber)]"
                      }`}
                    />
                    <div
                      className={`w-4 h-4 rotate-45 border-2 ${
                        marker.status === "critical"
                          ? "bg-[var(--accent-red)]/80 border-[var(--accent-red)]"
                          : "bg-[var(--accent-amber)]/80 border-[var(--accent-amber)]"
                      } ${isSelected ? "scale-125 ring-4 ring-white/20" : ""}`}
                    />
                  </div>
                ) : (
                  /* Agent Marker (Hexagon/Circle) */
                  <div className="relative flex items-center justify-center w-7 h-7">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 bg-slate-900 border-[var(--accent-cyan)] ${
                        isSelected ? "scale-125 ring-4 ring-[var(--accent-cyan)]/30" : ""
                      }`}
                    />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-green)] pulse-dot" />
                  </div>
                )}

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {marker.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Telemetry Details Panel */}
      {selectedMarker ? (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg-secondary)]/95 border-t border-[var(--border-subtle)] backdrop-blur-md flex items-start gap-4 transition-all duration-300">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                  selectedMarker.type === "incident"
                    ? "bg-[var(--accent-red)]/10 text-[var(--accent-red)]"
                    : "bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]"
                }`}
              >
                {selectedMarker.type}
              </span>
              <h3 className="text-sm font-semibold">{selectedMarker.name}</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {selectedMarker.details}
            </p>
            <div className="flex gap-4 mt-2 font-mono text-[10px] text-[var(--text-muted)]">
              <span>LAT: {selectedMarker.lat.toFixed(4)}°</span>
              <span>LNG: {selectedMarker.lng.toFixed(4)}°</span>
              <span>STATUS: {selectedMarker.status.toUpperCase()}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedMarker(null)}
            className="text-[var(--text-muted)] hover:text-white text-xs px-2 py-1 border border-[var(--border-subtle)] rounded hover:bg-white/5 transition-all"
          >
            DISMISS
          </button>
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 p-2 bg-[var(--bg-secondary)]/80 backdrop-blur-md rounded border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] font-mono flex gap-4 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 border border-[var(--accent-red)] bg-[var(--accent-red)]/20" />
            <span>INCIDENT (CRITICAL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 border border-[var(--accent-amber)] bg-[var(--accent-amber)]/20" />
            <span>INCIDENT (WARNING)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[var(--accent-cyan)] bg-slate-900" />
            <span>ACTIVE AGENT</span>
          </div>
        </div>
      )}
    </div>
  );
}
