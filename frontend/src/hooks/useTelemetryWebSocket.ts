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
  data?: any;
}

export function useTelemetryWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [agents, setAgents] = useState<AgentPayload[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Prevent multiple connections in React StrictMode
    if (wsRef.current) return;

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
          // Update agents in state. For a massive swarm, we might use
          // Zustand or mutable refs to avoid React render cycles, but state works for now.
          setAgents(message.agents);
        } else if (message.type === "new_incident") {
          console.warn("🚨 NEW INCIDENT DETECTED:", message.data);
          // TODO: dispatch to incident store
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.onclose = () => {
      console.log("🔴 Disconnected from Telemetry Stream");
      setIsConnected(false);
      wsRef.current = null;
      // Basic reconnect logic
      setTimeout(() => {
        // In a real app we'd recall the effect or trigger a reconnect
      }, 3000);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url]);

  return { isConnected, agents };
}
