import { NextResponse } from "next/server";

export async function GET() {
  const agents = [
    {
      id: "incident-agent",
      symbol: "I",
      name: "Incident Agent",
      role: "Anomaly Detection & Classification",
      status: "active",
      tasksCompleted: 34,
      cpuUsage: 42,
      memoryUsage: 68,
      lastActive: "Just now",
    },
    {
      id: "traffic-agent",
      symbol: "T",
      name: "Traffic Agent",
      role: "Emergency Corridor Optimization",
      status: "active",
      tasksCompleted: 21,
      cpuUsage: 56,
      memoryUsage: 74,
      lastActive: "Just now",
    },
    {
      id: "hospital-agent",
      symbol: "H",
      name: "Hospital Agent",
      role: "Capacity Management & Patient Routing",
      status: "standby",
      tasksCompleted: 15,
      cpuUsage: 12,
      memoryUsage: 45,
      lastActive: "2m ago",
    },
    {
      id: "alert-agent",
      symbol: "A",
      name: "Alert Agent",
      role: "Public Broadcast & Siren Geofencing",
      status: "idle",
      tasksCompleted: 8,
      cpuUsage: 5,
      memoryUsage: 32,
      lastActive: "5m ago",
    },
  ];

  return NextResponse.json(agents);
}
