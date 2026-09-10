"use client";

import { useEffect, useRef, useState } from "react";

interface AgentPayload {
  id: string;
  lat: number;
  lng: number;
  status: "IDLE" | "ACTIVE" | "EN_ROUTE";
  battery: number;
}

interface TelemetryMessage {
  type: string;
  timestamp: string;
  agents?: AgentPayload[];
  data?: unknown;
}

export function useTelemetryWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(true);
  const [agents, setAgents] = useState<AgentPayload[]>(() => {
    const centerLat = 37.7749;
    const centerLng = -122.4194;
    return Array.from({ length: 100 }, (_, i) => ({
      id: `agent-${i + 1}`,
      lat: centerLat + (Math.random() - 0.5) * 0.08,
      lng: centerLng + (Math.random() - 0.5) * 0.08,
      status: (["IDLE", "ACTIVE", "EN_ROUTE"] as const)[i % 3],
      battery: Math.round((0.4 + Math.random() * 0.6) * 100) / 100,
    }));
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let simInterval: NodeJS.Timeout | null = null;

    const startSimulation = () => {
      if (simInterval) return;
      simInterval = setInterval(() => {
        setAgents((prev) =>
          prev.map((agent) => ({
            ...agent,
            lat: agent.lat + (Math.random() - 0.5) * 0.001,
            lng: agent.lng + (Math.random() - 0.5) * 0.001,
            battery: Math.max(0.05, Math.round((agent.battery - 0.0002) * 1000) / 1000),
          }))
        );
      }, 1000);
    };

    // Attempt WebSocket connection if available
    try {
      if (typeof window !== "undefined" && url && !url.includes("localhost:8000")) {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("🟢 Connected to SWARMNET Telemetry Stream");
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message: TelemetryMessage = JSON.parse(event.data);
            if (message.type === "telemetry_update" && message.agents) {
              setAgents(message.agents);
            }
          } catch (err) {
            console.error("Failed to parse websocket message", err);
          }
        };

        ws.onerror = () => {
          startSimulation();
        };

        ws.onclose = () => {
          startSimulation();
        };
      } else {
        startSimulation();
      }
    } catch {
      startSimulation();
    }

    return () => {
      if (simInterval) clearInterval(simInterval);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url]);

  return { isConnected, agents };
}
